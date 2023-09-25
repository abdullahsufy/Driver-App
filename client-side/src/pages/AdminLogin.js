import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginSchema from "../schemas/loginSchema";
import { useFormik } from "formik";
import Input from "../components/Input";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { adminLogin } from "../api/apis";

export default function AdminLogin() {
  const dispatch = useDispatch();

  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.backgroundColor = "#084c61";
    return () => {
      document.body.style.backgroundColor = "white";
    };
    // eslint-disable-next-line
  }, []);

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  const HandleLogin = async (e) => {
    e.preventDefault();
    const data = {
      username: values.username,
      password: values.password,
    };

    try {
      const response = await adminLogin(data);
      if (response.status === 200) {
        localStorage.setItem("admin-token", response.data.adminToken);
        const { id } = response.data.admin;
        navigate(`/admin/panel/${id}`);
      } else {
        console.log(`Login failed with status: ${response.status}`);
      }
    } catch (error) {
      dispatch(setUser({ errormessage: "Invalid username or password", errorsource: "admin" }));
      navigate("/error");
    }
  };

  const handleInputChange = (e) => {
    handleChange(e);
    setDisabled(!values.username || !values.password || errors.username || errors.password);
  };
  return (
    <div className="container-fluid vh-100">
      <div className="container d-flex flex-column justify-content-center align-items-center h-100 text-light">
        <div>
          <label htmlFor="exampleInputEmail1" className="form-label px-2 py-1">
            USERNAME
          </label>
          <Input
            type="text"
            value={values.username}
            name="username"
            onBlur={handleBlur}
            onChange={handleInputChange}
            error={errors.username && touched.username ? 1 : undefined}
            errormessage={errors.username}
          />
          <label htmlFor="exampleInputPassword1" className="form-label px-2 py-1">
            PASSWORD
          </label>
          <Input
            type="password"
            value={values.password}
            name="password"
            onBlur={handleBlur}
            onChange={handleInputChange}
            error={errors.password && touched.password ? 1 : undefined}
            errormessage={errors.password}
          />
        </div>
        <button
          onClick={HandleLogin}
          className={`${disabled ? "btn-background-color " : "btn-light"} rounded border-1 border-light px-3 py-2 mt-3 fs-4 fw-bold`}
          disabled={disabled}
        >
          Login
        </button>
      </div>
    </div>
  );
}
