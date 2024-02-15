import { Router } from "express";
import { ValidationError } from "yup";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';

import { User } from "../models/User";
import * as loggerSchema from "../schema/loggerSchema";

import {authConfig} from "../config/authUser";
import validateRouter from "../middleware/validateRouter";

const router = Router()

router.post("/", validateRouter(loggerSchema.CreateLogger.schema), async (req, res) => {

  try{
    const { email, password } = await req.body
    const user = await User.findOne({email})
    if (!user){
      return res.send({messege: `User invalidate`})
    }

    const passwordCompare = await compare(password, user.password)
    if(!passwordCompare) {
      return res.send({messege: `User invalidate`})
    }

    user.password = ''

    const token = jwt.sign({sub: user.id}, authConfig.secret, {expiresIn: 24*60*60 })

    res.send({user, token})
    
  } catch(error) {
    const { name, message, errors } = error as ValidationError
      res.status(406).send({ name, message, errors })
  }
})

export default router
