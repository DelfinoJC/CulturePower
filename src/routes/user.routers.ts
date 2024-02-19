import { Router } from "express";
import { hash } from 'bcrypt';
import { User } from "../models/User";
import { Product } from "../models/Product";
import { ValidationError } from "yup";

import * as userSchema from "../schema/userSchema";
import validateRouter from "../middleware/validateRouter";
import { authUser } from "../middleware/userAuth.middleware";
import { upload } from "../middleware/upload";

const routers = Router()


// create new user [ x ]
routers.post('/', validateRouter(userSchema.CreateUsers.schema), async (req, res) => {

  try{
    const user = await req.body

    const existingEmail = await User.findOne({ email: user.email})
    const existingName = await User.findOne({name: user.name})

    if(existingEmail != null) {
      return res.status(400).json({ error: 'User already in use' });
    }
    if(existingName != null) {
      return res.status(400).json({ error: 'User already in use' });
    }

    // const { file } = req.body.photo
    user.password = await hash(user.password,8)

    const newUser = await new User(user).save()
    res.status(201).json(newUser)

  } catch(error) {
    console.log(error)
    const { name, message, errors } = error as ValidationError
      res.status(406).send({ name, message, errors })
  }

}) 

// recover product
routers.patch('/recoverProduct', authUser, async (req, res) => {
 try { 
  const { idUser, idProduct } = req.body

  const user = await User.findById(idUser).exec()
  if(!user){
    return res.status(404).send('User was not found')
  }

  const existProduct = await Product.findById(idProduct).exec()
  if(!existProduct){
    return res.status(404).send('Product was not found')
  }

  console.log("aqui esta user",user)
  console.log("aqui esta produ",existProduct)


  if(idUser.jewelry < idProduct.price) {
    return res.status(404).send({ message: 'You dont have enough jewels to make the exchange'})
  }

    const updateOperation = user === undefined || [] ?
    { $inc: { products: existProduct } } : { $set: { products: user.products.push(existProduct) } }

  const updatedProduct = await User.findOneAndUpdate({ _id: idUser }, updateOperation, { new: true })
    
  idProduct.amount --
    if(updatedProduct !== null)

    await updatedProduct.save()

  } catch (error) {
    const { errors, message } = error as ValidationError
    res.status(400).send({ validationErrors: errors, message })
  }


})

// update user with id [  ]
routers.put('/updateUser/:id', authUser, async (req, res) => {
  try {
    const user = req.body
    const { id } = req.params
    const userForUpdate = await User.findByIdAndUpdate(id, user).exec()
    if (!userForUpdate) {
      res.status(204).send({ message: `Car with id ${id} was not found!` })
    }
    const updatedUser = await User.findById(id).exec()
    if (!updatedUser) {
      res.status(204).send({ message: `Car with id ${id} was not found!` })
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

// update image [  ]
routers.put('/uploadImage/:id', authUser, upload.single('image'), async (req, res) => {

  const { file }= req
  
  try {

    const { id } = req.params

    const userForUpdateImage = await User.findByIdAndUpdate(id, {
      photo: file?.filename,
    }).exec()

    if (!userForUpdateImage) {
      return res.status(204).send({ message: `User was not found!` })
    }

    const imageUpdate = await User.findById(id)
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

// delete user with id [  ]
routers.delete('/:id', authUser, async (req, res) => {
  const userParam = req
  try {
    const { id } = userParam.params
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.send({ message: `User with id ${id} was not found!` })
    }

    res.status(204).send({message: 'User deleted'})

  } catch (error) {
    const { errors, message } = error as ValidationError
    res.status(400).send({ validationErrors: errors, message })
  }
})

export default routers
