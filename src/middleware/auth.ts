import { Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { authConfig } from '../config/auth'

export function auth (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  console.log(authHeader)
    if(!authHeader) {
      return res.status(404).send({ error : 'You dont ADM'})
    }

  const twoPartsToken = authHeader.split(" ")
    if(twoPartsToken.length !== 2){
      return res.status(401).send({ error : "Error of the validate token"})
    }

  const  [tokenSchema, token] = twoPartsToken
    if(tokenSchema !== "Bearer") {
      return res.status(401).send({ error : "Error of the validate token"})
    }

    jwt.verify(token, authConfig.secret, (error: any, decoded: any) => {
      if(error) {
        return res.status(401).send({ error : "Invalidate token"})
      }

      console.log("***********")
      console.log(decoded)
      req.body.userId = decoded.sub as string
      next()
    })

}
