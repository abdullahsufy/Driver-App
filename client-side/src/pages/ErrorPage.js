import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  const errormessage = useSelector((state) => state.user.errormessage);
  const errorsource = useSelector((state) => state.user.errorsource);

  const navigateToLogin = () => {
    if (errorsource === "user") {
      navigate("/");
    } else if (errorsource === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="container d-flex flex-column justify-content-center align-items-center h-100 text-danger">
        <p className="display-1 fw-bold">401</p>
        <p className="display-4 fw-bold">{errormessage}</p>
        <button className="btn btn-primary px-3 py-2 border-0" onClick={navigateToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
}
