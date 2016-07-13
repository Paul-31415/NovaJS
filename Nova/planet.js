function planet(name) {
    spaceObject.call(this, name);
    this.url = "objects/planets/"
}


planet.prototype = new spaceObject;


planet.prototype.addSpritesToContainer = function() {
    _.each(_.map(_.values(this.sprites), function(s) {return s.sprite;}),
	   function(s) {this.spriteContainer.addChild(s);}, this);
    this.hide()

    stage.addChildAt(this.spriteContainer, 0);
}
