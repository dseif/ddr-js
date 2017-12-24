import {degreesToRadians} from './utils/math.js';
import {engine} from './engine/engine.js';

var directionMap = {
    left: {
        rotation: 0,
        offset: 0
    },
    down: {
        rotation: 270,
        offset: 1
    },
    up: {
        rotation: 90,
        offset: 2
    },
    right: {
        rotation: 180,
        offset: 3
    }
};


class Receptor {
    constructor(direction, offsetY=0) {
        this._AM = engine.AM;
        this._offsetY = offsetY;
        this._direction = direction;

        let directionDetails = directionMap[direction];
        let sprite = this._AM.createSprite('receptor');

        sprite.anchor.set(0.5);
        sprite.x = (sprite.width + 25) * directionDetails.offset;
        sprite.y = offsetY;

        // Rotate the sprite based on the direction
        sprite.rotation = degreesToRadians(directionDetails.rotation);

        this._sprite = sprite;
    }

    get direction () {
        return this._direction;
    }

    get sprite() {
        return this._sprite;
    }
}

export default Receptor