/*
 * @Author: your name
 * @Date: 2019-08-26 15:53:04
 * @LastEditTime: 2020-09-22 09:46:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
 //导入依赖包 
 const request = require("superagent");
 const superagent = require("superagent-charset")(request);// 解决爬取中文乱码问题
 const nodeXlsx = require('node-xlsx')
 const nodemailer = require('nodemailer');
 
 // 配置
 const Config = {
     pollingTime: 60000,// 轮询间隔
     CrawlInterval: 1000 * 60 * 60 * 2,// 两次检查的时间间隔
     date: 0,// 当前检查完的时间戳
 }
 
 // 条件轮询
 const polling = () => {
     Config.date = new Date().getTime();
     crawlData();
     setInterval(()=>{
         const date1 = new Date().getTime();
         console.log(date1,'---time1---');
         if(date1 - Config.date >= Config.CrawlInterval){
             Config.date = date1;
             crawlData();
         }
     },Config.pollingTime)
 }
 
 // 开始检测
 const crawlData = () => {
     const ex1 = nodeXlsx.parse("./testEx.xlsx")	//读取excel表格
     let excel = ex1[0].data	//取出excel文件中的第一个工作表中的全部数据
     excel.splice(0,1)	//一般来说表中的第一条数据可能是标题没有用，所以删掉
     console.log(excel)	//查看读取出来的数据
     let RemoveProducts = [];
     excel.forEach((v,i)=>{
         superagent
             .get(v[1])
             .charset()
             .end((error, response) => {
                 let text = response.text;
                 let result = text.includes('price-title ladder-1');
                 console.log(result,i,'---result---');
                 if(!result){
                     RemoveProducts.push(v[1]);
                 }
                 if(excel.length === i + 1){
                     console.log(RemoveProducts,'---最终结果---');
                     // sendEmail();
                 }
             });
     })
 }
 
 // 发送邮件
 const sendEmail = () => {
     const transporter = nodemailer.createTransport({
         //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
         service: 'qq',
         port: 465, // SMTP 端口
         secureConnection: true, // 使用 SSL
         auth: {
             user: '1142469709@qq.com',
             //这里密码不是qq密码，是你设置的smtp密码
             pass: '070503@abcde'
         }
     });
     
     // NB! No need to recreate the transporter object. You can use
     // the same transporter object for all e-mails
     
     // setup e-mail data with unicode symbols
     const mailOptions = {
         from: '768065158@qq.com', // 发件地址
         to: '528779822@qq.com', // 收件列表
         subject: 'Hello sir', // 标题
         //text和html两者只支持一种
         text: 'Hello world ?', // 标题
         html: '<b>Hello world ?</b>' // html 内容
     };
     
     // send mail with defined transport object
     transporter.sendMail(mailOptions, function(error, info){
         if(error){
             return console.log(error);
         }
         console.log('Message sent: ' + info.response);
     
     });    
 }
 
 // 启动轮询
 polling();