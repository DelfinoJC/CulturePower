import { Router } from "express";
import { hash } from 'bcrypt';
import { Adm } from "../models/Adm";
import { User } from "../models/User";
import { ValidationError } from "yup";

import * as userSchema from "../schema/userSchema";
import validateRouter from "../middleware/validateRouter";
import { auth } from "../middleware/admAuth.middleware";
import { upload } from "../middleware/upload";

const routers = Router()


// create new adm [ x ]
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

// get all User [ x ]
routers.get('/',  auth, async (req, res) => {
  const users = await Adm.find()
  res.send(users)
})

// get user with id [ x ]
routers.get('/:_id', auth, async (req, res) => {
  const userParam = req
  try {
    const { _id } = userParam.params
    const user = await User.findById(_id)
    if (!user) {
      return res.send({ message: `User with id ${_id} was not found!` })
    }

    console.log(user)
    res.send(user).status(204)

  } catch (error) {
    const { errors, message } = error as ValidationError
    res.status(400).send({ validationErrors: errors, message })
  }
})

// upload user with id [ x ]
routers.put('/updateUser/:id', auth, async (req, res) => {
  try {
    const user = req.body
    const { id } = req.params

    const userForUpdate = await Adm.findByIdAndUpdate(id, user).exec()
    if (!userForUpdate) {
      res.status(204).send({ message: `User was not found!` })
    } 

    const updatedUser = await User.findById(id).exec()
    if (!updatedUser) {
      res.status(204).send({ message: `Error when updating` })
      return
    }

    updatedUser.__v += 1
    await updatedUser.save()
    res.status(200).send(updatedUser)

  } catch (error: any) {
    console.log(error)
    res.status(500).send(`Internal Server Error: ${error}`)
  }
})

// upload image [ x ]
routers.put('/uploadImage/:id', auth, upload.single('image'), async (req, res) => {

  const { file }= req
  
  try {

    const { id } = req.params

    const admForUpdateImage = await Adm.findByIdAndUpdate(id, {
      photo: file?.filename,
    }).exec()

    if (!admForUpdateImage) {
      return res.status(204).send({ message: `User was not found!` })
    }

    const imageUpdate = await Adm.findById(id)
    if (!imageUpdate) {
      return res.status(204).send({ message: `User was not found!` })
    }

    await imageUpdate.save()
    res.status(200).send(imageUpdate)

  } catch (error) {
    const { errors } = error as ValidationError
    console.log(error)
    res.status(400).send({ validationErrors: errors })
  }

})

// send gems to user [ X ]
routers.patch('/sendGems/:id', auth, async (req, res) => {
  
  try{
    const { id } = req.params

    const { jewels } = req.body
console.log(jewels)
    const userExist = await User.findById(id)
    if(!userExist){
      return res.status(404).send('User was not found')
    }

    const updateOperation = userExist.jewelry === undefined || 0 ?
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    { $inc: { jewelry: jewels } } : { $set: { jewelry: userExist.jewelry += jewels } }

    const updatedUser = await User.findOneAndUpdate({ _id: id }, updateOperation, { new: true })
    if(updatedUser !== null)
    await updatedUser.save()

    console.log(updatedUser)
    res.status(200).send(updatedUser) 

  } catch(error) {
    const { errors, message } = error as ValidationError
    res.status(400).send({ validationErrors: errors, message })
  }
})

// delete user with id [ X ]
routers.delete('/:id', auth, async (req, res) => {
  const userParam = req
  try {
    const { id } = userParam.params
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.send({ message: `User was not found!` })
    }

    res.status(204).send({message: 'User deleted'})

  } catch (error) {
    const { errors, message } = error as ValidationError
    res.status(400).send({ validationErrors: errors, message })
  }
})

export default routers
