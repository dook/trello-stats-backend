import mongoose from 'mongoose'

const BoardSettingsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    index: true
  },
  board: {
    type: String,
    required: true,
    index: true
  },
  excluded: {
    type: [String],
    default: []
  },
  done: {
    type: [String],
    default: []
  },
  undone: {
    type: [String],
    default: []
  }
})

BoardSettingsSchema.statics.findOneOrCreate = async (conditions, optData = {}) => {
  const result = await BoardSettings.findOne(conditions)
  if (!result) {
    const created = await BoardSettings.create({...conditions, ...optData})
    return created
  }
  return result
}

BoardSettingsSchema.statics.findOneAndUpdateOrCreate = async (conditions, payload, optData = {}) => {
  const settings = await BoardSettings.findOneAndUpdate(conditions, payload, { new: true })

  if (!settings) {
    const created = await BoardSettings.create({...conditions, ...payload, ...optData})
    return created
  }
  return settings
}

const BoardSettings = mongoose.model('BoardSettings', BoardSettingsSchema)
export default BoardSettings
