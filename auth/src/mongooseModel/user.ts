import { model, Schema, Model, Document } from 'mongoose'
// import { Password } from '../services/password'
const bcrypt = require('bcrypt')

interface UserModelInterfaceAttrs {
  email: string
  password: string
}

interface UserDoc extends Document {
  email: string
  password: string
  comparePassword(password: string): boolean
}
//means:
//user.email ++
//user.updateAt --

interface UserModel extends Model<UserDoc> {
  build(attrs: UserModelInterfaceAttrs): UserDoc
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      },
    },
  }
)

//GOOD method ==> services/password.ts
// UserSchema.pre('save', async function (done) {
//   if (this.isModified('password')) {
//     const hashed = await Password.toHash(this.get('password'))
//     this.set('password', hashed)
//   }

//   done()
// })

//Better method cashing password:
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (canditatePassword: any) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

UserSchema.statics.build = (attrs: UserModelInterfaceAttrs) => {
  return new User(attrs)
}

const User = model<UserDoc, UserModel>('User', UserSchema)

export { User }

/*

new User({
  em: 'sdsd',
  pass: 'a'
  sdsds: dsdsdsd
})
#############

that dont misstyping and add new propery ==> UserModelInterfaceAttrs
const buildUser = (attrs: UserModelInterfaceAttrs) => {
  return new User(attrs)
}
buildUser({
  em: 'sdsd',
  pass: 'a'
  sdsds: dsdsdsd
})

interface UserDoc ==> opportunity add new property
*/
