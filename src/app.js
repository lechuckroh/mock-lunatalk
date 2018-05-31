process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Koa = require('koa');
const config = require('config');
const winston = require('winston');
const bodyParser = require('koa-bodyparser');

function registerRoutes(app) {
  const _ = require('koa-route');
  const {postSend} = require('./controller/messages');

  app.use(_.post('/lunatalk/api/message/send', postSend));
}

function startServer(app) {
  try {
    const port = process.env.LUNATALK_PORT || config.get('port');
    const server = app.listen(port);
    winston.info(`Listening on port ${port}...`);
    return server;
  } catch (e) {
    winston.error(e);
    return null;
  }
}

function start() {
  const app = new Koa();
  app.use(bodyParser());

  registerRoutes(app);
  return startServer(app);
}

const server = start();

module.exports = {
  server: server
};
