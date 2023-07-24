import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import $ from "jquery";

export default function SoftwareView() {
  const toolName = useRef("");
  const demoSite = useRef("");
  const gitUrl = useRef("");
  const comments = useRef("");
  const functions = useRef("");

  const history = useNavigate();

  const submitClick = async (type, e) => {
    if (toolName.current.value === "") {
      document
        .getElementById("swt_toolname")
        .classList.add("border_validate_err");
      alert("롤 이름을 다시 확인해주세요.");
      return false;
    } else {
      document
        .getElementById("swt_toolname")
        .classList.remove("border_validate_err");
    }

    if (demoSite.current.value === "") {
      document
        .getElementById("swt_demo_site")
        .classList.add("border_validate_err");
      alert("데모 URL을 다시 확인해주세요.");
      return false;
    } else {
      document
        .getElementById("swt_demo_site")
        .classList.remove("border_validate_err");
    }

    if (gitUrl.current.value === "") {
      document
        .getElementById("swt_github_url")
        .classList.add("border_validate_err");
      alert("Github URL을 다시 확인해주세요.");
      return false;
    } else {
      document
        .getElementById("swt_github_url")
        .classList.remove("border_validate_err");
    }

    if (comments.current.value === "") {
      document
        .getElementById("swt_comments")
        .classList.add("border_validate_err");
      alert("설명을 다시 확인해주세요.");
      return false;
    } else {
      document
        .getElementById("swt_comments")
        .classList.remove("border_validate_err");
    }

    if (functions.current.value === "") {
      document
        .getElementById("swt_function")
        .classList.add("border_validate_err");
      alert("상세기능을 다시 확인해주세요.");
      return false;
    } else {
      document
        .getElementById("swt_function")
        .classList.remove("border_validate_err");
    }

    let jsonstr = $("form[name='frm']").serialize();

    jsonstr = decodeURIComponent(jsonstr);
    // eslint-disable-next-line no-useless-escape
    let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, "");
    Json_form =
      // eslint-disable-next-line no-useless-escape
      '{"' + Json_form.replace(/\&/g, '","').replace(/=/gi, '":"') + '"}';

    try {
      const response = await fetch("/api/Swtool?type=" + type, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: Json_form
      });

      const body = await response.text();

      if (body === "succ") {
        if (type === "save") {
          sweetalertSucc("Software Tools 등록이 완료되었습니다.", false);
        }
        const timer = setTimeout(function () {
          // Replace this with appropriate navigation logic
          history("/SoftwareList");
        }, 1500);

        return () => clearTimeout(timer);
      } else {
        alert("작업중 오류가 발생하였습니다.");
      }
    } catch (error) {
      alert(error + "작업중 오류가 발생하였습니다.");
    }
  };

  const sweetalertSucc = (title, showConfirmButton) => {
    Swal.fire({
      position: "bottom-end",
      icon: "success",
      title: title,
      showConfirmButton: showConfirmButton,
      timer: 1000
    });
  };

  return (
    <section className="sub_wrap">
      <article className="s_cnt mp_pro_li ct1">
        <div className="li_top">
          <h2 className="s_tit1">Software Tools 등록/수정</h2>
        </div>
        <div className="bo_w re1_wrap re1_wrap_writer">
          <form
            name="frm"
            id="frm"
            action=""
            onSubmit={(e) => submitClick("save", e)}
            method="post"
          >
            <input
              id="swt_code"
              // type="hidden"
              type="texts"
              name="swt_code"
            />
            <article className="res_w">
              <p className="ment" style={{ textAlign: "right" }}>
                <span className="red">(*)</span>표시는 필수입력사항 입니다.
              </p>
              <div className="tb_outline">
                <table className="table_ty1">
                  <tbody>
                    <tr>
                      <th>
                        <label htmlFor="swt_toolname">
                          툴 이름<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <input
                          ref={toolName}
                          type="text"
                          name="swt_toolname"
                          id="swt_toolname"
                          className=""
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="swt_demo_site">
                          데모 URL<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <input
                          ref={demoSite}
                          type="text"
                          name="swt_demo_site"
                          id="swt_demo_site"
                          className=""
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="swt_github_url">
                          Github URL<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <input
                          ref={gitUrl}
                          type="text"
                          name="swt_github_url"
                          id="swt_github_url"
                          className=""
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="swt_comments">
                          설명<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <textarea
                          ref={comments}
                          name="swt_comments"
                          id="swt_comments"
                          rows=""
                          cols=""
                        ></textarea>
                      </td>
                    </tr>
                    <tr className="div_tb_tr fileb">
                      <th>메뉴얼 파일 #1</th>
                      <td className="fileBox fileBox_w1">
                        <label htmlFor="swt_manual_path" className="btn_file">
                          파일선택
                        </label>
                        <input
                          type="text"
                          id="manualfile"
                          className="fileName fileName1"
                          readOnly="readonly"
                          placeholder="선택된 파일 없음"
                        />
                        <input
                          type="file"
                          id="swt_manual_path"
                          className="uploadBtn uploadBtn1"
                          onChange={(e) => this.handleFileInput("manual", e)}
                        />
                        <div id="upload_menual"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>메인 이미지</th>
                      <td className="fileBox fileBox1">
                        <label htmlFor="swt_big_imgpath" className="btn_file">
                          파일선택
                        </label>
                        <input
                          type="text"
                          id="imagefile"
                          className="fileName fileName1"
                          readOnly="readonly"
                          placeholder="선택된 파일 없음"
                        />
                        <input
                          type="file"
                          id="swt_big_imgpatht"
                          className="uploadBtn uploadBtn1"
                          onChange={(e) => this.handleFileInput("file", e)}
                        />
                        <div id="upload_img"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>라벨 이미지</th>
                      <td className="fileBox fileBox2">
                        <label htmlFor="swt_imagepath" className="btn_file">
                          파일선택
                        </label>
                        <input
                          type="text"
                          id="imagefile2"
                          className="fileName fileName1"
                          readOnly="readonly"
                          placeholder="선택된 파일 없음"
                        />
                        <input
                          type="file"
                          id="swt_imagepath"
                          className="uploadBtn uploadBtn1"
                          onChange={(e) => this.handleFileInput("file2", e)}
                        />
                        <div id="upload_img2"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="swt_function">
                          상세 기능<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <textarea
                          ref={functions}
                          name="swt_function"
                          id="swt_function"
                          rows=""
                          cols=""
                        ></textarea>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  className="btn_confirm mt20"
                  style={{ marginBottom: "44px" }}
                >
                  <Link
                    to={"/SoftwareList"}
                    className="bt_ty bt_ty1 cancel_ty1"
                  >
                    취소
                  </Link>
                  <button
                    type="button"
                    className="bt_ty bt_ty2 submit_ty1 saveclass"
                    onClick={(e) => submitClick("save", e)}
                  >
                    저장
                  </button>
                </div>
              </div>
            </article>
          </form>
        </div>
      </article>
    </section>
  );
}
