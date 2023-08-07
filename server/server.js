const express = require("express");

// 파일 업로드 조회 부분
const indexRouter = require("../routes/index");
const usersRouter = require("../routes/users");
const swtoolRouter = require("../routes/SwtoolRout");
const fileuploadRouter = require("../routes/UploadRout");

// 회원가입 부분
const usersRouter = require("../routes/UsersRout");

const app = express();

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/Swtool", swtoolRouter);
app.use("/api/upload", fileuploadRouter);

// 회원 가입
app.use("/api/register", usersRouter);

/* express.static 함수를 사용하면 정적 파일 경로(/uploads)를 설정할 수 있다.
정적 파일 경로를 사용하면 파일 사용이 필요할 때 지정한 경로에서만 파일을 찾을수 있다는 보안상의
 이점이 있다. 또 지정 경로(/upload)를 제외한 짧은 url로 파일 경로를 호출할 수 있다. */
app.use(express.static("./uploads"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
