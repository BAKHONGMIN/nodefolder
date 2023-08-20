const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const secretObj = require("../ignorefile/jwt");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/", (req, res, next) => {
  const type = req.query.type;
  if (type === "signup") {
    //회원가입 정보 삽입
    try {
      //Mysal Api 모듈(CRUD)
      const dbconnect_Module1 = require("./dbconnect_Module1");

      // Mysql 쿼리 호출정보 입력
      req.body.mapper = "UserMapper"; //mybatis xml파일명
      req.body.crud = "insert"; //select, insert, update, delete 중에 입력
      req.body.mapper_id = "insertUser";

      const myPlaintextPassword = req.body.is_Password;
      if (myPlaintextPassword !== "" && myPlaintextPassword !== undefined) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
            req.body.is_Password = hash;
            router.use("/", dbconnect_Module1);
            next("route");
          });
        });
      } else {
        router.use("/", dbconnect_Module1);
        next("route");
      }
    } catch (error) {
      console.log("Module > dbconnect error : " + error);
    }
  } else if (type === "dplicheck") {
    //이메일 중복체크
    try {
      // Mysql API 모듈(CRUD)
      const dbconnect_Module1 = require("./dbconnect_Module1");

      //Mysql 쿼리 호출정보 입력
      req.body.mapper = "UserMapper"; //mybatis xml 파일명
      req.body.crud = "select"; // select, insert, update, delete중에 입력
      req.body.mapper_id = "selectUserDpliCheck";
      router.use("/", dbconnect_Module1);
      next("route");
    } catch (error) {
      console.log("Module > dbconnect error : " + error);
    }
  } else if (type === "signin") {
    //로그인 조회
    try {
      // MYSQL API 모듈(CRUD)
      const dbconnect_Module1 = require("./dbconnect_Module1");

      //MYSAL 쿼리 호출 정보 입력
      req.body.mapper = "UserMapper"; // mybatis xml 파일명
      req.body.crud = "select"; //select, insert, update, delect  중에 입력
      req.body.mapper_id = "selectLoginCheck";

      router.use("/", dbconnect_Module1);
      next("route");
    } catch (error) {
      console.log("Module > dbconnect error : " + error);
    }
  } else if (type === "SessionState") {
    const userid = req.body.is_Email;
    const name = req.body.is_UserName;
    try {
      const token1 = jwt.sign({ email: userid }, secretObj.secret, {
        expiresIn: "60m",
      });

      const token2 = jwt.sign({ username: name }, secretObj.secret, {
        expiresIn: "60m",
      });
      res.send({ token1: token1, token2: token2 });
    } catch (error) {
      res.send(error);
    }
  } else if (type === "SessionConfirm") {
    try {
      const token1 = req.body.token1;
      const token2 = req.body.token2;

      if (
        token1 !== undefined &&
        token1 !== "" &&
        token2 !== undefined &&
        token2 !== ""
      ) {
        const decoded1 = jwt.verify(token1, secretObj.secret);
        const decoded2 = jwt.verify(token2, secretObj.secret);
        res.send({ token1: decoded1.email, token2: decoded2.username });
      } else {
        res.send({ token1: "", token2: "" });
      }
    } catch (error) {
      res.send(error);
    }
  } else if (type === "SessionSignin") {
    // 쿠키 정보로 사용자 인증
    try {
      // Mysql Api 모듈(CRUD)
      const dbconnect_Module1 = require("./dbconnect_Module1");
      //Mysql 쿼리 호출정보 입력
      req.body.mapper = "UserMapper"; //mybatis xml 파일명
      req.body.crud = "select"; //select, insert, update, delete 중에 입력
      req.body.mapper_id = "selectSessionLoginCheck";

      router.use("/", dbconnect_Module1);
      next("route");
    } catch (error) {
      console.log("Module > dbconnect error : " + error);
    }
  } else if (type === "pwreset") {
    // 비밀번호 재설정 시 이메일과 이름으로 회원정보 조회
    try {
      //MYSQL API 모듈(CRUD)
      const dbconnect_Module1 = require("./dbconnect_Module1");

      //MYSQL 쿼리 호출정보 입력
      req.body.mapper = "UserMapper"; //mybatis xml 파일명
      req.body.crud = "select"; //select, insert, update, delete중에 입력
      req.body.mapper_id = "selectLoginResetCheck";

      router.use("/", dbconnect_Module1);
      next("route");
    } catch (error) {
      console.log("Module > dbconnect error : " + error);
    }
  } else if (type === "emailtoken") {
    //이메일 이증후 token으로 사용자 인증
    try {
      //MYSQL API 모듈(CRUD)
      const dbconnect_Module1 = require("./dbconnect_Module1");

      //Mysql ㅜ커리 호출정보 입력
      req.body.mapper = "UserMapper";
      req.body.crud = "select";
      req.body.mapper_id = "selectEmailTokenCheck";

      router.use("/", dbconnect_Module1);
      next("route");
    } catch (error) {
      console.log("Module > dbconnect error : " + error);
    }
  } else if (type === "pwdmodify") {
    try {
      const dbconnect_Module1 = require("./dbconnect_Module1");

      req.body.mapper = "UserMapper";
      req.body.crud = "update";
      req.body.mapper_id = "updatePwdUser";

      const myPlaintextPassword = req.body.is_Password;
      if (myPlaintextPassword !== "" && myPlaintextPassword !== undefined) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
            req.body.is_Password = hash;
            router.use("/", dbconnect_Module1);
            next("route");
          });
        });
      } else {
        router.use("/", dbconnect_Module1);
        next("route");
      }
    } catch (error) {
      console.log("Module > dbconnect error : " + error);
    }
  }
});

module.exports = router;
