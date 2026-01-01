import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Request, Response } from 'express'
import { User } from '@/models/user.model'
import { Session } from '@/models/session.model'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key'
const JWT_EXPIRES_IN = '7d' // 7 days
const REFRESH_TOKEN_EXPIRES_DAYS = 7

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, fullName, dateOfBirth, password } = req.body

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email already registered'
      })
      return
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // 3. Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      fullName: fullName.trim(),
      dateOfBirth,
      passwordHash
    })

    // **Payload 
    const tokenPayload = {
      userId: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role
    }

    // 7. Generate Access Token (JWT - hạn ngắn)
    const accessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    } as any)

    // 8. Generate Refresh Token (crypto.randomBytes - hạn dài 30 ngày)
    const refreshToken = crypto.randomBytes(64).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS)

    // 9. Lưu Refresh Token vào Session collection
    await Session.create({
      userId: newUser._id,
      refreshToken,
      expiresAt
    })

    // 10. Lưu Refresh Token vào HttpOnly Cookie (session cookie - xóa khi đóng browser)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
      // Không có maxAge → session cookie → tự động xóa khi đóng browser
    })

    // 11. Return response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.fullName,
          role: newUser.role,
          isEmailVerified: newUser.isEmailVerified
        },
        accessToken, // JWT token (15 phút)
      }
    })
  } catch (error) {
    console.error('SignUp error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

/**
 * @route   POST /api/auth/signin
 * @desc    Sign in user
 * @access  Public
 */
export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // 1. Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
      return
    }

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
      return
    }

    // 3. Check if account is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      })
      return
    }

    // 4. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
      return
    }

    // 5. Update last login
    user.lastLoginAt = new Date()
    await user.save()

    // 6. Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }

    // 7. Generate Access Token (JWT - hạn ngắn)
    const accessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    })

    // 6. Check existing refresh token in cookie
    let refreshToken = req.cookies.refreshToken
    let needNewRefreshToken = true

    if (refreshToken) {
      // Check if refresh token still valid in database
      const existingSession = await Session.findOne({
        refreshToken,
        userId: user._id
      })

      if (existingSession) {
        needNewRefreshToken = false
      }
    }

    // 7. Create new refresh token if needed
    if (needNewRefreshToken) {
      refreshToken = crypto.randomBytes(64).toString('hex')
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS)

      await Session.create({
        userId: user._id,
        refreshToken,
        expiresAt
      })

      // Set new cookie (session cookie - xóa khi đóng browser)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
        // Không có maxAge → session cookie → tự động xóa khi đóng browser
      })
    }

    // 11. Return response
    res.status(200).json({
      success: true,
      message: 'Login successfully',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          profilePic: user.profilePic,
          balance: user.balance,
          isActive: user.isActive,
          shortDesc: user.shortDesc,
          links: user.links

        },
        accessToken
      }
    })
  } catch (error) {
    console.error('SignIn error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken
    console.log('Received refresh token:', refreshToken)

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      })
      return
    }

    console.log('Found session for refresh token:', refreshToken)

    // Find session (TTL index tự động xóa session hết hạn)
    const session = await Session.findOne({ refreshToken })

    if (!session) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      })
      return
    }

    // Get user
    const user = await User.findById(session.userId)

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      })
      return
    }

    // Generate new access token
    const tokenPayload = {
      userId: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }

    const newAccessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    })

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken
      }
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Public
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Lấy refresh token từ cookie hoặc body
    const refreshToken = req.cookies.refreshToken

    if (refreshToken) {
      // 2. Xóa session khỏi database
      await Session.deleteOne({ refreshToken })
    }

    // 3. Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    // 4. Return success
    res.status(200).json({
      success: true,
      message: 'Logout successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}