import { Router } from 'express'
import userRouters from './user.routers'

const routers = Router()

routers.use('/user', userRouters)

export default routers
