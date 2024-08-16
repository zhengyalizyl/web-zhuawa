import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';

import Rs from './controllers/index';

import { controllers } from './utils/decorator';
import { jwtVerify } from './utils/jwt';


const app = new Koa();

const router = new Router();

app.use(bodyParser());

// cors
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    if(ctx.request.method.toLowerCase() === 'options') {
        ctx.state = 200;
    } else {
        await next();
    }
})

app.use(jwtVerify([
    '/user/login',
    '/user/register'
]))

controllers.forEach((item) => {
    let { method, path, handler, constructor } = item;
    const { prefix } = constructor;
    if(prefix) path = `${prefix}${path}`;
    router[method](path, handler);
})

// router.get('/apis/test', async (ctx) => {
//     ctx.body = {
//         data: ["luyi"]
//     }
// });

// router.get('/apis/book', async (ctx) => {
//     ctx.body = {
//         data: ["一秒精通JS"]
//     }
// });

app.use(router.routes());

app.listen(3008, () => {
    console.log('3008 is listening...')
})