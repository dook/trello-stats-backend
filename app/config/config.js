export default {
  SESSION_CONFIG: {
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: 'auto'
    }
  }
}
