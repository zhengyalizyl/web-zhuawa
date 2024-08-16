
//  demo 

function discount(total) {
    console.log('discount')
    return total * 0.8; // 八折优惠
};

function express(total) {
    console.log('express')
    return total + 12; // 不包邮，12邮费
};

function num(price) {
    console.log('num')
    return 10 * price; // 单价计算
}

const compose = (...funcArray) => (startNum) => funcArray.reduce((total, item) => item(total), startNum);

const reduxCompose = (...funcArray) => funcArray.reduce((total, item) => (...args) => total(item(...args)));

const sell = compose(num, discount, express);
const sell2 = reduxCompose(num, discount, express);
console.log(sell(15), sell2(15))

//  discount(express(num(15)))

