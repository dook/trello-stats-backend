import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  trelloId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    index: true
  },
  fullName: String,
  avatarUrl: String,
  idBoards: [String],
  idOrganizations: [String],
  tokenTS: { type: Date, default: Date.now() }
})

UserSchema.statics.findOneOrCreate = async (conditions, opt_data = {}) => {
  const user = await User.findOne(conditions)
  return user || await User.create({...conditions, ...opt_data})
}

UserSchema.statics.updateTokenTS = async (id) =>
  await User.findByIdAndUpdate(id, {tokenTS: Date.now()}, {new: true})

const User = mongoose.model('User', UserSchema)
export default User
