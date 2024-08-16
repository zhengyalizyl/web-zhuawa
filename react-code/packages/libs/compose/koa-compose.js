

function num(ctx, next) {
    console.log('num start...')
    next(10 * ctx); // 单价计算
    console.log('num end...')
}

function discount(ctx, next) {
    console.log('discount start...')
    next(ctx * 0.8);
    console.log('discount end...')

};

function express(ctx, next) {
    console.log('express start...')
    next(ctx + 12); // 不包邮，12邮费
    console.log('express end...')

};

const sell = compose(num, discount, express);
console.log(sell(15))

function compose(...args) {
    let result;
    // 这个15元，是第一次的 ctx
    return function(ctx) {
        let i = 0;
        let dispatch = function(i, ctx) {
            let fn;
            if(i < args.length) fn = args[i];//i=0;fn=num
            console.log(i,fn,'-----')
            if(i === args.length) {
                result = ctx;
                return;
            }
            const next = (...ps) => dispatch(++i, ...ps);
            const a= fn(ctx, next);//调用了num
            console.log(a,next,'-----')
            return a
            // next(ctx*0.8)
            // return Promise.resolve(fn(ctx, dispatch.bind(null, ++i)))
        };
        dispatch(0, ctx);
        return result;

    }
}