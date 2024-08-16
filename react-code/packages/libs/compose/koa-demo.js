const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    console.log('starting a...');
    await next();
    console.log('ending a...')
});


app.use(async (ctx, next) => {
    console.log('starting b...');
    await next();
    console.log('ending b...')
});


app.use(async (ctx, next) => {
    console.log('starting c...');
    await next();
    console.log('ending c...')
});

app.listen(3000, () => {
    console.log('300888888')
});