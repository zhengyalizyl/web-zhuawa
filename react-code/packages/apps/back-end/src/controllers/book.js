import { Controller, RequestMapping, RequestMethod } from "../utils/decorator";

@Controller("/book")
export default class BookController {

    @RequestMapping(RequestMethod.GET, "/all")
    async getAllBooks(ctx) {
        ctx.body = {
            data: ["一秒精通JS"]
        }
    }
}
// 我访问 /book/all， 就自动定位到 getAllBooks 这个函数，我们应该怎么做？
// router 的本质，就是函数和地址的对应执行关系。

// router.get('/apis/book', async (ctx) => {
//     ctx.body = {
//         data: ["一秒精通JS"]
//     }
// });