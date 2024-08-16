import UserService from "../services/userServices";
import { Controller, RequestMapping, RequestMethod } from "../utils/decorator";

@Controller("/user")
export default class UserController {

    @RequestMapping(RequestMethod.GET, "/all")
    async getAllBooks(ctx) {
        ctx.body = {
            data: ["luyi", "yunyin"]
        }
    };

    @RequestMapping(RequestMethod.GET, "/id")
    async getBookById(ctx) {
        ctx.body = {
            data: "luyi"
        }
    };

    @RequestMapping(RequestMethod.POST, '/login')
    async loginUser(ctx) {
        const { body } = ctx.request;
        const userService = new UserService();
        ctx.body = await userService.validate(body);
    }
}
// 我访问 /book/all， 就自动定位到 getAllBooks 这个函数，我们应该怎么做？
// router 的本质，就是函数和地址的对应执行关系。

// router.get('/apis/book', async (ctx) => {
//     ctx.body = {
//         data: ["一秒精通JS"]
//     }
// });
