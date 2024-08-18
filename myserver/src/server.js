const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const app = new Koa();
const session = require('koa-session');

app.use(KoaBodyParser({
    enableTypes: ['json', 'form', 'text'],
}));

app.keys=['qG0QpVft4P1_u6U~ixLdspa0C,-PnR1+'];

const  CONFIG={
    key:'zyl',
    maxAge:86400000,
    autoCommit:true,
    overwrite:true,
    httpOnly:true,
    signed:true,
    rolling:false,
    renew:false,
    secure:true,
    sameSite:null
}

app.use(session(CONFIG,app))

const router = require('./controllers/api');

app.use(router.routes(), router.allowedMethods())


app.listen('6969');