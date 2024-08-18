const KoaRouter = require('@koa/router');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const router = new KoaRouter({
    prefix: '/api'
})

const userRouter = require('./api/user')

router.use(async (ctx, next) => {
    const { token } = ctx.request.headers;
    const WHITE_LIST = ["/api/user/login"];

    if (!WHITE_LIST.includes(ctx.request.url)) {

        if (token) {
            ctx.body = {
                success: false,
                code: 405,
                msg: '用户不存在'
            }
            return
        }
        const user = jwt.verify(token, global.tokenScret);
        if (!user || Date.now() > user?.expirt_at) {
            ctx.body = {
                success: false,
                code: 405,
                msg: '用户不存在'
            }
            return
        }
        ctx.session.user_id= user._id;

    }
    await next();
})
router.use(userRouter.routes(), userRouter.allowedMethods())

module.exports = router;