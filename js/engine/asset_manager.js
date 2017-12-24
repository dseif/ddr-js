import * as PIXI from 'pixi.js';
import request from 'browser-request';

const loader = PIXI.loader;

var resources = {};

function noop() {}

function load(assets=[], callback=noop) {
    // Attempt to load all assets
    assets.forEach((asset) => {
        if (!asset || !asset.name || !asset.path) {
            return;
        }

        // Queue up resources to be loaded
        loader.add(asset.name, asset.path);
    });

    // Setup handler for when asset loading completes
    loader.once('complete', (loader, items) => {
        // Update our internal reference of all resources
        for (let i in items) {
            if (items.hasOwnProperty(i)) {
                resources[i] = items[i];
            }
        }

        callback(items);
    });
    loader.load();
}

function createSprite(resourceName='') {
    var resource = resources[resourceName];

    // Can't create a new sprite without a resource
    if (!resource) {
        return;
    }

    return new PIXI.Sprite.from(resource.texture);
}

function loadRemote(location='', callback=noop) {
    request(location, callback);
}

export {
    load,
    loadRemote,
    createSprite,
    resources
}