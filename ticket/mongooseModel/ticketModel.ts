import { model, Schema, Model, Document } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketModelInterfaceAttrs {
  title: string
  price: number
  userId: string
}

interface TicketDoc extends Document {
  title: string
  price: number
  userId: string
  version: number
  orderId?: string
  // createAt: string
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketModelInterfaceAttrs): TicketDoc
}

const TicketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

TicketSchema.statics.build = (attrs: TicketModelInterfaceAttrs) => {
  return new Ticket(attrs)
}

const Ticket = model<TicketDoc, TicketModel>('Ticket', TicketSchema)

export { Ticket }
