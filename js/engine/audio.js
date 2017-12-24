var Howl = require('howler').Howl;

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