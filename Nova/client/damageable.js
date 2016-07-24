

if (typeof(module) !== 'undefined') {
    module.exports = damageable;
    var collidable = require("../server/collidableServer.js");
    var _ = require("underscore");
    var Promise = require("bluebird");

}

function damageable(buildInfo, system) {
    collidable.call(this, buildInfo, system)
    if (typeof(buildInfo) !== 'undefined') {
	this.buildInfo.type = "damageable";
    }

}

damageable.prototype = new collidable;

damageable.prototype.setProperties = function() {
    collidable.prototype.setProperties.call(this)
    this.shield = this.properties.maxShields;
    this.armor = this.properties.maxArmor;
}

damageable.prototype.receiveCollision = function(other) {
    this.shield -= other.shieldDamage;
    var minShield = -this.properties.maxShields * 0.05
    if (this.shield < 0) {
	if (this.shield < minShield) {
	    this.shield = minShield;
	}
	this.armor -= other.armorDamage;
    }
    if (this.armor <= 0) {
	this.armor = 0;
	this.velocity = [0,0];
	this.onDeath();
    }

}

damageable.prototype.updateStats = function(stats) {
    collidable.prototype.updateStats.call(this, stats);
    if (typeof(stats.shield) !== 'undefined') {
	this.shield = stats.shield;
    }

    if (typeof(stats.armor) !== 'undefined') {
	this.armor = stats.armor;
    }
    
}

damageable.prototype.getStats = function() {
    var stats = collidable.prototype.getStats.call(this);
    stats.shield = this.shield;
    stats.armor = this.armor;
    return stats;
}

damageable.prototype.render = function() {

    if (typeof(this.lastTime) != 'undefined') {
	// Nova shield and armor regen: 1000 pts of regen equals
	// 30 points of shield or armor per second
	this.shield += this.properties.shieldRecharge * 30/1000 * (this.time - this.lastTime) / 1000;
	this.armor += this.properties.armorRecharge * 30/1000 * (this.time - this.lastTime) / 1000;

	if (this.shield > this.properties.maxShields) {
	    this.shield = this.properties.maxShields;
	}

	if (this.armor > this.properties.maxArmor) {
	    this.armor = this.properties.maxArmor;
	}
    }

    collidable.prototype.render.call(this);
}

damageable.prototype.onDeath = function() {
    this.hide();
    

}

// damageable.prototype.destroy = function() {
    
//     this.hide();
    

// }