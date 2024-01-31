import { Router } from "express";
import { hash } from 'bcrypt';
import { User } from "../models/User";
import * as Yup from 'yup'
import { ValidationError } from "yup";
import { upload } from "../middleware/upload";

const routers = Router()

routers.post('/',  async (req, res) => {

  const userQuery = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().required().email(),
    password: Yup.string().required().min(8),
    photo: Yup.string()
  })

  try{
    const user = await userQuery.validate(req.body)

    const existingEmail = await User.findOne({ email: user.email})
    const existingName = await User.findOne({name: user.name})

    if(existingEmail != null) {
      return res.status(400).json({ error: 'User already in use' });
    }
    if(existingName != null) {
      return res.status(400).json({ error: 'User already in use' });
    }

    user.password = await hash(user.password,8)

    const newUser = await new User(user).save()
    res.status(201).json(newUser)

  } catch(error) {
    console.log("deu erro")
    const { name, message, errors } = error as ValidationError
      res.status(406).send({ name, message, errors })
  }

})  


export default routers
