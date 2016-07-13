function damageable(name) {
    collidable.call(this, name)

}

damageable.prototype = new collidable;

damageable.prototype.setProperties = function() {
    collidable.prototype.setProperties.call(this)
    this.shield = this.properties.maxShields;
    this.armor = this.properties.maxArmor;
}

damageable.prototype.receiveCollision = function(other) {
    this.shield -= other.shieldDamage;
    if (this.shield < 0) {
	this.shield = 0;
	this.armor -= other.armorDamage;
    }
    if (this.armor <= 0) {
	this.armor = 0;
	this.velocity = [0,0];
	this.destroy();
    }

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

damageable.prototype.destroy = function() {
    
    this.hide();
    

}