import { createLogger, format, transports } from 'winston'

export default createLogger({
  format: format.combine(
    format.colorize({ colors: { info: 'blue', debug: 'cyan'}, level: true}),
    format.printf(({ level, message }) => (`${level}: ${message}`))
  ),
  transports: [new transports.Console({ level: 'debug', json: true })]
})
