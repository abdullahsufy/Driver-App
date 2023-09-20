import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


export default function ErrorPage() {
  const navigate = useNavigate();
  const errormessage = useSelector((state) => state.user.errormessage);

  return (
    <div className="container-fluid vh-100">
      <div className="container d-flex flex-column justify-content-center align-items-center h-100 text-danger">
        <p className="display-1 fw-bold">401</p>
        <p className="display-4 fw-bold">{errormessage}</p>
        <button onClick={() => navigate("/")} className="btn-primary rounded border-0 px-3 py-2 mt-3">
          Go Back to Login
        </button>
      </div>
    </div>
  );
}
