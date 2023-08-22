/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";

export default function PwChangeForm() {
  const params = useParams();

  const [email, setEmail] = useState(params.email);
  const [token, setToken] = useState(params.token);

  const history = useNavigate();

  useEffect(() => {
    setToken(token.replace(/가/gi, "/"));
    axios
      .post("/api/LoginForm?type=emailtoken", {
        is_Email: email,
        is_Token: token,
      })
      .then((response) => {
        if (response.data.json[0].username === undefined) {
          history("about:blank");
        }
      })
      .catch((error) => {
        sweetalert("유효한 접속이 아닙니다.", error, "error", "닫기");
        const timeout = setTimeout(() => {
          history("about:blank");
        }, 1000);

        return () => clearTimeout(timeout);
      });
  }, [email, token, history]);

  const submitClick = async (e) => {
    const pwd_val_checker = $("#pwd_val").val();
    const pwd_cnf_val_checker = $("#pwd_cnf_val").val();

    const fnValidate = (e) => {
      const pattern1 = /[0-9]/;
      const pattern2 = /[a-zA-Z]/;
      const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

      if (pwd_val_checker === "") {
        $("#pwd_val").addClass("border_validate_err");
        sweetalert("비밀번호를 입력해주세요.", "", "info", "닫기");
        return false;
      }
      if (pwd_val_checker !== "") {
        const str = pwd_val_checker;
        if (str.search(/\s/) !== -1) {
          $("#pwd_val").addClass("border_validate_err");
          sweetalert("비밀번호 공백을 제거해 주세요.", "", "info", "닫기");
          return false;
        }
        if (
          !pattern1.test(str) ||
          !pattern2.test(str) ||
          !pattern3.test(str) ||
          str.length < 8 ||
          str.length > 16
        ) {
          $("#pwd_val").addClass("border_validate_err");
          sweetalert(
            "8~16자 영문 대 소문자, 숫자\n 특수문자를 사용하세요",
            "",
            "info",
            "닫기"
          );
          return false;
        }
      }
      $("#pwd_val").removeClass("border_validate_err");

      if (pwd_cnf_val_checker === "") {
        $("#pwd_cnf_val").addClass("border_validate_err");
        sweetalert("비밀번호 확인을 입력해주세요.", "", "info", "닫기");
        return false;
      }

      if (pwd_val_checker !== pwd_cnf_val_checker) {
        $("#pwd_val").addClass("border_validate_err");
        $("#pwd_cnf_val").addClass("border_validate_err");
        sweetalert("비밀번호가 일치하지 않습니다.", "", "info", "닫기");
        return false;
      }
      $("#pwd_cnf_val").removeClass("border_validate_err");
      return true;
    };

    if (fnValidate()) {
      let jsonstr = $("form[name='frm']").serialize();
      jsonstr = decodeURIComponent(jsonstr);
      let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, "");
      Json_form =
        '{"' + Json_form.replace(/\&/g, '","').replace(/=/gi, '":"') + '"}';

      try {
        const response = await fetch("/api/register?type=pwdmodify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });
        const body = await response.text();
        console.log(body);
        if (body === "succ") {
          sweetalertSucc("비밀번호 수정이 완료되었습니다.", false);
          const timer = setTimeout(() => {
            history("/");
          }, 1500);
          return () => clearTimeout(timer);
        } else {
          sweetalert("작업중 오류가 발생하였습니다.(1)", "", "error", "닫기");
        }
      } catch (error) {
        sweetalert("작업중 오류가 발생하였습니다.(2)", error, "error", "닫기");
      }
    }
  };

  const sweetalert = (title, contents, icon, confirmButtonText) => {
    Swal.fire({
      title: title,
      text: contents,
      icon: icon,
      confirmButtonText: confirmButtonText,
    });
  };

  const sweetalertSucc = (title, showConfirmButton) => {
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: title,
      showConfirmButton: showConfirmButton,
      timer: 1000,
    });
  };
  return (
    <section className="main">
      <div className="m_login">
        <h3 className="pw_ls">
          비밀번호 재설정 <span className="compl1">완료</span>
        </h3>
        <form method="post" name="frm" action="">
          <input
            type="hidden"
            id="is_Useremail"
            name="is_Useremail"
            value={email}
          />
          <div className="log_box">
            <div className="in_ty1">
              <span className="ic_2">
                <img src={require("../img/main/m_log_i2.png")} alt="" />
              </span>
              <input
                type="password"
                id="pwd_val"
                name="is_Password"
                placeholder="새 비밀번호"
              />
            </div>
            <div className="in_ty1">
              <span className="ic_2">
                <img src={require("../img/main/m_log_i2.png")} alt="" />
              </span>
              <input
                type="password"
                id="pwd_cnf_val"
                name="is_Password"
                placeholder="새 비밀번호 확인"
              />
            </div>
            <div className="btn_confirm btn_confirm_m">
              <Link to={"/"}>
                <div className="bt_ty bt_ty_m bt_ty1 cancel_ty1">취소</div>
              </Link>
              <button
                type="button"
                className="bt_ty bt_ty_m bt_ty2 submit_ty1"
                onClick={(e) => submitClick(e)}
              >
                재설정
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
