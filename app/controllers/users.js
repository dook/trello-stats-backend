import { trelloGet } from '../utils/trelloRequests'

async function user(req, res) {
  const trelloResponse = await trelloGet('/members/me', req.authInfo.accessToken)
  const data = {
    username: trelloResponse.data.username,
    fullName: trelloResponse.data.fullName,
    avatar: trelloResponse.data.avatarUrl && `${trelloResponse.data.avatarUrl}/170.png`
  }
  return res.json(data)
}

export default { user }
