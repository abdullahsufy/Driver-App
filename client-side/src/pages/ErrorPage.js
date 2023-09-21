import React from "react";
import { useSelector } from "react-redux";

export default function ErrorPage() {
  const errormessage = useSelector((state) => state.user.errormessage);

  return (
    <div className="container-fluid vh-100">
      <div className="container d-flex flex-column justify-content-center align-items-center h-100 text-danger">
        <p className="display-1 fw-bold">401</p>
        <p className="display-4 fw-bold">{errormessage}</p>
      </div>
    </div>
  );
}
