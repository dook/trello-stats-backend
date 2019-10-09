import mongoose from 'mongoose'
import logger from '../utils/logger'

export const CONFIG = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://mongo:27017/mongo',
  CONNECTION_OPTIONS: {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500
  },
  SESSION_COLLECTION: 'session'
}

export const configureMongo = () => {
  const connectToMongo = () => {
    mongoose.connect(CONFIG.MONGO_URI, CONFIG.CONNECTION_OPTIONS)
  }

  mongoose.set('useCreateIndex', true)
  mongoose.connection.on('open', () => { logger.info('MongoDB connected') })
  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB:', err)
    mongoose.disconnect()
  })

  mongoose.connection.on('disconnected', () => {
    logger.info('MongoDB disconnected')
    setTimeout(connectToMongo, 1500)
  })
}

export default configureMongo
