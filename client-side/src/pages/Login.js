import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { login } from "../api/apis";
import loginSchema from "../schemas/loginSchema";
import { useFormik } from "formik";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { values, touched, handleBlur, handleChange, errors, isValid, dirty } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  const HandleLogin = async (e) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    const data = {
      username: values.username,
      password: values.password,
    };

    try {
      const response = await login(data);

      if (response.status === 200) {
        const user = {
          _id: response.data.user._id,
          username: response.data.user.username,
        };
        localStorage.setItem("auth-token", response.data.accessToken);
        dispatch(setUser(user));
        navigate(`/home/${user._id}`);
      } else {
        console.log(`Login failed with status: ${response.status}`);
      }
    } catch (error) {
      dispatch(setUser({ errormessage: "Invalid username or password", errorsource: "user" }));
      navigate("/error");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-wrapper">
        <span className="login-bg-animate"></span>
        <div className="login-form-box">
          <h2>LOGIN</h2>
          <form onSubmit={HandleLogin}>
            <div className="login-input-box">
              <input type="text" name="username" value={values.username} onChange={handleChange} onBlur={handleBlur} required />
              <label>Username</label>
              <i className="fa-solid fa-user"></i>
              {touched.username && errors.username && (
                <p className="text-danger text-end border-0 m-0 ">
                  <small>{errors.username}</small>
                </p>
              )}
            </div>
            <div className="login-input-box">
              <input type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} required />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
              {touched.password && errors.password && (
                <p className="text-danger text-end border-0 m-0 ">
                  <small>{errors.password}</small>
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!isValid || !dirty}
              className={`login-btn ${!errors.username && !errors.password && isValid && dirty ? "login-btn-hover" : ""}`}
            >
              Login
            </button>
          </form>
        </div>
        <div className="login-info-text">
          <h2>Welcome Back!</h2>
          <p>Our Beloved Drivers.</p>
        </div>
      </div>
    </div>
  );
}
