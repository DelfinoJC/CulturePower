import { mongoose } from "../database"
import { Schema} from "mongoose";

const UserSchema = new Schema({

  name: {
    type: String,
    require: true},

  email: {
    type: String,
    require: true},

  password: {
    type: String,
    min: 8,
    require: true},

    
  photo: {
    type: String,
    require: false
  },
  
    jewelry: {
      type: Number,
    },

    creatAt: {
      type: Date,
      default: new Date()
    }
})

export const User = mongoose.model("User", UserSchema)
