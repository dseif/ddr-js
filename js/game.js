import {engine} from './engine/engine.js';
import Receptor from './receptor.js';

const RECEPTOR_CONTAINER_WIDTH = 500;
const noop = function () {};

class Game {
    constructor(elem, callback=noop) {
        this._elem = elem;
        this._callback = callback;
        this._steps = null;
        this._currentSong = null;

        // Start new game engine
        this._engine = engine;
        // Create new stage
        this._stage = this._engine.createStage(elem.offsetWidth, elem.offsetHeight);
        // Add the stage to the DOM
        elem.appendChild(this._stage.view)

        // Create a container to store all the receptors
        this._receptorContainer = this._stage.createContainer((this._stage.width - RECEPTOR_CONTAINER_WIDTH) / 2, 75);
        // Create an array to store the base receptors
        this._baseReceptors = [];

        // Load all the assets
        this._engine.AM.load([{
            name: 'receptor',
            path: 'assets/receptor.png'
        }], (resources) => {
            this._baseReceptors = this._setupReceptors([1, 1, 1, 1], this._receptorContainer);
            // Add the static receptors to the top of the stage
            this._stage.addChild(this._receptorContainer);
            this._callback();
        });
    }

    // This is used to setup the `base` receptors that don't move at the top of the stage
    _setupReceptors(inputs=[], container, offsetY=0) {
        // Create sprites using the receptor resource
        let receptors = ['left', 'right', 'up', 'down'].map((direction, idx) => {
            if (+inputs[idx]) {
                return new Receptor(direction, offsetY);
            }
        });

        // Add each receptor to the container
        receptors.forEach((receptor) => {
            if (!receptor) {
                return;
            }
            container.addChild(receptor.sprite);
        });

        return receptors
    }

    _loadSteps(location='', callback=noop) {
        this.currentSong = location;
        this._engine.AM.loadRemote(location, (err, response, body) => {
            this._stepContainer = this._stage.createContainer(0, 75);
            // Put data into useable format
            this._steps = this._parseStepFile(body);

            /* 
             * Iterate over every measure in the step file. Each measure contains 4 beats.
             * Each beat can be broken up into 4th, 8th, 16th, 24th, 32nd, 48th, 64th, and 192nd notes.
             */
            this._steps.measures.forEach((measure, idx) => {
                // Determine number of potential (not every line will contain a note) notes in this measure.
                let numNotes = measure.length;
                let measureContainer = this._stage.createContainer(0, 0);
                let offsetNote = this._stage.height / numNotes;
                let currentOffsetY = 0;

                measureContainer.x = (this._stage.width - 500) / 2;
                measureContainer.y = (this._stage.height) * idx;

                // Iterate over all notes in measure and create a note for each
                measure.forEach((note, idx) => {
                    // There can be between 0 and 4 inputs for each note (left, down, up, right)
                    // Turn note into array so its easier to work with
                    let inputs = note.split('');
                    this._setupReceptors(inputs, measureContainer, currentOffsetY);
                    currentOffsetY += offsetNote;
                    this._stepContainer.addChild(measureContainer);
                });
            });

            this._stage.addChild(this._stepContainer);
            callback();
        });
    }

    // Turn stepfile into a useable format
    _parseStepFile(data={}) {
        var formatted = {
            meta: {},
            measures: []
        };
        var measure = [];

        data.split('\n').forEach((row) => {
            let metaInfo;

            // Don't do anything with an empty row
            if (row === '' || row === '\n') {
                return;
            }

            // Any row that begins with a '#' is meta info
            if (row.charAt(0) === '#') {
                // Strip unwanted characters
                row = row.substring(1, row.length - 1);
                // Separate the key/val
                metaInfo = row.split(':');
                formatted.meta[metaInfo[0]] = metaInfo[1] || '';
                return;
            }

            // Skip crap I don't understand
            if (row === ',' || +row >= 0) {
                // If we get to this point we know we're going to be parsing the inputs
                // Split measures on commas
                if (row !== ',') {
                    measure.push(row);
                    return;
                }

                // If this row === ',' we want to push the current measure into the formatted array
                // and reset the current measure.
                formatted.measures.push(measure);
                measure = [];
            }
        });

        return formatted;
    }

    loadSong(location='', callback=noop) {
        this._loadSteps(location, callback);
        this._audio = this._engine.audio.load('songs/Idol/Idol.ogg');
    }

    start() {
        var firstTime = true;
        var isPlaying = false;
        var steps = this._steps;
        var scene = this._stage.scene;
        var frameOffset;
        var that = this;

        steps.meta.DISPLAYBPM = +steps.meta.DISPLAYBPM.substring(0, steps.meta.DISPLAYBPM.length - 1);

        function calculateFrameOffset() {
            // Determine how far to shift the container each frame.
            // First determine the Beats Per Second
            var BPS = steps.meta.DISPLAYBPM / 60;
            // Then determine the height of each measure. A measure contains 4 beats.
            var PixelsPerBeat = that._stage.height / 4;
            // Determine how many pixels we need to move each frame
            return (BPS * PixelsPerBeat) / 60;
        }

        frameOffset = calculateFrameOffset();
        scene.ticker.add((delta) => {
            if (firstTime) {
                // Wait until the audio starts playing begin animating the note stream
                this._audio.once('play', function () {
                    isPlaying = true;
                });
                this._audio.play();
                firstTime = false;
            }

            if (!isPlaying) {
                return;
            }

            this._stepContainer.y -= frameOffset;
        });
    }
}

export {Game}