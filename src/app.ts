import express from 'express'
import router from './routes'
import { logger } from './middleware/logger'

const server = express()

server.use(express.json())
server.use(logger)
server.use(router)

export default server
