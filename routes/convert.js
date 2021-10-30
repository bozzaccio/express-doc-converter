// import
const express = require('express');
const fs = require("fs");
const libre = require("libreoffice-convert");
const path = require("path");
const multer = require("multer");
const router = express.Router();

// global variables
const FILE_PATH = 'public/data/uploads';

let fileName;
let originalFileName;

function fileNameNormalizer(filename) {

    if (!filename) {
        return;
    }

    const fileExtRegEx = /(?:\.([^.]+))?$/;
    const originalFileExt = fileExtRegEx.exec(filename);
    originalFileName = filename.replace(/\.[^/.]+$/, "");

    return originalFileName + '-' + (new Date()).toISOString() + originalFileExt[0];
}


/* POST pdf for conversion to word. */
router.post('/word',
    function (req, res, next) {
        res.send('respond with a resource');
    });


const wordStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FILE_PATH)
    },
    filename: (req, file, cb) => {

        if (!file) {
            throw Error("File cannot be null!");
        }

        fileName = fileNameNormalizer(file.originalname);
        cb(null, fileName);
    }
})

const wordFilter = (req, file, cb) => {
    if (['application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/doc',
        'application/ms-doc']
        .includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


const wordBin = multer({storage: wordStorage, fileFilter: wordFilter})

/* POST word for conversion to pdf. */
router.post('/pdf', wordBin.single('file'), (req, res) => {

    if (req.file) {

        const localFilePath = FILE_PATH + '/' + fileName;
        const outputFile = FILE_PATH + '/' + originalFileName + '.pdf';

        const file = fs.readFileSync(localFilePath);

        libre.convert(file, ".pdf", undefined, (err, done) => {
            if (err) {
                fs.unlinkSync(localFilePath);
                fs.unlinkSync(outputFile);

                res.status(500).send("Error: file conversion fail");
            }

            fs.writeFileSync(outputFile, done);

            res.download(outputFile, (err) => {
                if (err) {
                    fs.unlinkSync(localFilePath);
                    fs.unlinkSync(outputFile);

                    res.status(500).send("Error: file download fail");
                }

                fs.unlinkSync(localFilePath);
                fs.unlinkSync(outputFile);
            })
        })
    }
})


module.exports = router;
