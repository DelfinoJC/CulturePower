import { serverConfig } from './config/server'
import server from './app'

server.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`)
})
