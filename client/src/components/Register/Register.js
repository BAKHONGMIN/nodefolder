import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import $ from "jquery";

export default function Register() {
  const submitClick = async (type, e) => {
    const email_val_checker = $("#email_val").val();
    const email2_val_checker = $("#email2_val").val();
    const pwd_val_checker = $("#pwd_val").val();
    const pwd_cnf_val_checker = $("#pwd_cnf_val").val();
    const name_val_checker = $("#name_val").val();
    const org_val_checker = $("#org_val").val();
    const major_val_checker = $("#major_val");
    const phone1_val_checker = $("#phone1_val").val();
    const phone2_val_checker = $("#phone2_val").val();
    const phone3_val_checker = $("#phone3_val").val();

    const fnValidate = (e) => {
      const pattern1 = /[0-9]/;
      const pattern2 = /[a-zA-Z]/;
      const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

      if (email_val_checker === "") {
        $("#email_val").addClass("border_validate_err");
        sweetalert("이메일 주소를 다시 확인해주세요.", "", "info", "닫기");
      }

      if (email_val_checker.search(/\s/) !== -1) {
        $("#email_val").addClass("border_validate_err");
        sweetalert("이메일 공백을 제거해 주세요.", "", "info", "닫기");
        return false;
      }
      $("email_val").removeClass("border_validate_err");

      if (email2_val_checker === "") {
        $("#email2_val").addClass("border_validate_err");
        sweetalert("이메일 주소를 다시 확인해주세요.", "", "info", "닫기");
        return false;
      }
      $("#email2_val").removeClass("border_validate_err");

      if (pwd_val_checker === "") {
        $("#pwd_val").addClass("border_validate_err");
        sweetalert("비밀번호를 입력해주세요", "", "info", "닫기");
        return false;
      }
      if (pwd_val_checker !== "") {
        const str = pwd_val_checker;
        if (str.search(/\s/) !== -1) {
          $("#pwd_val").addClass("border_vaildate_err");
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
            "8 ~ 16자 영문 대 소문자\n숫자, 특수문자를 사용하세요.",
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
    };
  };

  const emailKeyPress = () => {};

  const pwdKeyPress = () => {};

  const pwdCnfKeyPress = () => {};

  const nameKeyPress = () => {};

  const mustNumber = () => {};

  const sweetalert = (title, contents, icon, confirmButtonText) => {
    Swal.fire({
      title: title,
      text: contents,
      icon: icon,
      confirmButtonText: confirmButtonText,
    });
  };

  return (
    <div>
      <section className="sub_wrap">
        <article className="s_cnt re_1 ct1">
          <div className="li_top">
            <h2 className="s_tit1">회원가입</h2>
            <form method="post" name="frm">
              <div className="re1_wrap">
                <div className="re_cnt ct2">
                  <table className="table_ty1">
                    <tbody>
                      <tr className="re_email">
                        <th>이메일</th>
                        <td>
                          <input
                            id="email_val"
                            type="text"
                            name="is_Useremail1"
                            placeholder="이메일을 입력해주세요."
                            onKeyPress={(e) => emailKeyPress}
                          />
                          <span className="e_goll">@</span>
                          <select
                            id="email2_val"
                            name="is_Useremail2"
                            className="select_ty1"
                          >
                            <option value="">선택하세요.</option>
                            <option value="naver.com">naver.com</option>
                            <option value="hanmail.net">hanmail.net</option>
                            <option value="nate.com">nate.com</option>
                            <option value="hotmail.com">hotmail.com</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="yahoo.co.kr">yahoo.co.kr</option>
                            <option value="yahoo.com">yahoo.com</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th>비밀번호</th>
                        <td>
                          <input
                            id="pwd_val"
                            type="password"
                            name="is_Password"
                            placeholder="비밀번호를 입력해주세요."
                            onKeyPress={(e) => pwdKeyPress}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>비밀번호 확인</th>
                        <td>
                          <input
                            id="pwd_cnf_val"
                            type="password"
                            name="is_Password"
                            placeholder="비밀번호를 다시 입력해주세요."
                            onKeyPress={(e) => pwdCnfKeyPress}
                          ></input>
                        </td>
                      </tr>
                      <tr>
                        <th>성명</th>
                        <td>
                          <input
                            id="name_val"
                            type="text"
                            name="is_Username"
                            placeholder="성명을 입력해주세요."
                            onKeyPress={(e) => nameKeyPress}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>전공</th>
                        <td>
                          <input
                            id="major_val"
                            type="text"
                            name="is_Usermajor"
                            placeholder="전공을 입력하세요."
                          />
                        </td>
                      </tr>
                      <tr>
                        <th>핸드폰</th>
                        <td>
                          <select
                            id="phone1_val"
                            name="is_Userphone1"
                            className="select_ty1"
                          >
                            <option value="" 선택></option>
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="017">017</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                          </select>
                          <span className="tel_dot">-</span>
                          <input
                            id="phone2_val"
                            name="is_Userphone2"
                            max="9999"
                            maxLength="4"
                            onChange={(e) => {
                              mustNumber("phone2_val");
                            }}
                          />
                          <span className="tel_dot">-</span>
                          <input
                            id="phone3_val"
                            name="is_Userphone3"
                            max="9999"
                            maxLength="4"
                            onChange={(e) => {
                              mustNumber("phone3_val");
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="btn_confirm">
                <div
                  className="bt_ty bt_ty2 submit_ty1"
                  onClick={(e) => submitClick("signup", e)}
                >
                  회원가입
                </div>
              </div>
            </form>
          </div>
        </article>
      </section>
    </div>
  );
}
