import { Router } from "express";
import * as Yup from 'yup'
import { User } from "../models/User";
import { ValidationError } from "yup";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';
import {authConfig} from "../config/auth";

const router = Router()

router.post("/", async (req, res) => {
    const authUser = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required().min(8)
  })

  try{
    const { email, password } = await authUser.validate(req.body)
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
