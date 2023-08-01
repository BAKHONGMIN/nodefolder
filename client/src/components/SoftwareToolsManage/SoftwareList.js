import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function SoftwareList() {
  const [responseSwtoolList, setResponseSwtoolList] = useState([]);

  useEffect(() => {
    callSwToolListApi();
  }, []);

  const callSwToolListApi = async () => {
    try {
      const response = await axios.post("/api/Swtool?type=list", {});
      setResponseSwtoolList(response.data.json);
    } catch (error) {
      alert("작업중 오류가 발생하였습니다.");
    }
  };

  const SwToolListAppend = () => {
    return responseSwtoolList.map((data) => {
      const date = data.reg_date;
      const reg_date = `${date.substr(0, 4)}.${date.substr(4, 2)}.${date.substr(
        6,
        2
      )}`;

      return (
        <tbody key={data.swt_code}>
          <tr className="hidden_type">
            <td>{data.swt_toolname}</td>
            <td>{data.swt_function}</td>
            <td>{reg_date}</td>
            <td>
              <Link
                to={"/SoftwareView/" + data.swt_code}
                className="bt_c1 bt_c2 w50_b"
              >
                수정
              </Link>
              <button
                type="button"
                id={data.swt_code}
                className="bt_c1 w50_b"
                onClick={(e) => {
                  deleteSwtool(e);
                }}
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      );
    });
  };

  const deleteSwtool = async (e) => {
    const event_target = e.target;
    sweetalertDelete("정말 삭제하시겠습니까?", async () => {
      await axios
        .post("/api/Swtool?type=delete", {
          is_SwtCd: event_target.getAttribute("id"),
        })
        .then((response) => {
          callSwToolListApi();
        })
        .catch((error) => {
          alert("삭제중 오류가 발새했습니다.");
          return false;
        });
    });
  };

  const sweetalertDelete = (title, callbackFunc) => {
    Swal.fire({
      title: title,
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
    }).then((result) => {
      if (result.value) {
        Swal.fire("Deleted!", "삭제되었습니다.", "success");
      } else {
        return false;
      }
      callbackFunc();
    });
  };

  return (
    <section className="sub_wrap">
      <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
        <div className="li_top">
          <h2 className="s_tit1">Software Tools 목록</h2>
          <div className="li_top_sch af">
            <Link to={"/SoftwareView/register"} className="sch_bt2 wi_au">
              Tool 등록
            </Link>
          </div>
        </div>

        <div className="list_cont list_cont_admin">
          <table className="table_ty1 ad_tlist">
            <thead>
              <tr>
                <th>툴 이름</th>
                <th>기능</th>
                <th>등록일</th>
                <th>기능</th>
              </tr>
            </thead>
          </table>
          <table className="table_ty2 ad_tlist">{SwToolListAppend()}</table>
        </div>
      </article>
    </section>
  );
}
