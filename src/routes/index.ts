import { Router } from 'express'
import userRouters from './user.routers'
import authRouters from './auth.router'
import productRouters from './product.router'

const routers = Router()

routers.use('/userRegister', userRouters)
routers.use('/auth', authRouters)
routers.use('/product', productRouters)

export default routers
