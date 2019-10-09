import { omit } from 'lodash'
import { trelloGet } from '../utils/trelloRequests'
import { isCardDone, nextStatsObject, isCardUndone } from '../utils/stats'
import BoardSettings from '../models/boardSettings'

async function getAll(req, res) {
  const trelloResponse = await trelloGet('/members/me/boards', req.authInfo.accessToken)
  const data = trelloResponse.data.map((board) => ({
    id: board.id,
    name: board.name,
    backgroundColor: board.prefs.backgroundTopColor,
    backgroundUrl: board.prefs.backgroundImageScaled && board.prefs.backgroundImageScaled[2].url,
    membersNumber: board.memberships.length,
    lastActivity: board.dateLastActivity
  }))
  return res.json(data)
}

async function get(req, res) {
  const { boardId } = req.params
  const { range } = req.query
  let dateTo = range && range.to && new Date(range.to)

  if (dateTo) {
    dateTo.setDate(dateTo.getDate() + 1)
  }

  const trelloBoardReq = trelloGet(`/boards/${boardId}`, req.authInfo.accessToken, {fields: 'name'})
  const trelloCardsReq = trelloGet(`/boards/${boardId}/cards`, req.authInfo.accessToken, {
    fields: 'id,due,dueComplete,idList',
    members: true,
    member_fields: 'id',
    since: range && range.from,
    before: dateTo && dateTo.toISOString()
  })
  const trelloMembersReq = trelloGet(`/boards/${boardId}/members`, req.authInfo.accessToken, {fields: 'id,fullName,username,avatarUrl'})
  const boardSettingsReq = BoardSettings.findOneOrCreate({board: boardId, user: req.user._id})

  const [
    trelloBoard,
    trelloCards,
    trelloMembers,
    boardSettings
  ] = await Promise.all([trelloBoardReq, trelloCardsReq, trelloMembersReq, boardSettingsReq])

  let statsToDo = {}
  let statsDone = {}
  let statsUndone = {}
  trelloCards.data.forEach((card) => {
    if (card.members.length > 0 && boardSettings.excluded.indexOf(card.idList) === -1) {
      if (isCardDone(card, boardSettings.done)) {
        statsDone = nextStatsObject(statsDone, card.members)
      } else if (isCardUndone(card, boardSettings.undone)){
        statsUndone = nextStatsObject(statsUndone, card.members)
      } else {
        statsToDo = nextStatsObject(statsToDo, card.members)
      }
    }
  })

  const members = trelloMembers.data.map((member) => {
    const todo = statsToDo[member.id] || 0
    const done = statsDone[member.id] || 0
    const undone = statsUndone[member.id] || 0
    return {
      id: member.id,
      fullName: member.fullName,
      surname: member.surname,
      avatarUrl: member.avatarUrl && `${member.avatarUrl}/170.png`,
      stats: {
        total: todo + done + undone,
        todo,
        done,
        undone
      }
    }
  })

  const data = {
    id: trelloBoard.data.id,
    name: trelloBoard.data.name,
    biggestCount: Math.max(
      ...Object.values(statsToDo),
      ...Object.values(statsDone),
      ...Object.values(statsUndone),
      0),
    members
  }

  return res.json(data)
}

async function getBoardSettings(req, res) {
  const { boardId } = req.params
  const data = await BoardSettings.findOneOrCreate({board: boardId, user: req.user._id})
  return res.json(omit(data.toObject(), ['_id', '__v']))
}

async function updateBoardSettings(req, res) {
  const { boardId } = req.params
  const data = await BoardSettings.findOneAndUpdateOrCreate({board: boardId, user: req.user._id}, req.body)
  return res.json(omit(data.toObject(), ['_id', '__v']))
}

async function getBoardLists(req, res) {
  const { boardId } = req.params
  const trelloLists = await trelloGet(`/boards/${boardId}/lists`, req.authInfo.accessToken, {fields: 'id,name'})
  return res.json(trelloLists.data)
}

export default { getAll, get, getBoardSettings, updateBoardSettings, getBoardLists }
