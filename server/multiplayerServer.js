
var multiplayer = require("../client/multiplayer.js");

var multiplayerServer = class extends multiplayer {
    constructor() {
	super(...arguments);

	this.broadcaster = function(toEmit) {
	    this.socket.broadcast.emit(this.UUID + "event", toEmit);
	}.bind(this);

	this.socket.on(this.UUID + "event", this.broadcaster);

	// This contains all the instances of multiplayerServer
	this.globalSet.add(this);
	
    }
    _bindQueryListener() {}

    _send(eventName, eventData, sendFunction) {

	var toEmit = {};
	toEmit.name = eventName;
	toEmit.data = eventData;
	sendFunction(this.UUID, toEmit);
    }
    
    emit(eventName, eventData) {
	// broadcast to all the clients except this one
	this._send(eventName, eventData, this.socket.broadcast.emit.bind(this.socket));
    }
    // respond(eventName, eventData) {
    // 	// send to this client
    // 	this._send(eventName, eventData, this.socket.emit.bind(this.socket));
    // }

    // broadcast(eventName, eventData) {
    // 	// send to this client and all the others
    // 	// could use io.broadcast instead
    // 	this.emit(eventName, eventData);
    // 	this.respond(eventName, eventData);
    // }

    destroy() {
	super.destroy();
	this.globalSet.delete(this);
    }
    

};



// This is rather disgusting:
multiplayerServer.prototype.globalSet = new Set();

multiplayerServer.prototype.bindSocket = function(socket) {
    // This must be called once with the socket instance.
    // It handles communication between all instances of multiplayerServer
    // It is gross and terrible
    // It would be better if socket had a way of listening for events regardless of client.


    // If multiplayerObject doesn't get destroyed, these start piling up and sending bunches
    // of extra responses. Make sure to destroy multiplayerObject when it's no longer needed!

    socket.on("query", function(message) {
	this.globalSet.forEach(function(instance) {
	    instance.queryListener(message, socket);
	});
    }.bind(this));
    
    socket.on("response", function(message) {
	this.globalSet.forEach(function(instance) {
	    instance.responseListener(message);
	});
    }.bind(this));
    
};


module.exports = multiplayerServer;
