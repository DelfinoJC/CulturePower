import app from './app'
import { serverConfig } from './config/server'

app.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`)
})
