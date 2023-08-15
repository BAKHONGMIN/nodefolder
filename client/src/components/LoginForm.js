import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";
import axios from "axios";
import cookie from "react-cookies";

export default function LoginForm() {
  const history = useNavigate();

  const submitClick = async (e) => {
    const email_val = $("#email_val").val();
    const pwd_val = $("#pwd_val").val();

    if (email_val === "" || pwd_val === "") {
      sweetalert("이메일과 비밀번호를 확인해주세요.", "", "info", "닫기");
      return false;
    }

    await axios
      .post("/api/LoginForm?type=signin", {
        is_Email: email_val,
        is_Password: pwd_val,
      })
      .then((response) => {
        const userid = response.data.json[0].useremail;
        const username = response.data.json[0].username;
        const upw = response.data.json[0].userpassword;

        if (userid !== null && userid !== "") {
          sweetalert("로그인 되었습니다.", "", "info", "닫기");

          // 쿠기 저장시간 설정
          const expires = new Date();
          expires.setMinutes(expires.getMinutes() + 60);

          axios
            .post("/api/LoginForm?type=SessionState", {
              is_Email: userid,
              is_UserName: username,
            })
            .then((response) => {
              console.log(response);
              cookie.save("userid", response.data.token1, {
                path: "/",
                expires,
              });
              cookie.save("username", response.data.token2, {
                path: "/",
                expires,
              });
              cookie.save("userpassword", upw, { path: "/", expires });
            })
            .catch((error) => {
              sweetalert(
                "작업중 오류가 발생하였습니다.",
                error,
                "error",
                "닫기"
              );
            });

          const timeout = setTimeout(() => {
            history("/SoftwareList");
          }, 1000);

          return () => clearTimeout(timeout);
        } else {
          sweetalert(
            "이메일과 비밀번호를 확인해주세요.(2)",
            "",
            "info",
            "닫기"
          );
        }
      })
      .catch((error) => {
        sweetalert("이메일과 비밀번호를 확인해주세요.(1)", "", "info", "닫기");
      });
  };

  const sweetalert = (title, contents, icon, confirmButtonText) => {
    Swal.fire({
      title: title,
      text: contents,
      icon: icon,
      confirmButtonText: confirmButtonText,
    });
  };

  return (
    <section className="main">
      <div className="m_login">
        <h3>
          <span>
            <img src={require("../img/main/log_img.png")} alt="" />
          </span>
          LOGIN
        </h3>
        <div className="log_box">
          <div className="in_ty1">
            <span>
              <img src={require("../img/main/m_log_i3.png")} alt="" />
            </span>
            <input type="text" id="email_val" placeholder="이메일" />
          </div>
          <div className="in_ty1">
            <span className="ic_2">
              <img src={require("../img/main/m_log_i2.png")} alt="" />
            </span>
            <input type="password" id="pwd_val" placeholder="비밀번호" />
          </div>
          <ul className="af">
            <li>
              <Link to={"/register"}>회원가입</Link>
            </li>
            <li className="pwr_b">
              <a href="#n">비밀번호 재설정</a>
            </li>
          </ul>
          <div className="s_bt" type="" onClick={(e) => submitClick(e)}>
            로그인
          </div>
        </div>
      </div>
    </section>
  );
}
