const gettable = require("../libraries/gettable.js");
const PIXI = require("pixi.js");
const path = require("path");
const novaDataTypes = require("../parsing/novaDataTypes.js");
const getURL = require("./getURL.js");
const gameDataSuper = require("../superclasses/gameDataSuper.js");


class gameData extends gameDataSuper {
    constructor() {
	super();
	
	for (let i in novaDataTypes) {
	    let name = novaDataTypes[i];
	    this.addGettable(name);
	}

	this.data.sprite = {};
	this.data.sprite.fromPict = this.getSpriteFromPict.bind(this);
	this.data.texture = {};
	this.data.texture.fromPict = this.getTextureFromPict.bind(this);
    }

    async _build() {
	this.meta = await getURL(path.join(this.metaPath));
	super._build();
    }
    
    getSpriteFromPict(globalID) {
	if (typeof globalID == "undefined") {
	    console.warn("No ID given so returning empty sprite");
	    return new PIXI.Sprite();
	}
	return new PIXI.Sprite.fromImage(path.join(this.resourcePath, "picts", globalID + ".png"));
    }

    getTextureFromPict(globalID) {
	if (typeof globalID == "undefined") {
	    console.warn("No ID given so returning empty texture");
	    return new PIXI.Texture();
	}
	return new PIXI.Texture.fromImage(path.join(this.resourcePath, "picts", globalID + ".png"));
    }
    
    addGettable(name) {
	var extension;
	switch(name) {
	case ("spriteSheetImage"):
	    extension = ".png";
	    break;
	case ("pict"):
	    extension = ".png";
	    break;
	default:
	    extension = ".json";
	}
	this.data[name] = new gettable(this._makeGetFunction(name, extension));
	
    }

    // The function for the gettable
    _makeGetFunction(name, extension) {
	return function(item) {
	    if (typeof item == "undefined") {
		throw new Error("Requested undefined item");
	    }
	    var url = path.join(this.resourcePath, name, item + extension);
	    return getURL(url);
	}.bind(this);
    }
}


module.exports = gameData;
