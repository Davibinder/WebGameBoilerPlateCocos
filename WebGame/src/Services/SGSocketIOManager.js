var SGSocketIOManager = new function(){
    this._sioClient = null;
    this._wsiSendText = null;
    this._connectionStatus = 0;
    this.connectToSocket = function (url) {
        //create a client by using this static method, url does not need to contain the protocol
        var sioclient = SocketIO.connect(url, {"force new connection" : true});
        //if you need to track multiple sockets it is best to store them with tags in your own array for now
        sioclient.tag = "SocialGameSocket";
        //attaching the connection status to the socketio client
        this._connectionStatus = 1;
        //register event callbacks
        //this is an example of a handler declared inline
        sioclient.on("connect", this.onConnection);
        //example of a handler that is shared between multiple clients
        sioclient.on("message", this.onMessage);
        sioclient.on("disconnect", this.onDisconnection);
        //custom test events
        sioclient.on("echotest", this.onEchoTest);
        //custom test events
        sioclient.on("testevent", this.onTestEvent);
        cc.log('establishing connection on url = '+url);
        this._sioClient = sioclient;
    };

    this.webSocketSetup = function () {
        // connect to my node.js server
        var io = Socket.connect("localhost:8888");
        // this will send a chat message event to my server
        io.emit('chat message','a message from cocos2d!');
    };

    this.onConnection = function () {
        var msg = this._sioClient.tag + " Connected!";
        this.statusLabel.setString(msg);
        cc.log(msg);
        this._sioClient.send(msg);
    };

    this.onDisconnection = function () {
        var msg = this._sioClient.tag + " Disconnected!";
        cc.log(msg);
    };

    this.onMessage = function (data) {
        cc.log(data);
    };

    this.onTestEvent = function (data) {
        cc.log(data);
    };

    this.onEchoTest = function (data) {
        cc.log("echotest 'on' callback fired!");
        var msg = this.tag + " says 'echotest' with data: " + data;
        this.statusLabel.setString(msg);
        cc.log(msg);
    };

};