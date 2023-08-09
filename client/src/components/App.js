import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";

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

class App extends Component {
  render() {
    return (
      <div className="App">
        <HeaderAdmin />
        <Routes>
          <Route exact path="/" element={<LoginForm />} />
          <Route path="/SoftwareList" element={<SoftwareList />} />
          <Route path="/SoftwareView/:swtcode" element={<SoftwareView />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </div>
    );
  }
}

export default App;
