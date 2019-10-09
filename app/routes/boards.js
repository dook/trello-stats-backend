import express from 'express'
import { catchAsync } from '../middlewares/errors'
import { verifyUserBoardId, verifyParams } from '../middlewares/validation'
import boardsController from '../controllers/boards'

const router = express.Router()

/**
 * @api {get} /boards
 * @apiName All boards
 * @apiGroup Boards
 *
 * @apiSuccessExample {json} Success Example
 * [
 *    {
 *      "id": "5a9c4b9533ae694197fa5100",
 *      "name": "Nazwa tablicy",
 *      "backgroundColor": "#282b3a",
 *      "backgroundUrl": "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/480x480/0b0af4570b3efd159ef8202ca69476f6/photo-1518932945647-7a1c969f8be2.jpg",
 *      "membersNumber": 4,
 *      "lastActivity": "2018-04-17T01:19:07.687Z"
 *    }
 *  ]
 */
router.get('/', catchAsync(boardsController.getAll))

/**
 * @api {get} /boards/:boardId
 * @apiName Board details
 * @apiGroup Boards
 *
 * @apiParam (Query string) {Date} range
 * ```
 * ?range[from]=2019-05-10&range[to]=2019-06-01
 * ```
 * @apiParam {String} :boardId ID of chosen board
 *
 * @apiSuccessExample {json} Success Example
 *  {
 *    "biggestCount": 7,
 *    "members": [
 *      {
 *        "id": "5505702637faa37ad300e",
 *        "fullName": "Jan Kowalski",
 *        "username": "jankowal",
 *        "stats": {
 *          "total": 2,
 *          "todo": 1,
 *          "done": 1,
 *          "undone": 0
 *        }
 *      },
 *      {
 *        "id": "59ff7f985c8ce124844a6",
 *        "fullName": "Zbigniew Nowak",
 *        "username": "zbigi123",
 *        "stats": {
 *          "total": 12,
 *          "todo": 7,
 *          "done": 5,
 *          "undone": 0
 *        }
 *      }
 *    ]
 *  }
 */
router.get('/:boardId', catchAsync(boardsController.get))

/**
 * @api {get} /boards/:boardId/lists
 * @apiName Lists on board
 * @apiGroup Boards
 *
 * @apiParam {String} :boardId ID of chosen board
 *
 * @apiSuccessExample {json} Success Example
 *  [
 *    {
 *      "id": "5aa13b76b71d7f7c55b34eca",
 *      "name": "Inbox"
 *    },
 *    {
 *      "id": "5aax3b76bd321f7c55b34ecd",
 *      "name": "Do zrobienia"
 *    }
 *  ]
 */
router.get('/:boardId/lists', catchAsync(boardsController.getBoardLists))

/**
 * @api {get} /boards/:boardId/settings
 * @apiName Get chosen board settings
 * @apiGroup Boards
 *
 * @apiParam {String} :boardId ID of chosen board
 *
 * @apiSuccessExample {json} Success Example
 *  {
 *    "user": "us3rH4sH321",
 *    "board": "b0aRdH4sH321",
 *    "done": [
 *      "l1sTh4SH111"
 *    ],
 *    "undone": [],
 *    "excluded": [
 *      "l1sTh4SH133"
 *    ]
 *  }
 */
router.get('/:boardId/settings', catchAsync(boardsController.getBoardSettings))

/**
 * @api {put} /boards/:boardId/settings
 * @apiName Set chosen board settings
 * @apiGroup Boards
 *
 * @apiParam {String} :boardId ID of chosen board
 *
 * @apiSuccessExample {json} Success Example
 *  {
 *    "biggestCount": 7,
 *    "members": [
 *      {
 *        "id": "5505702637faa37ad300e",
 *        "fullName": "Jan Kowalski",
 *        "username": "jankowal",
 *        "stats": {
 *          "total": 2,
 *          "todo": 1,
 *          "done": 1,
 *          "undone": 0
 *        }
 *      },
 *      {
 *        "id": "59ff7f985c8ce124844a6",
 *        "fullName": "Zbigniew Nowak",
 *        "username": "zbigi123",
 *        "stats": {
 *          "total": 12,
 *          "todo": 7,
 *          "done": 5,
 *          "undone": 0
 *        }
 *      }
 *    ]
 *  }
 */
router.put('/:boardId/settings', catchAsync(boardsController.updateBoardSettings))

export default router
