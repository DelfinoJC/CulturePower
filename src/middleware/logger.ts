import { Request, Response, NextFunction} from 'express'

export function logger (req: Request, res: Response, next: NextFunction) {
  console.log('Time: ', new Date())
  console.log(`Route: ${req.method} ${req.path}`)
  console.log('**********')
  next()
}
