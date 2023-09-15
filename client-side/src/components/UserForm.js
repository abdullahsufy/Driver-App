import React from "react";
import { useFormik } from "formik";
import createUserSchema from "../schemas/createUserSchema";
import Input from "../components/Input";

export default function UserForm({ onSubmit, inputList, edit = false }) {
  const initialFieldValues = {};

  inputList.forEach((e) => {
    initialFieldValues[e.name] = e.value;
  });

  const { values, touched, handleBlur, handleChange, errors, handleSubmit } = useFormik({
    initialValues: initialFieldValues,
    validationSchema: createUserSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  function Capitalize(str) {
    if (typeof str !== "string" || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div>
          {inputList.map((e) => (
            <React.Fragment key={e.name}>
              <label htmlFor={e.name} className={`form-label ${edit ? "text-light" : ""}`}>
                {edit && e.name === "password" ? "Enter New Password" : e.name === "confirmPassword" ? "Confirm Password" : Capitalize(e.name)}
              </label>
              <Input
                type={e.type}
                name={e.name}
                value={values[e.name]}
                onChange={(e) => {
                  handleChange(e);
                  if (edit) {
                    onSubmit({
                      ...values,
                      [e.target.name]: e.target.value,
                    });
                  }
                }}
                onBlur={handleBlur}
                error={errors[e.name] && touched[e.name] ? 1 : undefined}
                errormessage={errors[e.name]}
              />
            </React.Fragment>
          ))}
        </div>
        {!edit && (
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary m-2"
              disabled={
                !values.name ||
                !values.username ||
                !values.email ||
                !values.password ||
                !values.confirmPassword ||
                errors.name ||
                errors.username ||
                errors.email ||
                errors.password ||
                errors.confirmPassword
              }
            >
              Register
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
