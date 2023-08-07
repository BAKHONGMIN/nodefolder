import express from "express";
const router = express.Router();
import bodyParser from "body-parser";

import bcrypt from "bcrypt";
const saltRounds = 10;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/", (req, res, next) => {
  const type = req.query.type;
  if (type === "signup") {
    //회원가입 정보 삽입
  }
});
