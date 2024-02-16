import { Router } from 'express'
import userAdmRouters from './userAdm.routers'
import authAdmRouter from './authAdm.router'

import authUserRouters from './authUser.router'
import productRouters from './product.router'

const routers = Router()

routers.use('/userAdmRouters', userAdmRouters)
routers.use('/authAdm', authAdmRouter)

routers.use('/authUser', authUserRouters)

routers.use('/product', productRouters)

export default routers
