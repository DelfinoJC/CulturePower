import { Router } from 'express'
import * as Yup from 'yup'
import { ValidationError } from "yup";

// import { User } from '../models/User';
import { Product } from '../models/Product'
import * as productSchema  from '../schema/productSchema'

import { authUser } from '../middleware/userAuth.middleware'
import { upload } from '../middleware/upload';
import validateRouter from '../middleware/validateRouter'
import { auth } from '../middleware/admAuth.middleware'

const routers = Router()

// create product with ADM [ x ]
routers.post('/', auth, validateRouter(productSchema.CreateProducts.schema), async (req,res) => {
  
  try{
    const product = await req.body
    const existingProduct = await Product.findOne({ name: product.name})
    if(existingProduct){
      return res.status(401).json({ error: `Product already exists`})
    }
    const newProduct = await new Product(product).save()
    res.status(201).send({ product: newProduct})
  } catch(error) {
    const { errors } = error as Yup.ValidationError;
    res.status(401).send({ validateError: errors })
  }
}) 

// get all product with ADM and USER [ x ]
routers.get('/', (auth || authUser), async (req, res) => {
  const prodcuts = await Product.find()
  res.send(prodcuts)
})

// get product id with ADM [ x ]
routers.get('/:_id', auth, async (req, res) => {
  const productParam = req

  try {
    const { _id } = productParam.params

    const product = await Product.findById(_id)
    if (!product) {
      return res.send({ message: `Product was not found!` })
    }

    console.log(product)
    res.send(product).status(204)

  } catch (error) {
    const { errors, message } = error as ValidationError
    res.status(400).send({ validationErrors: errors, message })
  }
})

// update product with id [ x ]
routers.put('/updateProduct/:id', auth, async (req, res) => {
  try {
    const product = req.body
    const { id } = req.params

    const productForUpdate = await Product.findByIdAndUpdate(id, product).exec()
    if (!productForUpdate) {
      res.status(204).send({ message: `Product was not found!` })
    }

    const updatedUser = await Product.findById(id).exec()
    if (!updatedUser) {
      res.status(204).send({ message: `Error when updating` })
      return
    }

    await updatedUser.save()
    res.status(200).send(updatedUser)

  } catch (error: any) {
    res.status(500).send(`Internal Server Error: ${error}`)
    console.log(error)
  }
})

// update image in product with id [ X ]
routers.put('/uploadImage/:id', auth, upload.single('image'), async (req, res) => {

  const { file }= req
  
  try {

    const { id } = req.params

    const ProductForUpdateImage = await Product.findByIdAndUpdate(id, {
      photo: file?.filename,
    }).exec()

    if (!ProductForUpdateImage) {
      return res.status(204).send({ message: `Product was not found!` })
    }

    const imageUpdate = await Product.findById(id)
    if (!imageUpdate) {
      return res.status(204).send({ message: `Product was not found!` })
    }

    await imageUpdate.save()
    res.status(200).send(imageUpdate)

  } catch (error) {
    const { errors } = error as ValidationError
    console.log(error)
    res.status(400).send({ validationErrors: errors })
  }
})


export default routers 
