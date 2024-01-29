import { Schema, model } from "mongoose";
import { database } from '../database'
import { type  IAdm } from "../entities/IAdm";

const AdmSchema = new Schema<IAdm>({
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

export const Adm = model<IAdm>("Adm", AdmSchema)
