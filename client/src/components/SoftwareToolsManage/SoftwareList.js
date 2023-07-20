import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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

  console.log(responseSwtoolList);

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
                to={"/AdminSoftwareView/" + data.swt_code}
                className="bt_c1 bt_c2 w50_b"
              >
                수정
              </Link>
              <a href="#n" className="bt_c1 w50_b">
                삭제
              </a>
            </td>
          </tr>
        </tbody>
      );
    });
  };

  console.log(SwToolListAppend);

  return (
    <section className="sub_wrap">
      <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
        <div className="li_top">
          <h2 className="s_tit1">Software Tools 목록</h2>
          <div className="li_top_sch af">
            <Link to={"/AdminSoftwareView/register"} className="sch_bt2 wi_au">
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
          <div>{console.log(1)}</div>
        </div>
      </article>
    </section>
  );
}
