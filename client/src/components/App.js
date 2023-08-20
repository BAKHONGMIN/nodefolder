import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// css
import "../css/new.css";

// header
import HeaderAdmin from "./Header/Header admin";

// footer
import Footer from "./Footer/Footer";

// login
import LoginForm from "./LoginForm";

import SoftwareList from "./SoftwareToolsManage/SoftwareList";

import SoftwareView from "./SoftwareToolsManage/SoftwareView";

import Register from "./Register/Register";

export default function App() {
  const [state, setState] = useState({});
  const location = useLocation();
  const history = useNavigate();

  useEffect(() => {
    axios
      .post("/api/LoginForm?type=SessionConfirm", {
        token1: cookie.load("userid"),
        token2: cookie.load("username"),
      })
      .then((response) => {
        state.userid = response.data.token1;
        const password = cookie.load("userpassword");
        if (password !== undefined) {
          axios
            .post("/api/LoginForm?type=SessionSignin", {
              is_Email: state.userid,
              is_Token: password,
            })
            .then((response) => {
              console.log(response);
              if (response.data.json[0].useremail === undefined) {
                noPermission();
              }
            })
            .catch((error) => {
              noPermission();
            });
        } else {
          noPermission();
        }
      })
      .catch((response) => {
        noPermission();
      });
    console.log(location);
    const noPermission = () => {
      if (location.hash !== "#nocookie" && location.pathname !== "/register") {
        remove_cookie();
        history("/login/#nocookie");
      }
    };

    const remove_cookie = () => {
      cookie.remove("userid", { path: "/" });
      cookie.remove("username", { path: "/" });
      cookie.remove("userpassword", { path: "/" });
    };
  }, [state, location, history]);

  return (
    <div className="App">
      <HeaderAdmin />
      <Routes>
        <Route exact path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/SoftwareList" element={<SoftwareList />} />
        <Route path="/SoftwareView/:swtcode" element={<SoftwareView />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
}
