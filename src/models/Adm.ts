import { mongoose} from "../database";
// import { type  IAdm } from "../entities/IAdm";

const AdmSchema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true},
    
  email: {
    type: String, 
    required: true},

  password: {
    type: String, 
    required: true},

    photo: {
      type: String,
    }
})

export const Adm = mongoose.model("Adm", AdmSchema)
