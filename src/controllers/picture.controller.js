const responseUtil = require("../utils/response.util");
const picture = require("../utils/picture.util")
const path = require('path');

async function upload(req, res) {
    try {
        const imagePath = path.join(path.resolve(__dirname, "../../"), '/public/images');
        // call class Resize
        const fileUpload = new picture.Resize(imagePath);
        if (!req.file) {
            res.status(401).json({error: 'Please provide an images'});
        }
        const filename = await fileUpload.save(req.file.buffer);

        res.json(responseUtil.success({data: {name: filename}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }

}


module.exports = {
    upload
};