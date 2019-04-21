var ws = require("nodejs-websocket")
 
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection");
 
    //获取连接信息
    conn.on("text", function (str) {
        var n = 0;
        // setInterval(()=>{
            console.log("Received "+str);
            ++n;
            conn.sendText('{"mark":"1","socketId":"afawefasdfawefasdfaw4658496845235"}')
            // conn.sendText("")
        // },1000)
    });
 
    //断开连接的回调
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
 
    //处理错误事件信息
    conn.on('error',function(err){
        console.log('throw : err');
        console.log(err);
    })
}).listen(8001,()=>{console.log('监听8001成功！')});