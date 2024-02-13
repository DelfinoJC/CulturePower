import { Router } from 'express'
import * as Yup from 'yup'
import { Product } from '../models/Product'
import * as productSchema  from '../schema/productSchema'
import validateRouter from '../middleware/validateRouter'
import { auth } from '../middleware/admAuth'

const routers = Router()

routers.post('/', validateRouter(productSchema.CreateProducts.schema), auth, async (req,res) => {
  
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

export default routers 
