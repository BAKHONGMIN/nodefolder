const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      const type = req.query.type;
      cb(null, type);
    } catch (error) {
      console.log(error);
    }
  },
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, moment().format("YYYYMMDDHHmmss") + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");
module.exports = upload;
