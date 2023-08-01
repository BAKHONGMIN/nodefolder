const express = require("express");
const router = express.Router();
const upload = require("./fileupload");
const multer = require("multer");

router.post("/", (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(err);
    } else if (err) {
      return next(err);
    }
    console.log("원본파일명 : " + req.file.originalname);
    console.log("저장파일명 : " + req.file.filename);
    console.log("크기 : " + req.file.size);
    return res.json({ filename: req.file.filename });
  });
});

module.exports = router;
