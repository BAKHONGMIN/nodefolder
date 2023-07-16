import React, { Component } from 'react';
import { Route, Routes } from "react-router-dom";

// css
import '../css/new.css';

// header
import HeaderAdmin from './Header/Header admin';

// footer
import Footer from './Footer/Footer';

// login
import LoginForm from './LoginForm';

import ReactProxy from './R109_reactProxy';

class App extends Component {
  render () {
    return (
      <div className="App">
        <HeaderAdmin/> 
        <Routes>
          <Route exact path='/' element={<LoginForm />} />
          <Route exact path='/reactProxy' element={<ReactProxy />} />
        </Routes>
        <Footer/>
      </div>
    );
  }
}

export default App;