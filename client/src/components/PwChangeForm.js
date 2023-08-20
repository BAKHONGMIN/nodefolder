import axios from "axios";
import { response } from "express";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function PwChangeForm() {
  const params = useParams();

  const email = params.email;
  const token = params.token;

  const history = useNavigate();

  useEffect(() => {
    let token = token.replace(/가/gi, "/");

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
      .catch((error) => {});
  });
}

const sweetalert = (title, contents, icon, confirmButtonText) => {
  Swal.fire({
    title: title,
    text: contents,
    icon: icon,
    confirmButtonText: confirmButtonText,
  });
  return <div></div>;
};
