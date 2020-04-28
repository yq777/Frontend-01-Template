- convertNumberToString
  ```javaScript
    function convertNumberToString(number, x = 10) {
        if (!/^-?\d+\.?$|^-?\d*\.\d+$|^-?\d*\.?\d*[e|E]-?\d+$|^-?0[bB][0-1]+$|^-?0[oO][0-7]+$|^-?0[xX][0-9a-fA-F]+$/g.test(number)) {
            throw "第一个参数不是合法的number数据";
        }
        var integer = Math.floor(number);
        var fraction = number - integer;
        let string = '';
        let flag = false;
        if(integer < 0) {
            integer = Math.abs(integer);
            flag = true;
        }
        while (integer > 0) {
            string = String(integer % x) + string; // 对位运算取余就可获得最后一位
            integer = Math.floor(integer / x);
        }
        if (fraction) {
            string += fraction.toString(x)
        }
        console.log(flag ? -string: string);
        return flag ? -string: string;

    }
    convertNumberToString(-10, 2);
    convertNumberToString(0b10, 2);
  ```
- convertStringToNumber
  ```javaScript
    function convertStringToNumber(string, x) {
        if (arguments.length < 2) {
            x = 10; // 赋默认进制转换值
        }
        // 进制是否正确
        if (![2, 8, 10, 16].includes(x)) {
            throw "数字转换进制不正确";
        }
        // 检查参数是否是string类型
        if (typeof string !== 'string') {
            throw "第一个参数不是string类型";

        }
        // 十进制 ^\d+\.?$ | ^\d*\.\d+$
        // 科学计数法 ^\d*\.?\d*[e|E]-?\d+$
        // 检查数据是否是合法的number类型
        if (!/^-?\d+\.?$|^-?\d*\.\d+$|^-?\d*\.?\d*[e|E]-?\d+$/g.test(string)) {
            throw "第一个参数不是合法的number数据";
        }
        let flag = false; // 判断是否是负数

        if (string.startsWith("-")) {
            string = string.slice(1);
            flag = true;
        }
        // 是否是科学计数法数值
        if (/[e|E]/g.test(string)) {
            const arr = string.match(/\d+\.?\d*/g);
            const numbers = arr[0].split(".");
            // 需往后移位的科学计数法
            if (/[eE]-/g.test(string)) {
                if (numbers[0].length > +arr[1]) {
                    const dist = numbers[0].length - (+arr[1]);
                    const integerString = arr[0].replace(".", "").slice(0, dist);
                    const logString = arr[0].replace(".", "").slice(dist);
                    string = integerString + '.' + logString;
                } else {
                    const dist = (+arr[1]) - numbers[0].length;
                    string = "0." + (arr[0].replace(".", "").padStart(dist + arr[0].length - 1, "0"));
                }
                // 往前进位的科学计数法
            } else {
                if (numbers[1].length > +arr[1]) {
                    const integerString = arr[0].replace(".", "").slice(0, +arr[1] + 1);
                    const logString = arr[0].replace(".", "").slice(+arr[1] + 1);
                    string = integerString + '.' + logString;
                } else {
                    const dist = +arr[1] - numbers[1].length;
                    string = arr[0].replace(".", "").padEnd(dist + arr[0].length - 1, "0");
                }
            }
        }
        var chars = string.split('');
        let number = 0;
        var i = 0;
        // 数值
        while (i < chars.length && chars[i] !== '.') {
            number = number * x; // 每次移一位
            number += chars[i].codePointAt(0) - '0'.codePointAt(0); // charCodeAt
            i++;
        }
        if (chars[i] === '.') {
            i++;
        }
        var fraction = 1;
        while (i < chars.length) {
            fraction = fraction / x; // 每次移一位
            number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction; // charCodeAt
            i++;
        }
        console.log(flag ? -number : number)
        return flag ? -number : number;
    }
    convertStringToNumber("10.02", 2);
  ```