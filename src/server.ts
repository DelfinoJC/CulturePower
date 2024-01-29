import { serverConfig } from './config/server'
import express from 'express'
import router from './routes/index'

const server = express()

server.use(router)

server.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`)
})
