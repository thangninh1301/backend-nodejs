const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});

const sharp = require('sharp');
const uuid = require('uuid');
const path = require('path');

class Resize {
    constructor(folder) {
        this.folder = folder;
    }

    async save(buffer) {
        const filename = Resize.filename();
        const filepath = this.filepath(filename);

        await sharp(buffer)
            .resize(600, 600, { // size images 300x300
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(filepath);

        return filename;
    }

    static filename() {
        // random file name
        return `${uuid.v4()}.png`;
    }

    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`)
    }
}

module.exports = {
    upload,
    Resize
}