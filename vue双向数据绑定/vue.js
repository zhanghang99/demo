const OP = Object.prototype;  
const types = {  
  obj:'[object Object]',  
  array:'[object Array]'  
}  
class Jsonob{  
    constructor(obj,cb){  
        if(OP.toString.call(obj) !== types.obj && OP.toString.call(obj) !== types.array){  
            console.log('请传入一个对象或数组');  
            return false;  
        }  
        this._callback = cb;
        this.init(obj);  
    }  
    init(obj){
        this.observe(obj);  
    }
    observe(obj){  
        if (typeof obj !== 'object') {
            return;
        }
        Object.keys(obj).forEach((key)=>{  
            this.defineReactive(obj, key, obj[key]);
        },this)  
    }  
    defineReactive(data, key, val){
        console.log(key);
        this.observe(val); // 递归遍历所有子属性
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get:function(){  
                return val;  
            },  
            set:(function(newVal){
                this._callback(key, val, newVal,val === newVal ? false : true)  
                val = newVal  
            }).bind(this)  
        });
    }

}  

var data = {  
    a: 200,  
    b: 100,  
    // level1: {  
    //     b: 'str',  
    //     c: [1, 2, 3],  
    //     level2: {  
    //         d: 90  
    //     }  
    // }  
}  

var arr = [
    1,
    2
];

var result = false;
var cb = (key, oldVal, newVal, isChange)=>{  
    console.log("改变的key值："+key+",  改变前的值为："+ oldVal+",  改变后的值为：" + newVal + ",   当前值是否改变：" + isChange)  
    result = isChange || result;
}  

// new Jsonob(data,cb);  
// // data.level1.level2.d = 90 
// data.c = 50 
// data.d = 50 

new Jsonob(arr,cb);  
arr.unshift(6)
// new Jsonob(arr,cb);  
// arr[2]=4;

console.log("监听对象或者数组内容是否改变：" + result);