import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import connectSessionMongo from 'connect-mongo'

import passport, { authorize } from './middlewares/passport'
import { notFound, catchErrors } from './middlewares/errors'
import authRouter from './routes/auth'
import usersRouter from './routes/users'
import boardsRouter from './routes/boards'
import configureMongo from './config/db'
import config from './config/config'

const MongoStore = connectSessionMongo(session)

const app = express()

process.env.NODE_ENV !== 'production' && app.use(morgan('dev'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({...config.SESSION_CONFIG, store: new MongoStore({mongooseConnection: mongoose.connection})}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRouter)
app.use('/api/users', authorize(), usersRouter)
app.use('/api/boards', authorize(), boardsRouter)

app.use(notFound)
app.use(catchErrors)

configureMongo()

export default app
