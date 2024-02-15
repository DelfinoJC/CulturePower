import { Router } from "express";
import { ValidationError } from "yup";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';

import { Adm } from "../models/Adm";
import * as loggerSchema from "../schema/loggerSchema";
import { auth } from '../middleware/admAuth.middleware';
import { upload } from "../middleware/upload";

import {authConfig} from "../config/authAdm";
import validateRouter from "../middleware/validateRouter";
import { userSchema } from "../schema/userSchema";

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
      res.status(406).send({ name, message, errors })
  }
})

router.patch('/uploadImage/:id', auth, validateRouter(userSchema), upload.single('image'), async (req, res) => {

  const { file } = req
  
  try {
    const { id } = req.params
    const admForUpdateImage = await Adm.findByIdAndUpdate(id, {
      image: file?.filename,
    }).exec()
    if (!admForUpdateImage) {
      return res.status(204).send({ message: `User was not found!` })
    }
    const imageUpdate = await Adm.findById(id)
    if (!imageUpdate) {
      return res.status(204).send({ message: `User was not found!` })
    }

    imageUpdate.__v += 1

    await imageUpdate.save()
    res.status(200).send(imageUpdate)

  } catch (error) {
    const { errors } = error as ValidationError
    res.status(400).send({ validationErrors: errors })
  }

})

export default router
