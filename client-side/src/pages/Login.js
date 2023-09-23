import { React } from "react";
import pic from "../pics/logo.jpeg";
import { login } from "../api/apis";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import loginSchema from "../schemas/loginSchema";
import { useFormik } from "formik";
import Input from "../components/Input";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const HandleLogin = async (e) => {
    e.preventDefault();
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

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
  });

  return (
    <div className="container-fluid my-5">
      <div className="container d-flex justify-content-center">
        <img src={pic} alt="..." />
      </div>
      <div className="container">
        <form onSubmit={HandleLogin}>
          <div>
            <label htmlFor="exampleInputEmail1" className="form-label border px-2 py-1">
              USERNAME
            </label>
            <Input
              type="text"
              value={values.username}
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.username && touched.username ? 1 : undefined}
              errormessage={errors.username}
            />
            <label htmlFor="exampleInputPassword1" className="form-label border px-2 py-1">
              PASSWORD
            </label>
            <Input
              type="password"
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              error={errors.password && touched.password ? 1 : undefined}
              errormessage={errors.password}
            />
          </div>
          <button type="submit" className="btn btn-primary fs-2" disabled={!values.username || !values.password || errors.username || errors.password}>
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
