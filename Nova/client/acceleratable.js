/*
acceleratable.js
Handles things that can accelerate (inertial and inertialess)
Uses inertialess and inertial
mixin


*/
if (typeof(module) !== 'undefined') {
    var inertialess = require("../server/inertialessServer.js");
    var inertial = require("../server/inertialServer.js");
    var _ = require("underscore");
    var Promise = require("bluebird");
}


var acceleratable = (superclass) => class extends superclass {

    constructor() {
	super(...arguments);
	this.lastAccelerating = false;
	this.accelerating = false;
	this.polarVelocity = 0;
	this.flightMode = new inertial; // default
	if (typeof(buildInfo) !== 'undefined') {
	    this.buildInfo.type = "acceleratable";
	}
    }

    updateStats(stats) {
	super.updateStats.call(this, stats);
	if (typeof(stats.accelerating) !== 'undefined') {
	    this.accelerating = stats.accelerating;
	}
	this.flightMode.updateStats.call(this, stats);
    }

    getStats() {
	var stats = super.getStats.call(this);
	stats = this.flightMode.getStats.call(this, stats);
	stats.accelerating = this.accelerating;
	return stats;
    }

    setProperties() {
	super.setProperties.call(this);
	this.properties.acceleration = this.meta.physics.acceleration;
	this.properties.maxSpeed = this.meta.physics.max_speed;
	this.properties.inertialess = this.meta.physics.inertialess;
	if (this.properties.inertialess) {
	    this.flightMode = new inertialess; // default = inertial
	}
    }

    receiveCollision(other) {

	if (other.impact > 0) {
	    var deltaV = other.impact / this.meta.physics.mass
	    var newVelocity = [Math.cos(other.angle) * deltaV + this.velocity[0],
			       Math.sin(other.angle) * deltaV + this.velocity[1]];
	    
	    var speed = Math.pow(Math.pow(newVelocity[0], 2) + Math.pow(newVelocity[1], 2), .5);
	    if (speed > this.properties.maxSpeed) {
		var tmpAngle = Math.atan(newVelocity[1] / newVelocity[0])
		if (newVelocity[0] < 0) {
		    tmpAngle = tmpAngle + Math.PI
		}
		//console.log(tmpAngle)
		newVelocity[0] = Math.cos(tmpAngle) * this.properties.maxSpeed;
		newVelocity[1] = Math.sin(tmpAngle) * this.properties.maxSpeed;
	    }
	    this.velocity[0] = newVelocity[0];
	    this.velocity[1] = newVelocity[1];    
	    
	}
	super.receiveCollision.call(this, other);
    }

    render() {

	if (this.renderReady) {
	    this.flightMode.render.call(this);
	    super.render.call(this);
	    return true;
	}
	else {
	    return false;
	}
    }
}

if (typeof(module) !== 'undefined') {
    module.exports = acceleratable;
}
