NovaJS
======

This is an experiment in making Escape Velocity Nova run in the browser. Escape Velocity Nova (EV Nova) is a game created by [Ambrosia Software](http://www.ambrosiasw.com/) in collaboration with [ATMOS](https://en.wikipedia.org/wiki/ATMOS_Software).

[Here's a running example](http://52.23.233.30) (works in Chrome).

### Project Goals
* Function as a Nova Engine that can, given Nova files, run EV Nova.
* Support Nova Plug-ins.
* Improve on some of the issues with EV Nova's engine (such as limited turning angles) as long as doing so does not greatly affect gameplay.
* Support multiplayer to an extent.

## Wait, but isn't EV Nova Copyrighted?

Yes. Escape Velocity Nova is copyrighted by Ambrosia Software. I claim no rights to anything in the [objects](https://github.com/mattsoulanille/NovaJS/tree/master/Nova/objects) directory, nor do I claim any rights over pictures or Nova Data in this repository. The end goal of this project is to write a Nova engine that can interpret Nova files without including any Nova data itself, thereby avoiding these legal issues.

## Getting Started

### Prerequisites

[node.js](https://nodejs.org/),
[npm](https://www.npmjs.com/)

### Installing

Clone the repository
```
git clone git@github.com:mattsoulanille/NovaJS.git
```
Move to the `NovaJS/Nova` directory
```
cd NovaJS/Nova
```

Install packages with `npm`
```
npm install
```
At this point, you can run NovaJS with
```
node index.js
```
By default, Nova runs on port 8000. See [Deployment](Deployment) for instructions on changing this. Assuming you installed on the machine you would like to play from, navigate to
```
http://localhost:8000
```

## Running the Tests
Haha. Wouldn't it be nice if I had written tests. TODO.

## Deployment
Deployment is the same as installation, however, the port used for the server can be changed by editing the `port` variable in [index.js](https://github.com/mattsoulanille/NovaJS/blob/master/Nova/index.js).

## Contributing

I welcome pull requests, however, I am often in school and unable to accept them immediately. Some easy places to contribute include:
* Sound: Sound has been completely untouched since the start of the project.
* Menus: Some work on menus has been done, but it has been vary basic so far (on the scale of displaying a box when landing on a planet).
* Particles: This includes missile trails and hit particles. [pixi-particles](https://github.com/pixijs/pixi-particles) seems like it would work well for this, but a texture generator that turns Nova's particle descriptions into textures will still need to be written. Nova has two types of particles:
   * cicn: These particles are pictures, so they would need to be parsed from the Nova files and turned into pixi textures.
   * normal / other: These particles are generated by the Nova engine at runtime. They are one pixel large and have a color and alpha, and most if not all of them are defined in the wëap resource. Pixi-particles supports changing the color of its particle texture, so it seems that only one 1-pixel particle texture would be needed (this can be an image file).
* NPCs and AI: The server can supposedly simulate the universe, however, in practice, it has only ever been used to pass messages between clients. Writing in NPCs would require verifying that the server actually simulates the system correctly (which would be a lot easier if I had actually written any tests. I should probably do that).

## Known Bugs
* When leaving a planet, the planet remains selected even when no navigation target is set. I'm fairly sure I've just forgotten to delete the target corners.
* When leaving a planet, radar stops working.
* Ship velocity scaling is wrong in that ships are far too fast. I think the scale should be 3/10 of what it currently is, but Nova gives a speed boost to the player when they're not playing in strict mode, so I don't know what the actual scale is. Perhaps the coordinate system needs to be redone so that no scaling is needed for non-player ships?
* Beam weapons do not clip after colliding with a target and instead pass through as if they did not collide (more of a feature that hasn't been implemented yet).
* Beam weapons seem to do too much damage, but maybe that's me just not being used to stock Nova ships.
* When a client connects, other clients do not immediately show the new client.
* Sometimes the server does not realize when a client disconnects.
* Various texture layring issues such as stars being above planets, etc.
* Weapon firing does not yet account for the fact that nova ships are rendered slightly off vertical (consequently, ships don't always look like they're firing straight).


## Unsolved Multiplayer Questions
* How will mission strings that significantly change the universe work?
  * Put people in their respective system for every changed system? But then it's not multiplayer.
  * Put everyone in the same system, but make the planets different based on the state of the universe? But there are fleets...
  * Choose a system randomly and put everyone in it?
    * How do you detect which systems are actually just different instances of the same system?
  * This is probably the biggest proplem with multiplayer support, and I welcome any suggestions.
* How will dates work? Realtime is definitely a bad idea for timing missions since it takes time to read the dialogue. Maybe everyone just has a different date that changes normally (when you jump / land)?
* Will there be some form of chat, and if so, where will it be? Perhaps you need to hail other ships to talk to them? Perhaps it's just in the bottom left info area?
* How will hailing other ships be managed when the game can't just pause whenever?
* How will 2x speed work on a client basis? (It probably just won't and will be a server-configured option).
* Should we make the AI behave like humans such that it's not obvious who the other players are? This probably won't work since AI never actually lands on planets. Also, humans do insane things.
* How should pilot files be saved? How should deaths be handled? (These have more obvious answers, I think)





