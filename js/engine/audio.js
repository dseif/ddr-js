var Howl = require('../../vendor/howler.min.js').Howl;

module.exports = {
    load: function (fileName) {
        if (!fileName) {
            return;
        }

        return new Howl({
            preload: true,
            src: [fileName]
        });
    }
};