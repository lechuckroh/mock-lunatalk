process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Koa = require('koa');
const _ = require('koa-route');
const config = require('config');
const winston = require('winston');
const {postSend} = require('./controller/messages');

try {
  const port = process.env.LUNATALK_PORT || config.get('port');
  const app = new Koa();

  app.use(_.post('/lunatalk/api/message/send', postSend));

  app.listen(port);
  winston.info(`Listening on port ${port}...`);
} catch (e) {
  winston.error(e);
}
