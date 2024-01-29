import { Schema, model} from "mongoose";
import { type IUser } from "../entities/IUser";

const UserSchema = new Schema<IUser>({

  name: {
    type: String,
    require: true},

  email: {
    type: String,
    require: true},

  password: {
    type: String,
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

export const User = model<IUser>("User", UserSchema)
