import User from '../models/user'

function callback(req, res) {
  const { redirect, token } = req.authInfo
  return res.redirect(`${redirect}?token=${token}`)
}

async function logout(req, res) {
  const { _id } = req.user
  await User.updateTokenTS(_id)
  return res.json({success: true})
}

export default { callback, logout }
