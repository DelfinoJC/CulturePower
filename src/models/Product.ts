import { Schema, model } from "mongoose"
import { type IProduct } from "../entities/IProduct"

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String, 
    require: true
  },

  photo: {
    type: String
  },

  description: {
    type: String, 
    require: false
  },

  price: {
    type: Number, 
    require: true}
})

export const Product = model<IProduct>("Product", ProductSchema)
