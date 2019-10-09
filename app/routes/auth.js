import express from 'express'
import authController from '../controllers/auth'
import { authenticate, passRedirectUrlToSession, authorize } from '../middlewares/passport'

const router = express.Router()

/**
 * @api {get} /auth/login
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam (Query string) {String} redirect
 * ```
 * ?redirect=http://front-url.com/login-callback
 * ```
 *
 * @apiSuccessExample Success
 * After user confirmation on trello site backend will redirect to callback address with token in query string.
 */
router.get('/login', passRedirectUrlToSession, authenticate())


/**
 * @api {get} /auth/logout
 * @apiName Logout
 * @apiGroup Auth
 *
 * @apiSuccessExample Success
 * Make tokens invalid.
 */
router.get('/logout', authorize(), authController.logout)

router.get('/callback', authenticate(), authController.callback)

export default router
