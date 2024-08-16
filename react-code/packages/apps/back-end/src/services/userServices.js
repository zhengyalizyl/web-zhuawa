import { signatrue } from "../utils/jwt";


export default class UserService {
    async validate({ username, password }) {
        if(username && password) {
            // with MySql, 校验
            if(username === 'zyl') {
                if(password === '123456') {
                    // 我就要给你颁发口令了
                    const token = signatrue({ username });
                    return {
                        code: 200,
                        msg: "登录成功",
                        status: "success",
                        data: {
                            token
                        }
                    }
                }

                return {
                    code: 200,
                    status: "failed",
                    msg: "密码错误",
                    data: void 0
                }
            }

            return {
                code: 200,
                status: "failed",
                msg: "该账号未注册",
                data: void 0
            }
        }

        return {
            code: 200,
            status: "failed",
            msg: "账号或密码不能为空",
            data: void 0
        }
    }
}