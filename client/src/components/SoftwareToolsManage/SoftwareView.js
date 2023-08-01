import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import $ from "jquery";
import Swal from "sweetalert2";
import axios from "axios";

export default function SoftwareView({ props }) {
  const params = useParams();

  const [before_swtcode, setBeforeSwtCode] = useState(params.swtcode);
  const [selectedFile, setSelectedFile] = useState(null);

  const [Swt_toolname_checker, setSwtToolnameChecker] = useState(null);
  const [Swt_demo_site_checker, setSwtDemoSiteChecker] = useState(null);
  const [Giturl_checker, setGiturlChecker] = useState(null);
  const [Comments_checker, setCommentsChecker] = useState(null);
  const [Swt_function_checker, setSwtFunctionChecker] = useState(null);
  const history = useNavigate();

  const [manualName, setManualName] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileName2, setFileName2] = useState(null);

  useEffect(() => {
    if (before_swtcode === "register") {
      $(".modifyclass").hide();
    } else {
      callSwToolInfoApi();
      $(".saveclass").hide();
    }
  }, []);

  const callSwToolInfoApi = () => {
    axios
      .post("/api/Swtool?type=list", {
        is_Swtcode: before_swtcode,
      })
      .then((response) => {
        try {
          const data = response.data.json[0];
          $("#is_Swt_toolname").val(data.swt_toolname);
          $("#is_Swt_demo_site").val(data.swt_demo_site);
          $("#is_Giturl").val(data.swt_github_url);
          $("#is_Comments").val(data.swt_comments);
          $("#is_Swt_function").val(data.swt_function);

          setManualName(data.swt_manual_path.replace("/swmanual/", ""));
          setFileName(data.swt_big_imgpath.replace("/image/", ""));
          setFileName2(data.swt_imagepath.replace("/image/", ""));

          $("#upload_img").prepend(
            '<img id="uploadimg" src="' + data.swt_big_imgpath + '"/>'
          );

          $("#upload_img2").prepend(
            '<img id="uploadimg2" src="' + data.swt_imagepath + '"/>'
          );

          $("#imagefile").val(fileName);
          $("#imagefile2").val(fileName2);
          $("#manualfile").val(manualName);

          if ($("#uploadimg").attr("src").indexOf("null") > -1) {
            $("#uploadimg").hide();
          }

          if ($("#uploadimg2").attr("src").indexOf("null") > -1) {
            $("#uploadimg2").hide();
          }
        } catch (error) {
          alert("작업중 에러가 발생했습니다.");
        }
      })
      .catch((error) => {
        alert("작업 중 에러가 발생했습니다.");
        return false;
      });
  };

  const submitClick = (type, e) => {
    e.preventDefault();
    setSwtToolnameChecker($("#is_Swt_toolname").val());
    setSwtDemoSiteChecker($("#is_Swt_demo_site").val());
    setGiturlChecker($("#is_Giturl").val());
    setCommentsChecker($("#is_Comments").val());
    setSwtFunctionChecker($("#is_Swt_function").val());
    const fnValidate = (e) => {
      if (Swt_toolname_checker === "") {
        $("#is_Swt_toolname").addClass("border_validate_err");
        alert("툴 이름을 다시 확인해주세요.");
        return false;
      }
      $("#is_Swt_toolname").removeClass("border_validate_err");
      if (Swt_demo_site_checker === "") {
        $("#is_Swt_demo_site").addClass("border_validate_err");
        alert("데모 URL을 다시 확인해주세요.");
        return false;
      }
      $("#is_Swt_demo_site").removeClass("border_validate_err");
      if (Giturl_checker === "") {
        $("#is_Giturl").addClass("border_validate_err");
        alert("Github URL을 다시 확인해주세요.");
        return false;
      }
      $("#is_Giturl").removeClass("border_validate_err");
      if (Comments_checker === "") {
        $("#is_Comments").addClass("border_validate_err");
        alert("설명을 다시 확인해주세요.");
        return false;
      }
      $("#is_Comments").removeClass("border_validate_err");
      if (Swt_function_checker === "") {
        $("#is_Swt_function").addClass("border_validate_err");
        alert("상세기능을 다시 확인해주세요.");
        return false;
      }
      $("#is_Swt_function").removeClass("border_validate_err");
      return true;
    };
    if (fnValidate()) {
      let jsonstr = $("form[name='frm']").serialize();
      jsonstr = decodeURIComponent(jsonstr);
      let Json_form = JSON.stringify(jsonstr).replace(/\"/gi, "");
      Json_form =
        '{"' + Json_form.replace(/\&/g, '","').replace(/=/gi, '":"') + '"}';
      try {
        const response = fetch("/api/Swtool?type=" + type, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: Json_form,
        });
        const body = response.text();
        if (body === "succ") {
          if (type === "save") {
            sweetalertSucc("Software Tools 등록이 완료되었습니다.", false);
          } else if (type === "modify") {
            sweetalertSucc("Software Tools 수정이 완료됐습니다.", false);
          }

          const timeout = setTimeout(() => {
            history("/SoftwareList");
          }, 1500);
          return () => clearTimeout(timeout);
        } else {
          alert("2단계에서 오류가 발생하였습니다.");
        }
      } catch (error) {
        alert("1단계에서 오류가 발생하였습니다.");
      }
    }
  };

  const sweetalertSucc = (title, showConfirmButton) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: title,
      showConfirmButton: showConfirmButton,
      timer: 1000,
    });
  };

  const handleFileInput = (type, e) => {
    if (type === "file") {
      $("#imagefile").val(e.target.files[0].name);
    } else if (type === "file2") {
      $("#imagefile2").val(e.target.files[0].name);
    } else if (type === "manual") {
      $("#manualfile").val(e.target.files[0].name);
    }

    setSelectedFile(e.target.files[0]);

    const timeout = setTimeout(() => {
      if (type === "manual") {
        handlePostManual();
      } else {
        handlePostImage(type);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  };

  const handlePostManual = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    return axios
      .post("/api/upload?type=uploads/swmanual/", formData)
      .then((res) => {
        setManualName(res.data.filename);
        $("#is_ManualName").remove();
        $("#upload_manual").prepend(
          '<input id="is_ManualName" type="hidden"' +
            'name="is_ManualName" value="/swmanual/' +
            manualName +
            '"}/>'
        );
      })
      .catch((error) => {
        alert("작업중 오류가 발생하였습니다.", error, "error", "닫기");
      });
  };

  const handlePostImage = (type) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    return axios
      .post("/api/upload?type=uploads/image/", formData)
      .then((res) => {
        if (type === "file") {
          setFileName(res.data.filename);
          $("#is_MainImg").remove();
          $("#uploadimg").remove();
          $("#upload_img").prepend(
            '<img id="uploadimg" src="/image/' + fileName + '"/>'
          );
          $("#upload_img").prepend(
            '<input id="is_MainImg" type="hidden"' +
              'name="is_MainImg" value="/image/' +
              fileName +
              '"}/>'
          );
        } else if (type === "file2") {
          setFileName2(res.data.filename);
          $("#is_LabelImg").remove();
          $("#uploadimg2").remove();
          $("#upload_img2").prepend(
            '<img id="uploadimg2" src="/image/' + fileName2 + '"/>'
          );
          $("#upload_img2").prepend(
            '<input id="is_LabelImg" type="hidden"' +
              'name="is_LabelImg" value="/image/' +
              fileName2 +
              '"}/>'
          );
        }
      })
      .catch((error) => {
        alert("작업중 오류가 발생하였습니다.");
      });
  };

  return (
    <section className="sub_wrap">
      <article className="s_cnt mp_pro_li ct1">
        <div className="li_top">
          <h2 className="s_tit1">Software Tools 등록/수정</h2>
        </div>
        <div className="bo_w re1_wrap re1_wrap_writer">
          <form name="frm" id="frm" action="" method="post">
            <input id="is_Swtcode" type="hidden" name="is_Swtcode" />
            <input id="is_Email" type="hidden" name="is_Email" value="guest" />
            <input
              id="is_beforeSwtcode"
              type="hidden"
              name="is_beforeSwtcode"
              value={before_swtcode}
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
                        <label htmlFor="is_Swt_toolname">
                          툴 이름<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <input
                          type="text"
                          name="is_Swt_toolname"
                          id="is_Swt_toolname"
                          className=""
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="is_Swt_demo_site">
                          데모 URL<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <input
                          type="text"
                          name="is_Swt_demo_site"
                          id="is_Swt_demo_site"
                          className=""
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="is_Giturl">
                          Github URL<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <input
                          type="text"
                          name="is_Giturl"
                          id="is_Giturl"
                          className=""
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="is_Comments">
                          설명<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <textarea
                          name="is_Comments"
                          id="is_Comments"
                          rows=""
                          cols=""
                        ></textarea>
                      </td>
                    </tr>
                    <tr className="div_tb_tr fileb">
                      <th>메뉴얼 파일 #1</th>
                      <td className="fileBox fileBox_w1">
                        <label htmlFor="uploadBtn1" className="btn_file">
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
                          id="uploadBtn1"
                          className="uploadBtn uploadBtn1"
                          onChange={(e) => handleFileInput("manual", e)}
                        />
                        <div id="upload_manual"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>메인 이미지</th>
                      <td className="fileBox fileBox1">
                        <label htmlFor="imageSelect" className="btn_file">
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
                          id="imageSelect"
                          className="uploadBtn uploadBtn1"
                          onChange={(e) => handleFileInput("file", e)}
                        />
                        <div id="upload_img"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>라벨 이미지</th>
                      <td className="fileBox fileBox2">
                        <label htmlFor="imageSelect2" className="btn_file">
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
                          id="imageSelect2"
                          className="uploadBtn uploadBtn1"
                          onChange={(e) => handleFileInput("file2", e)}
                        />
                        <div id="upload_img2"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <label htmlFor="is_Swt_function">
                          상세 기능<span className="red">(*)</span>
                        </label>
                      </th>
                      <td>
                        <textarea
                          name="is_Swt_function"
                          id="is_Swt_function"
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
                    type="submit"
                    className="bt_ty bt_ty2 submit_ty1 saveclass"
                    onClick={(e) => submitClick("save", e)}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className="bt_ty bt_ty2 submit_ty1 modifyclass"
                    onClick={(e) => submitClick("modify", e)}
                  >
                    수정
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
