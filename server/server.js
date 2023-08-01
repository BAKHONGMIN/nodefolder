const express = require("express");

var indexRouter = require("../routes/index");
var usersRouter = require("../routes/users");
var swtoolRouter = require("../routes/SwtoolRout");

const app = express();

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/Swtool", swtoolRouter);
app.use("/api/upload", fileuploadRouter);

// express.static 함수를 사용하면 정적파일 경로(/uploads)를 설정할수 있다. 정적파일 경로를 사용하면
// 파일 사용이 필요할 때 지정한 경로에서만 파일을 찾을 수 있다는 보안상의 이점이 있다. 또 지정경로(/uploads)
// 를 제외한 짧은 url로 파일 경로를 호출할 수있다.
app.use(express.static("./uploads"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
