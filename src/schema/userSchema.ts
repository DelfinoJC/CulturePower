import * as Yup from 'yup'
import { TypedRequest } from '../util/typedRequest'

export const userSchema = Yup.object({
  name: Yup.string().required('Name has required'),
  email: Yup.string().required('Email has required'),
  password: Yup.string().required('Password has required'),
  photo: Yup.string(),
  jewelry: Yup.string(),
})

export const userSchemaParam = Yup.object({
  id: Yup.string().required()
})

export namespace CreateUsers {
  export type BodyType = TypedRequest<typeof userSchema>
  export const schema = Yup.object().shape({ body: userSchema })
}
