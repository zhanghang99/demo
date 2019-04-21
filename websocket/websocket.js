function createWebSocket(obj){
    if(!window.WebSocket) return {content:'您的浏览器不支持WebSocket'}
    this.ws = null;
    this.heartCheck = {
        url:obj.url,//websocket的地址
        firstTimeOut:obj.firstTimeOut,//第一次请求websocket时间
        timeout:obj.timeout, //心跳间隔时间,
        delayTimeOut:obj.delayTimeOut,//出现异常或报错后重新链接时的间隔时间
        timeoutObj:null,//每次心跳请求的定时器
        serverTimeoutObj: null,//每次心跳后没收到后台信息隔断时间关闭websocket的定时器
    }

    // this.onclose = function() {};
    // this.onerror = function() {};
    // this.onopen = function() {};
    // this.onmessage = function() {};
    // this.onreconnect = function() {};

    this.init();
};
createWebSocket.prototype.init = function() {
    try {
        this.ws = new WebSocket(this.heartCheck.url);
        this.initConnect();
    } catch(e) {
        console.log('catch');
        this.reconnect();
    }
};
createWebSocket.prototype.initConnect = function() {
    this.ws.onopen = function(event) {
        this.onopen(event);
        this.start(this.heartCheck.firstTimeOut);
    }.bind(this);
    this.ws.onmessage = function(event) {
        this.onmessage(event);
        this.reset();
    }.bind(this)
    this.ws.onclose = function(event) {
        console.log('关闭');
        this.onclose(event);
        this.reconnect();
    }.bind(this);
    this.ws.onerror = function(err) {
        this.onerror(event);
        this.reconnect();
    }.bind(this);
};
createWebSocket.prototype.reconnect = function() {
    //this.lockReconnect节流,出现异常没连接上会一直重连，设置延迟避免请求过多
    //this.handleCloseReconnect前端手工关闭
    if (this.lockReconnect || this.handleCloseReconnect) return;
    this.lockReconnect = true;
    this.tt && clearTimeout(this.tt);
    this.tt = setTimeout(function() {
        this.init();
        this.lockReconnect = false;
    }.bind(this), this.heartCheck.delayTimeOut);
};
createWebSocket.prototype.reset = function() {
    //当心跳后onmessage无法接收后台返回数据，无法reset则无法清除定时器this.serverTimeoutObj，
    //一段时间后定时器this.serverTimeoutObj关闭websocket触发onclose，重新reconnect
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    this.start(this.heartCheck.timeout);
};
createWebSocket.prototype.start = function(time) {
    this.timeoutObj = setTimeout(function() {
        this.ws.send(JSON.stringify({
            "ping": 18212558000
        }));
        this.serverTimeoutObj = setTimeout(function() {
            this.ws.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        }.bind(this), this.heartCheck.delayTimeOut)
    }.bind(this), time)
};
createWebSocket.prototype.close = function () {
    //如果手动关闭连接，不再重连
    this.ws.close();
    this.handleCloseReconnect = true;
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
};