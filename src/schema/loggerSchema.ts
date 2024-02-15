import * as Yup from 'yup'
import { TypedRequest } from '../util/typedRequest'

export const loggerSchema = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required(),
})

export namespace CreateLogger {
  export type BodyType = TypedRequest<typeof loggerSchema>
  export const schema = Yup.object().shape({ body: loggerSchema })
}
