import { mongoose } from '../database'
import { Schema} from "mongoose"

const ProductSchema = new Schema({
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

export const Product = mongoose.model("Product", ProductSchema)
