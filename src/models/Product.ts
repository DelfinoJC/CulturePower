import { mongoose } from '../database'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },

  photo: {
    type: String
  },

  description: {
    type: String, 
    required: false
  },

  amount: {
    type: Number,
    required: true,
    default: 0
  },

  price: {
    type: Number, 
    required: true}
})

export const Product = mongoose.model("Product", ProductSchema)
