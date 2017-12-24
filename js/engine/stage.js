import * as PIXI from 'pixi.js';

// The Stage class is responsible for creating new PIXI items
class Stage {
    constructor(width, height) {
        this._WIDTH = width;
        this._HEIGHT = height;

        this._scene = new PIXI.Application(width, height, {
            backgroundColor : '000000'
        });
    }

    // Utility function for creating PIXI containers
    createContainer(x, y) {
        var container = new PIXI.Container();

        container.x = x;
        container.y = y;

        return container;
    }

    addChild(child) {
        this._scene.stage.addChild(child);
    }

    get view() {
        return this._scene.view;
    }

    get scene() {
        return this._scene;
    }

    get width() {
        return this._WIDTH;
    }

    get height() {
        return this._HEIGHT;
    }
}

export default Stage 