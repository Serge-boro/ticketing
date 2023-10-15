import { model, Schema, Model, Document } from 'mongoose'
import { OrderStatus } from '@ticketingpr/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

//schema ticket from './ticketModel'
// import { TicketDoc } from './ticketModel'

export { OrderStatus }

interface OrderModelInterfaceAttrs {
  id: string
  status: OrderStatus
  userId: string
  version: number
  price: number
}

interface OrderDoc extends Document {
  status: OrderStatus
  userId: string
  version: number
  price: number
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderModelInterfaceAttrs): OrderDoc
}

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

OrderSchema.set('versionKey', 'version')
OrderSchema.plugin(updateIfCurrentPlugin)

OrderSchema.statics.build = (attrs: OrderModelInterfaceAttrs) => {
  const { id, status, version, price, userId } = attrs
  return new Order({
    _id: id,
    status,
    version,
    price,
    userId,
  })
}

const Order = model<OrderDoc, OrderModel>('Order', OrderSchema)

export { Order }
