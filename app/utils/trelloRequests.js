import axios from 'axios'
import qs from 'qs'
import config from '../config/oauth'

export function trelloGet(endpoint, token, queryParams = {}) {
  const query = qs.stringify({
    ...queryParams,
    key: config.KEY,
    token
  })
  const url = `https://api.trello.com/1/${endpoint}?${query}`
  return axios.get(url)
}
