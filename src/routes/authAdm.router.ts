import { Router } from "express";
import { ValidationError } from "yup";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';

import { Adm } from "../models/Adm";
import * as loggerSchema from "../schema/loggerSchema";

import {authConfig} from "../config/authAdm";
import validateRouter from "../middleware/validateRouter";

const router = Router()

router.post("/", validateRouter(loggerSchema.CreateLogger.schema), async (req, res) => {

  try{
    const { email, password } = await req.body
    const adm = await Adm.findOne({email})
    if (!adm){
      return res.status(401).send({messege: `User invalidate 1`})
    }

    const passwordCompare = await compare(password, adm.password)
    if(!passwordCompare) {
      return res.status(401).send({messege: `User invalidate`})
    }

    adm.password = ''

    const token = jwt.sign({sub: adm.id}, authConfig.secret, {expiresIn: 24*60*60 })

    res.send({adm, token})
    
  } catch(error) {
    const { name, message, errors } = error as ValidationError
      console.log(error)
      res.status(406).send({ name, message, errors })
  }
})

export default router
