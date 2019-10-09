import express from 'express'
import { catchAsync } from '../middlewares/errors'
import usersController from '../controllers/users'

const router = express.Router()

/**
 * @api {get} /users/me
 * @apiName Information about logged user
 * @apiGroup Users
 *
 * @apiSuccessExample {json} Success Example
 *  {
 *    "username": "john1",
 *    "fullName": "John Kowalsky",
 *    "avatar": "https://trello-avatars.s3.amazonaws.com/hash/170.png"
 *  }
 */
router.get('/me', catchAsync(usersController.user))

export default router
