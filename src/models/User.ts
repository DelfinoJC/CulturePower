import { mongoose } from "../database/index"

const UserSchema = new mongoose.Schema({

  name: { 
    type: String,
    required: true},

  email: {
    type: String,
    unique: true,
    required: true},

  password: {
    type: String,
    min: 8,
    required: true},

    
  photo: {
    type: String
  },
  
    jewelry: {
      type: Number,
    },

    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Products',
      },
    ],
    

    creatAt: {
      type: Date,
      default: new Date()
    }
})

export const User = mongoose.model("User", UserSchema)
