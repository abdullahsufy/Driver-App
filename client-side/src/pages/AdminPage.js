import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { gettAllUsers, register, deleteUser, updateAdminPassword } from "../api/apis";
import UserForm from "../components/UserForm";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../components/Table";
import Loader from "../components/Loader";
import ModalPopup from "../components/ModalPopup";
import { useDispatch } from "react-redux";
import { setUser, resetUser } from "../store/userSlice";
import { useFormik } from "formik";
import createUserSchema from "../schemas/createUserSchema";
import Input from "../components/Input";

export default function AdminPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalUse, setModalUse] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    getUsers();

    // eslint-disable-next-line
  }, []);

  const getUsers = async () => {
    try {
      const response = await gettAllUsers();
      if (response.status === 200) {
        const users = response.data.users;
        setData(users);
      }
    } catch (error) {
      dispatch(setUser({ errormessage: "Please authenticate using a valid token", errorsource: "admin" }));
      navigate("/error");
    }
  };

  const handleUserRegistration = async (newUser) => {
    try {
      const response = await register(newUser);
      if (response.status === 201) {
        const user = response.data.user;
        let newData = [...data, user];
        setData(newData);
      }
    } catch (error) {
      dispatch(setUser({ errormessage: "Please authenticate using a valid token", errorsource: "admin" }));
      navigate("/error");
    }
    setShowModal(false);
  };

  const UpdateAdminPassword = async () => {
    if (values.password !== "") {
      const data = {
        id,
        password: values.password,
      };
      try {
        const response = await updateAdminPassword(data);
        if (response.status === 200) {
          setModalUse("updatedsucessfully");
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
          }, 1000);
        }
      } catch (error) {
        dispatch(setUser({ errormessage: "Please authenticate using a valid token", errorsource: "admin" }));
        navigate("/error");
      }
    }
  };

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: createUserSchema,
  });

  const HandleDelete = async () => {
    const id = deleteUserId;
    try {
      const response = await deleteUser(id);
      if (response.status === 200) {
        const newData = data.filter((user) => user._id !== id);
        setData(newData);
      }
    } catch (error) {
      dispatch(setUser({ errormessage: "Please authenticate using a valid token", errorsource: "admin" }));
      navigate("/error");
    }
  };

  const ResetFunction = () => {
    dispatch(resetUser);
    localStorage.removeItem("admin-token");
    navigate("/admin");
  };
  const headers = ["name", "username", "email", "operations"];
  const inputList = [
    { name: "name", type: "text", value: "" },
    { name: "username", type: "text", value: "" },
    { name: "email", type: "email", value: "" },
    { name: "password", type: "password", value: "" },
    { name: "confirmPassword", type: "password", value: "" },
  ];

  if (!data) {
    return <Loader text="Details" color="#ffffff" size="120" />;
  }

  return (
    <div className="container-fluid">
      <div className="container mt-5">
        <div className="col-12 mb-5 d-flex justify-content-between align-items-center">
          <p className="text-light fs-2">ADMIN PANEL</p>
          <div>
            <button
              className="btn btn-danger px-2 py-0 border-0 rounded"
              onClick={() => {
                setModalUse("editadminpassword");
                setShowModal(true);
              }}
              style={{ height: "50px" }}
            >
              Update Admin Password
            </button>
            <button className="btn btn-danger px-3 py-0 border-0 rounded ms-3" onClick={ResetFunction} style={{ height: "50px" }}>
              Logout
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <Button
            className="btn-primary border-0"
            onClick={() => {
              setShowModal(true);
              setModalUse("adduser");
            }}
          >
            Add User
          </Button>
        </div>
        <div className="row mt-3">
          {data.length ? (
            <Table
              data={data}
              id={id}
              headers={headers}
              HandleDelete={(id) => {
                setShowModal(true);
                setModalUse("deleteuser");
                setDeleteUserId(id);
              }}
            />
          ) : (
            <h2 className="text-light text-center mt-5">No users to show</h2>
          )}
        </div>
        <ModalPopup
          showModal={showModal}
          setShowModal={setShowModal}
          closeBtn={modalUse === "deleteuser" ? false : true}
          title={
            modalUse === "adduser"
              ? "Create a User"
              : modalUse === "deleteuser"
              ? "Do you really want to delete this user ?"
              : modalUse === "editadminpassword"
              ? "Enter New Password"
              : modalUse === "updatedsucessfully"
              ? "Updated Sucessfully!"
              : null
          }
        >
          {modalUse === "adduser" ? (
            <div>
              <UserForm onSubmit={handleUserRegistration} inputList={inputList} />
            </div>
          ) : modalUse === "deleteuser" ? (
            <div className="col-12 d-flex justify-content-end">
              <button className="btn-danger px-3 py-2 m-2 border-0 rounded" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn-success px-3 py-2 m-2 border-0 rounded"
                onClick={() => {
                  HandleDelete();
                  setShowModal(false);
                }}
              >
                Delete
              </button>
            </div>
          ) : modalUse === "editadminpassword" ? (
            <div>
              <Input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password && touched.password ? 1 : undefined}
                errormessage={errors.password}
              />
              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary border-0 px-3 py-2" onClick={UpdateAdminPassword}>
                  Update
                </button>
              </div>
            </div>
          ) : null}
        </ModalPopup>
      </div>
    </div>
  );
}
