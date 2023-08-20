/* eslint-disable no-useless-concat */
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

  const pwdResetClick = () => {
    $(".signin").hide();
    $(".chgpw").fadeIn();
    $(".chgpw").css("display", "table-cell");
  };

  const pwdResetCancleClick = () => {
    $(".chgpw").hide();
    $(".signin").fadeIn();
    $(".signin").css("display", "table-cell");
  };

  const pwdResetConfim = (e) => {
    const reset_email = $("#reset_email_val").val();
    const reset_name = $("#reset_name_val").val();
    if (reset_email === "" || reset_name === "") {
      sweetalert("이메일과 성명을 확인해주세요.", "", "info", "닫기");
    } else {
      axios
        .post("/api/LoginForm?type=pwreset", {
          is_Email: reset_email,
          is_Name: reset_name,
        })
        .then((response) => {
          let userpassword = response.data.json[0].userpassword;
          userpassword = userpassword.replace(/\//gi, "가");

          if (userpassword !== null && userpassword !== "") {
            sendEmail(reset_email, "비밀번호 재설정 메일", userpassword);
          } else {
            sweetalert("이메일과 성명을 확인해주세요.", "", "info", "닫기");
          }
        })
        .catch((error) => {
          sweetalert("이메일과 성명을 확인해주세요.", "", "info", "닫기");
        });
    }
  };

  const sendEmail = (email, subject, password, e) => {
    axios
      .post("/api/mail", {
        is_Email: email,
        is_Subject: subject,
        is_Password: password,
      })
      .then((response) => {
        if (response.data === "succ") {
          this.sweetalert(
            "입력하신 이메일로 비밀번호 \n" + "재설정 메일 보내드렸습니다.",
            "",
            "info",
            "닫기"
          );
        } else {
          sweetalert("작업중 오류가 발생하였습니다.", "", "error", "닫기");
        }
      })
      .catch((error) => {
        sweetalert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
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
      <div className="m_login signin">
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
            <li className="pwr_b" onClick={pwdResetClick}>
              <a href="#n">비밀번호 재설정</a>
            </li>
          </ul>
          <div className="s_bt" type="" onClick={(e) => submitClick(e)}>
            로그인
          </div>
        </div>
      </div>
      <div className="m_login m_pw chgpw">
        <h3 className="pw_ls">
          비밀번호 재설정
          <span className="compl1">완료</span>
        </h3>
        <div className="log_box">
          <div className="pw_one">
            <div className="in_ty1">
              <span>
                <img src={require("../img/main/m_log_i3.png")} alt="" />
              </span>
              <input
                type="text"
                id="reset_email_val"
                name=""
                placeholder="이메일"
              />
            </div>
            <div className="in_ty1">
              <span className="">
                <img src={require("../img/main/m_log_i1.png")} alt="" />
              </span>
              <input
                type="text"
                id="reset_name_val"
                name=""
                placeholder="성명"
              />
            </div>
            <div className="btn_confirm btn_confirm_m">
              <div
                className="bt_ty bt_ty_m bt_ty1 cancel_ty1"
                onClick={pwdResetCancleClick}
              >
                취소
              </div>
              <a
                href="#n"
                className="bt_ty bt_ty_m bt_ty2 submit_ty1"
                onClick={pwdResetConfim}
              >
                확인
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
