const Koa = require('koa');
const _ = require('koa-route');
const config = require('../config/config');
const {postSend} = require('./controller/messages');

const app = new Koa();

app.use(_.post('/lunatalk/api/message/send', postSend));

const port = config.PORT;
app.listen(port);
console.log(`listening on port ${port}`);
