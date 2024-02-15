import { Router } from "express";
import { hash } from 'bcrypt';
import { Adm } from "../models/Adm";
import { ValidationError } from "yup";

import * as userSchema from "../schema/userSchema";
import validateRouter from "../middleware/validateRouter";
import { auth } from "../middleware/admAuth.middleware";
const routers = Router()

routers.post('/', validateRouter(userSchema.CreateUsers.schema), async (req, res) => {

  try{
    const adm = await req.body

    const existingEmail = await Adm.findOne({ email: adm.email})
    const existingName = await Adm.findOne({name: adm.name})

    if(existingEmail != null) {
      return res.status(400).json({ error: 'User already in use' });
    }
    if(existingName != null) {
      return res.status(400).json({ error: 'User already in use' });
    }

    // const { file } = req.body.photo
    adm.password = await hash(adm.password,8)

    const newAdm = await new Adm(adm).save()
    res.status(201).json(newAdm)

  } catch(error) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(error)
    const { name, message, errors } = error as ValidationError
      res.status(406).send({ name, message, errors })
  }

})  

routers.get('/', auth, async (req, res) => {
  const users = await Adm.find()
  res.send(users)
})

routers.delete('/:id', validateRouter(userSchema), auth, async (req, res) => {
  const userParam = req
  try {
    const { id } = userParam.params
    const user = await Adm.findByIdAndDelete(id).exec()
    if (!user) {
      return res.send({ message: `User with id ${id} was not found!` })
    }
    res.sendStatus(204)
  } catch (error) {
    const { errors, message } = error as ValidationError
    res.status(400).send({ validationErrors: errors, message })
  }
})

export default routers
