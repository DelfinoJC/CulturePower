import * as Yup from 'yup'
import { TypedRequest } from '../util/typedRequest'

export const productSchema = Yup.object({
  name: Yup.string().required('Name has required'),
  price: Yup.number().required('Value has required'),
  amount: Yup.number().required('Quantity has required').default(0),
  description: Yup.string().required('Description has required'),
  photo: Yup.string(),
})

export namespace CreateProducts {
  export type BodyType = TypedRequest<typeof productSchema>
  export const schema = Yup.object().shape({ body: productSchema })
}
