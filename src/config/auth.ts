import 'dotenv/config'

export const authConfig = {
  secret: (process.env.PASSAUTH as string)
}
