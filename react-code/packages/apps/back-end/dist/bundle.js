(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('core-js/modules/esnext.async-iterator.for-each.js'), require('core-js/modules/esnext.iterator.constructor.js'), require('core-js/modules/esnext.iterator.for-each.js'), require('koa'), require('koa-bodyparser'), require('koa-router'), require('core-js/modules/esnext.async-iterator.reduce.js'), require('core-js/modules/esnext.iterator.reduce.js'), require('core-js/modules/es.array.push.js'), require('jsonwebtoken')) :
  typeof define === 'function' && define.amd ? define(['core-js/modules/esnext.async-iterator.for-each.js', 'core-js/modules/esnext.iterator.constructor.js', 'core-js/modules/esnext.iterator.for-each.js', 'koa', 'koa-bodyparser', 'koa-router', 'core-js/modules/esnext.async-iterator.reduce.js', 'core-js/modules/esnext.iterator.reduce.js', 'core-js/modules/es.array.push.js', 'jsonwebtoken'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(null, null, null, global.Koa, global.bodyParser, global.Router, null, null, null, global.jwt));
})(this, (function (esnext_asyncIterator_forEach_js, esnext_iterator_constructor_js, esnext_iterator_forEach_js, Koa, bodyParser, Router, esnext_asyncIterator_reduce_js, esnext_iterator_reduce_js, es_array_push_js, jwt) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Koa__default = /*#__PURE__*/_interopDefaultLegacy(Koa);
  var bodyParser__default = /*#__PURE__*/_interopDefaultLegacy(bodyParser);
  var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
  var jwt__default = /*#__PURE__*/_interopDefaultLegacy(jwt);

  const RequestMethod = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: 'delete'
  };
  const controllers = [];
  function Controller(prefix = "") {
    return function (target) {
      console.log(prefix, target, '-----Controller');
      target.prefix = prefix;
    };
  }
  function RequestMapping(method = "", url = "") {
    return function (target, name) {
      console.log(target, name);
      let path = url || `/${name}`;
      const item = {
        path,
        method,
        handler: target[name],
        constructor: target.constructor
      };
      controllers.push(item);
    };
  }

  var _dec$1, _dec2$1, _class$1, _class2$1;
  function _applyDecoratedDescriptor$1(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  let BookController = (_dec$1 = Controller("/book"), _dec2$1 = RequestMapping(RequestMethod.GET, "/all"), _dec$1(_class$1 = (_class2$1 = class BookController {
    async getAllBooks(ctx) {
      ctx.body = {
        data: ["一秒精通JS"]
      };
    }
  }, (_applyDecoratedDescriptor$1(_class2$1.prototype, "getAllBooks", [_dec2$1], Object.getOwnPropertyDescriptor(_class2$1.prototype, "getAllBooks"), _class2$1.prototype)), _class2$1)) || _class$1);
  // router 的本质，就是函数和地址的对应执行关系。
  // router.get('/apis/book', async (ctx) => {
  //     ctx.body = {
  //         data: ["一秒精通JS"]
  //     }
  // });

  const SALT = "fengkuangzhaowaxingqiliu.vmetoken";
  const verify = async token => {
    return new Promise(resolve => {
      if (token) {
        jwt__default["default"].verify(token, SALT, (err, data) => {
          if (err) {
            if (err.name === "TokenExpiredError") {
              resolve({
                status: 'failed',
                error: "token 已过期"
              });
            } else {
              resolve({
                status: 'failed',
                error: "token 非法"
              });
            }
          } else {
            resolve({
              status: 'success',
              data
            });
          }
        });
      } else {
        resolve({
          status: 'failed',
          error: 'token is null'
        });
      }
    });
  };
  const signatrue = user => jwt__default["default"].sign(user, SALT, {
    expiresIn: '10h'
  });
  const jwtVerify = whiteList => async (ctx, next) => {
    console.log('=====', ctx.path, whiteList);
    if (whiteList.includes(ctx.path)) {
      next(ctx);
    } else {
      // 这里才是鉴权的逻辑
      let token;
      try {
        token = ctx.request.headers.authorization.split("Bearer ")[1];
      } catch (err) {}
      const res = await verify(token);
      if (res.status === 'success') {
        next(ctx);
      } else {
        ctx.body = {
          ...res,
          code: 401
        };
      }
    }
  };

  class UserService {
    async validate({
      username,
      password
    }) {
      if (username && password) {
        // with MySql, 校验
        if (username === 'zyl') {
          if (password === '123456') {
            // 我就要给你颁发口令了
            const token = signatrue({
              username
            });
            return {
              code: 200,
              msg: "登录成功",
              status: "success",
              data: {
                token
              }
            };
          }
          return {
            code: 200,
            status: "failed",
            msg: "密码错误",
            data: void 0
          };
        }
        return {
          code: 200,
          status: "failed",
          msg: "该账号未注册",
          data: void 0
        };
      }
      return {
        code: 200,
        status: "failed",
        msg: "账号或密码不能为空",
        data: void 0
      };
    }
  }

  var _dec, _dec2, _dec3, _dec4, _class, _class2;
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  let UserController = (_dec = Controller("/user"), _dec2 = RequestMapping(RequestMethod.GET, "/all"), _dec3 = RequestMapping(RequestMethod.GET, "/id"), _dec4 = RequestMapping(RequestMethod.POST, '/login'), _dec(_class = (_class2 = class UserController {
    async getAllBooks(ctx) {
      ctx.body = {
        data: ["luyi", "yunyin"]
      };
    }
    async getBookById(ctx) {
      ctx.body = {
        data: "luyi"
      };
    }
    async loginUser(ctx) {
      const {
        body
      } = ctx.request;
      const userService = new UserService();
      ctx.body = await userService.validate(body);
    }
  }, (_applyDecoratedDescriptor(_class2.prototype, "getAllBooks", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "getAllBooks"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getBookById", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "getBookById"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "loginUser", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "loginUser"), _class2.prototype)), _class2)) || _class);
  // router 的本质，就是函数和地址的对应执行关系。
  // router.get('/apis/book', async (ctx) => {
  //     ctx.body = {
  //         data: ["一秒精通JS"]
  //     }
  // });

  var index = [BookController, UserController];

  const app = new Koa__default["default"]();
  const router = new Router__default["default"]();
  app.use(bodyParser__default["default"]());

  // cors
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    if (ctx.request.method.toLowerCase() === 'options') {
      ctx.state = 200;
    } else {
      await next();
    }
  });
  app.use(jwtVerify(['/user/login', '/user/register']));
  controllers.forEach(item => {
    let {
      method,
      path,
      handler,
      constructor
    } = item;
    const {
      prefix
    } = constructor;
    if (prefix) path = `${prefix}${path}`;
    router[method](path, handler);
  });

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
    console.log('3008 is listening...');
  });

}));
