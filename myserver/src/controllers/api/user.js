const KoaRouter = require('@koa/router');
const jwt = require('jsonwebtoken');
const router = new KoaRouter({
    prefix: '/user'
})

global.tokenScret = 'qG0QpVft4P1_u6U~ixLdspa0C,-PnR1+';

router.get('/info', async (ctx) => {
    const { token } = ctx.request.headers;
    // your code
    const user = jwt.verify(token, global.tokenScret)
    const userInfo = await User.findById(ctx.session.user_id).lean();
    ctx.body = {
        user:userInfo
    };
});

const User = require('../../models/user');
router.post('/login', async (ctx) => {
    // 获取用户登录账户和密码
    const { account, password } = ctx.request.body;

    const user = await User.findOne({ account, password }).lean()
    // console.log(user)
    if (user) {
        const token = jwt.sign({
            _id: user._id,
            expirt_at: Date.now() + 1000 * 60 * 60 * 2
        }, global.tokenScret);
        ctx.session.user_id =user._id;
        ctx.body = {
            'success': true,
            token,
        };
    } else {
        ctx.body = {
            'success': false,
            user,
        };
    }

    return
});


module.exports = router;