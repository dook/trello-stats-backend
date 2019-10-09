import { StatusError } from '../utils/error'

export const verifyUserBoardId = (req, res, next) => {
  if (req.user.idBoards.indexOf(req.params.boardId) !== -1) {
    return next()
  }
  return next(new StatusError(404, 'Board ID doesn\'t exists.'))
}

export const verifyParams = (params = []) => {
  return (req, res, next) => {
    params.forEach(param => {
      if (!req.params[param]) {
        return next(new StatusError(404, `There is :${param} required`))
      }
    })
    return next()
  }
}
