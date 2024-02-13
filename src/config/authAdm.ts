import 'dotenv/config'

export const authConfig = {
  secret: (process.env.PASSAUTH_ADM as string)
}
