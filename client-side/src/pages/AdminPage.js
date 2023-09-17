import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { gettAllUsers, register, deleteUser } from "../api/apis";
import UserForm from "../components/UserForm";
import Table from "../components/Table";
import Loader from "../components/Loader";
import ModalPopup from "../components/ModalPopup";

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalUse, setModalUse] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = "#084c61";
    getUsers();
    return () => {
      document.body.style.backgroundColor = "white";
    };
  }, []);

  const getUsers = async () => {
    try {
      const response = await gettAllUsers();
      if (response.status === 200) {
        const users = response.data.users;
        setData(users);
      }
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
    setShowModal(false);
  };

  const HandleDelete = async () => {
    const id = deleteUserId;
    try {
      const response = await deleteUser(id);
      if (response.status === 200) {
        const newData = data.filter((user) => user._id !== id);
        setData(newData);
      }
    } catch (error) {
      console.log(error);
    }
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
        <h1 className="text-center">Admin Panel</h1>
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
          title={modalUse === "adduser" ? "Create a User" : modalUse === "deleteuser" ? "Do you really want to delete this user ?" : null}
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
          ) : null}
        </ModalPopup>
      </div>
    </div>
  );
}
