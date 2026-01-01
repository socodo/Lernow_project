import express from 'express'
import { signUp, signIn, refreshAccessToken, logout } from '@/controller/auth.controller'
import { validateBody } from '@/middlewares/validate.middleware'
import { signUpSchema, signInSchema } from '@/validations/auth.validation'

const router = express.Router()

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user
 * @access  Public
 */
router.post('/signup', validateBody(signUpSchema), signUp)

/**
 * @route   POST /api/auth/signin
 * @desc    Sign in user
 * @access  Public
 */
router.post('/signin', validateBody(signInSchema), signIn)

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token', refreshAccessToken)

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', logout)

export default router
