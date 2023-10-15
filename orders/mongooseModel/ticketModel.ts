import { Document, Model, model, Schema } from 'mongoose'
import { Order, OrderStatus } from './orderModel'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketModelInterfaceAttrs {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends Document {
  title: string
  price: number
  version: number
  isReserve(): Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketModelInterfaceAttrs): TicketDoc
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
}

const TicketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
      min: 0,
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

//'mongoose-update-if-current'
TicketSchema.set('versionKey', 'version')
TicketSchema.plugin(updateIfCurrentPlugin)

// TicketSchema.pre('save', function (done) {
//   this.$where = {
//     version: this.get('version') - 1,
//   }
//   done()
// })

TicketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findById({
    _id: event.id,
    version: event.version - 1,
  })
}
TicketSchema.statics.build = (attrs: TicketModelInterfaceAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}

TicketSchema.methods.isReserve = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      //$in avoid cases
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPaymnet,
        OrderStatus.Complete,
      ],
    },
  })
  //first "!" return "true" with null, second "!!" return false OR if the order will defind - first "!" - false, second - "!!" - true
  return !!existingOrder
}

const Ticket = model<TicketDoc, TicketModel>('Ticket', TicketSchema)

export { Ticket }
