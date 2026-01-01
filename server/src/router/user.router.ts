import express from 'express'
import { getMe, editProfile } from '@/controller/user.controller'

const router = express.Router()

router.get('/me', getMe)
router.patch('/profile', editProfile)

export default router