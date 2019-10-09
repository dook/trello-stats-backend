export default {
  REQUEST_URL: 'https://trello.com/1/OAuthGetRequestToken',
  ACCESS_URL: 'https://trello.com/1/OAuthGetAccessToken',
  AUTHORIZE_URL: 'https://trello.com/1/OAuthAuthorizeToken',
  CALLBACK: process.env.TRELLO_REDIRECT_URI,
  FRONTEND_URL: process.env.FRONTEND_LOGIN_URL,
  APP_NAME: 'Trello Stats',
  KEY: process.env.TRELLO_KEY,
  SECRET: process.env.TRELLO_SECRET,
  JWT_SECRET: process.env.JWT_SECRET
}
