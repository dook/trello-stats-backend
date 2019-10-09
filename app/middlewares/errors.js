import { StatusError } from '../utils/error'

export function notFound(req, res, next) {
  const err = new StatusError(404, 'Page not found')
  return next(err)
}

export function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err))
  }
}

export function catchErrors(err, req, res) {
  let status = 500
  if (err.response) {
    status = err.response.status
  }
  if (err.status) {
    status = err.status
  }
  res.status(status)
  return res.json({status, message: err.message})
}
