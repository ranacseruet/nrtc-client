if(!window.io){
    //add socket.io dependency
    var script = document.createElement("script");
    script.src = "https://cdn.socket.io/socket.io-1.3.4.js";
    document.body.appendChild(script);
}

/**
 * Created by Rana on 15-01-11.
 */
function nRTC(name, apiKey, host) {

    if(!host){
        host = "http://demo.codesamplez.com:5000";
    }

    var socket = io.connect(host, {
        query: 'token=' + apiKey+"&username="+name
    });

    this.onConnect = function (cb) {
        socket.on('connect', function () {
            //cb(true);
            //console.log('connected');
        });
        socket.on("init", function(users){
            //console.log(users);
            cb(users);
        });
    };

    this.ondisconnect = function(cb) {
        socket.on('disconnect', function () {
            //console.log('disconnected');
        });
    };

    this.onError = function(cb){
        socket.on("error", function(error) {
            if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
                // redirect user to login page perhaps?
                //console.log("User's token has expired");
            }
        });
    };

    this.onUserJoin = function(cb){
        socket.on("joined", function(user){
            //console.log(user.username+" just came online");
            cb(user);
        });
    };

    this.onUserLeave = function(cb){
        socket.on("leaved", function(user){
            //console.log(user.username+" just leaved the chatroom");
            cb(user);
        });
    };

    this.onGroupMessage = function(callback) {
        socket.on('message', function (msg) {
            callback(msg.sender, msg.content);
        });
    };

    this.sendGroupMessage = function (message) {
        socket.emit('message', {sender:name, content:message});
        //console.log("message sent");
    };

    this.onPrivateMessage = function(callback) {
        socket.on('private-message', function (msg) {
            console.log("private msg: "+JSON.stringify(msg));
            //if(msg.reciever === name) {
            callback(msg.sender, msg.content);
            //}
        });
    };

    this.sendPrivateMessage = function (reciever, message) {
        socket.emit('private-message', {sender:name, reciever:reciever, content:message});
    };

    window.onbeforeunload = function (e) {
        socket.emit('disconnect', {username: name});
    };
}