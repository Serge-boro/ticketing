import { model, Schema, Model, Document } from 'mongoose'
import { OrderStatus } from '@ticketingpr/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

//schema ticket from './ticketModel'
import { TicketDoc } from './ticketModel'

export { OrderStatus }

//FROM '@ticketingpr/common' ==> index
// export enum OrderStatus {
//   Created = 'created',
//   Cancelled = 'cancelled',
//   AwaitingPaymnet = 'awaiting: payment',
//   Complete = 'complete',
// }

interface OrderModelInterfaceAttrs {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderDoc extends Document {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
  version: number
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
      //'@ticketingpr/common'
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
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
  return new Order(attrs)
}

const Order = model<OrderDoc, OrderModel>('Order', OrderSchema)

export { Order }
