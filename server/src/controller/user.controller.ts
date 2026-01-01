import { Response } from 'express'
import { AuthRequest } from '@/middlewares/auth.middleware'
import { User } from '@/models/user.model'

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
      return
    }

    const user = await User.findById(userId).select('-passwordHash')

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Get user profile successfully',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.fullName,
          fullName: user.fullName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          profilePic: user.profilePic,
          balance: user.balance,
          isActive: user.isActive,
          shortDesc: user.shortDesc,
          links: user.links,
          dateOfBirth: user.dateOfBirth,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('GetMe error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

/**
 * @route   PATCH   
 * @desc    Update user profile
 * @access  Private
 */
export const editProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
      return
    }

    const { fullName, dateOfBirth, profilePic, shortDesc, links } = req.body

    // Validate fullName if provided
    if (fullName !== undefined && fullName !== null) {
      if (typeof fullName !== 'string' || fullName.trim() === '') {
        res.status(400).json({
          success: false,
          message: 'Full name cannot be empty'
        })
        return
      }
    }

    // Validate shortDesc length if provided
    if (shortDesc !== undefined && shortDesc !== null) {
      if (typeof shortDesc !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Bio must be a string'
        })
        return
      }
      if (shortDesc.length > 300) {
        res.status(400).json({
          success: false,
          message: 'Bio cannot exceed 300 characters'
        })
        return
      }
    }

    // Validate dateOfBirth if provided
    if (dateOfBirth !== undefined && dateOfBirth !== null && dateOfBirth !== '') {
      const date = new Date(dateOfBirth)
      if (isNaN(date.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Invalid date format'
        })
        return
      }
      // Check if date is not in the future
      if (date > new Date()) {
        res.status(400).json({
          success: false,
          message: 'Date of birth cannot be in the future'
        })
        return
      }
    }

    // Prepare update object with only provided fields
    const updateData: any = {}

    if (fullName !== undefined && fullName !== null) {
      updateData.fullName = fullName.trim()
    }

    if (dateOfBirth !== undefined && dateOfBirth !== null && dateOfBirth !== '') {
      updateData.dateOfBirth = new Date(dateOfBirth)
    }

    if (profilePic !== undefined) {
      updateData.profilePic = profilePic || undefined
    }

    if (shortDesc !== undefined) {
      updateData.shortDesc = shortDesc || undefined
    }

    if (links !== undefined && links !== null) {
      // Validate links format
      if (typeof links === 'object') {
        updateData.links = {
          linkedin: links.linkedin || undefined,
          googleScholar: links.googleScholar || undefined,
          instagram: links.instagram || undefined,
          facebook: links.facebook || undefined
        }
      }
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: 'No fields to update'
      })
      return
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash')

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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
          links: user.links,
          dateOfBirth: user.dateOfBirth,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('EditProfile error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Update error!'
    })
  }
}