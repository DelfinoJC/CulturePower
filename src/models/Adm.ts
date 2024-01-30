import { mongoose} from "../database";
import { Schema } from "mongoose";
// import { type  IAdm } from "../entities/IAdm";

const AdmSchema = new Schema({
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
    }
})

export const Adm = mongoose.model("Adm", AdmSchema)
