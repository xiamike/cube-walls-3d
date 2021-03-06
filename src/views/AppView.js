var View = require('famous/core/View');
var Modifier       = require('famous/core/Modifier');
var Surface = require('famous/core/Surface');
var RepulsionForce = require('famous/physics/forces/Repulsion');
var Transform = require('famous/core/Transform');
var StateModifier = require('famous/modifiers/StateModifier');
var Transitionable = require('famous/transitions/Transitionable');
var Walls = require('famous/physics/constraints/Walls');
var Collision = require('famous/physics/constraints/Collision');
var VectorField = require('famous/physics/forces/VectorField');
var Vector = require('famous/math/Vector');

var Drag = require('famous/physics/forces/Drag');
var Particle = require('famous/physics/bodies/Particle');
var Circle = require('famous/physics/bodies/Circle');
var CubicView = require('./CubicView');
var PhysicsEngine = require('famous/physics/PhysicsEngine');
// var MouseSync     = require("famous/inputs/MouseSync");
// var TouchSync     = require("famous/inputs/TouchSync");
// var ScrollSync    = require("famous/inputs/ScrollSync");
// var GenericSync   = require("famous/inputs/GenericSync");

// GenericSync.register({
//     "mouse"  : MouseSync,
//     "touch"  : TouchSync,
//     "scroll" : ScrollSync
// });

function AppView() {
    View.apply(this, arguments);

    // this.sync = new GenericSync({
    //     "mouse"  : {},
    //     "touch"  : {},
    //     "scroll" : {scale : .5}
    // });
    
    this._physicsEngine = new PhysicsEngine();

    this._rotationTransitionable = new Transitionable([0, 0, 0])

    this._rotationModifier = new Modifier({
        // origin: [0.5, 0.5],
        // align: [0.5, 0.5],
        transform: function() {
            return Transform.rotate.apply(this, this._rotationTransitionable.get());
        }.bind(this)
    });

    this._rootNode = this.add(this._rotationModifier);

    var anchor = new Surface({
      size: [50, 50],
      properties: {
        backgroundColor: 'red'
      }
    });

    this.add(anchor);

    _createBackground.call(this);
    _createCube.call(this);
    _createSpheres.call(this);
    _createWalls.call(this);
    _bindEvents.call(this);
}

AppView.prototype = Object.create(View.prototype);
AppView.prototype.constructor = AppView;

AppView.DEFAULT_OPTIONS = {};

function _createCube() {
    // var edgeLength = window.innerWidth < window.innerHeight ? window.innerWidth * 0.5 : window.innerHeight * 0.5;
    var edgeLength = 500;
    var cube = new CubicView({
        edgeLength: edgeLength
    });
    // cube.pipe(this.sync);
    this._rootNode.add(cube);
}

function _createWalls() {
    this._walls = new Walls({
        restitution : 0.5,
        size : [500, 500, 500],
        origin : [0.5, 0.5, 0.5],
        k : 0.5,
        drift : 0.5,
        slop : 0,
        sides : Walls.SIDES.THREE_DIMENSIONAL,
        onContact : Walls.ON_CONTACT.REFLECT
    });
    
    this._walls.options.sides = this._walls.components; // Patch for bug in Walls module.
    this._walls.sides = this._walls.components;         // Patch for bug in Walls module.
    
    // this._physicsEngine.attach([this._walls, drag]);
    this._physicsEngine.attach(this._walls, this._spheres);
}

function  _createSpheres() {
    
    this.spheres = [];
    for(var i=0; i<5; i++) {
        var sphere = _createSphere();
        this._rootNode.add(sphere.modifier).add(sphere.surface);
        this._physicsEngine.addBody(sphere.circle);
        this.spheres.push(sphere.circle);
        
        // var sphereR = 20;
        // var sphereSurface = new Surface({
        //     size: [2*sphereR, 2*sphereR],
        //     classes: ['particle'],
        //     properties: {
        //         backgroundColor: 'blue'
        //     }
        // });

        // var sphereParticle = new Circle({
        //   radius: 25
        // });
        
        // var sphereModifier = new Modifier({
        //     size: [2*sphereR, 2*sphereR],
        //     align: [0.5, 0.5],
        //     origin: [0.5, 0.5],
        //     transform: function() {
        //         return sphereParticle.getTransform();
        //     }
        // });

        // this._physicsEngine.addBody(sphereParticle);
        // this.spheres.push(sphereParticle);
        // sphereParticle.setVelocity(0.2, 0, 0);
        // this._rootNode.add(sphereModifier).add(sphereSurface);

        // var gravity = new RepulsionForce({
        //     strength: -5
        // });

        // var gravity = new VectorField({
        //     strength : 0.005
        // });
        // this._physicsEngine.attach(gravity, sphereParticle, anchorParticle);
    }

}

function _createSphere() {
    var circle = new Circle({
      radius: 25
    });

    circle.applyForce(new Vector(Math.random() * 0.01, Math.random() * 0.01, 0));

    var surface = new Surface({
      size: [50, 50],
      classes: ['particle'],
      properties: {
        backgroundColor : 'blue'
      }
    });

    var modifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
      size: [50, 50],
      transform: function() {
        return circle.getTransform();
      }
    });

    return {
      circle: circle,
      modifier: modifier,
      surface: surface
    };
}

function _createBackground() {
    this._backgroundSurface = new Surface({
        size: [undefined, undefined]
    })
    // this._backgroundSurface.pipe(this.sync);
    this.add(this._backgroundSurface);
}

function _bindEvents() {
    // this.sync.on('start', function(data){
    //     console.log('start', data.delta);
    // });

    // this.sync.on('update', function(data){
    //     var dX = data.delta[0];
    //     var dY = data.delta[1];

    //     var old_rotation = this._rotationTransitionable.get();
    //     //clamp for now.  
    //     if(Math.abs(old_rotation[0] - dY/100) <= 1) old_rotation[0] -= dY/100;
    //     old_rotation[1] += dX/100;
    // }.bind(this));

    // this.sync.on('end', function(data){
    //     console.log('end', data.delta);
    // });
}

module.exports = AppView;
