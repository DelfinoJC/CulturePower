import { Router } from 'express'
import userRouters from './user.routers'
import authRouters from './auth.router'

const routers = Router()

routers.use('/userRegister', userRouters)
routers.use('/auth', authRouters)

export default routers
