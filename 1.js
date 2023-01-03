function generatorToAsync(generatorFn) {
    return function() {
        const gen = generatorFn.apply(this, arguments);
        return new Promise((resolve, reject) => {
            function go(key, arg) {
                let res;
                try {
                    res = gen[key](arg);
                } catch (err) {
                    reject(err)
                }
                console.log(res);
                const { value, done } = res;
                if (done) {
                    return resolve(value)
                } else {
                    //value可能是一个值，可能是promise,可能是成功或者失败
                    return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
                }
            }

            go('next')
        })
    }
}