import {Howl} from 'howler';

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