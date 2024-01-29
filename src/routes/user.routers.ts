import { Router } from "express";
import { hash } from 'bcrypt';
import { User } from "../models/User";
import * as Yup from 'yup'

const routers = Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
routers.post('/', async (req, res) => {

  const userQuery = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().required().email(),
    password: Yup.string().required().min(8),
    photo: Yup.string()
  })

  try{
    const user = await userQuery.validate(req.body)

    const oneUser = user.email
    if(oneUser == )
    user.password = await hash(user.password,8)
    const newUser = await new User(user).save()
    res.send(newUser)
    
  } catch(errors) {
    res.status(400).send({validationErros: errors})
  }

})  


export default routers
