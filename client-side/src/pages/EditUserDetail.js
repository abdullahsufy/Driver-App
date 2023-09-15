import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import { getDataToUpdate, updateDetails } from "../api/apis";
import Loader from "../components/Loader";
import Table from "../components/Table";
import ModalPopup from "../components/ModalPopup";

export default function EditUserDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputList, setInputList] = useState([
    { name: "name", type: "text", value: "" },
    { name: "username", type: "text", value: "" },
    { name: "email", type: "email", value: "" },
  ]);
  const [data, setData] = useState([]);
  const [addDetails, setAddDetails] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalUse, setModalUse] = useState("");

  const GetData = async (id) => {
    try {
      const response = await getDataToUpdate(id);
      if (response.status === 200) {
        const { user, detail } = response.data;
        const updatedInputList = inputList.map((input) => ({
          ...input,
          value: user[input.name] || "",
        }));
        setInputList(updatedInputList);
        setUpdatedUser(user);
        if (detail) {
          setData(detail.data);
        } else {
          setAddDetails(true);
          AddRow();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const AddRow = () => {
    let newObj = {
      time: "",
      type: "",
      credit: "",
      debit: "",
      note: "",
    };
    const newData = [...data, newObj];
    setData(newData);
  };
  useEffect(() => {
    document.body.style.backgroundColor = "#084c61";
    GetData(id);
    return () => {
      document.body.style.backgroundColor = "white";
    };
    // eslint-disable-next-line
  }, []);

  const UpdatePassword = () => {
    let updatePassOneTym = true;
    if (inputList.length > 3 && inputList[3].name === "password") {
      updatePassOneTym = false;
    }

    if (updatePassOneTym) {
      const pass = {
        name: "password",
        type: "password",
        value: "",
      };
      const newList = [...inputList, pass];
      setInputList(newList);
    }
  };
  const HandleSubmitForm = (newUser) => {
    setUpdatedUser(newUser);
  };
  const UpdateUserDetails = async () => {
    const content = {
      id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      data,
    };
    try {
      const response = await updateDetails(content);
      if (response.status === 200) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const EditData = (rowIndex, header, newValue) => {
    const updatedData = [...data];
    updatedData[rowIndex][header] = newValue;
    setData(updatedData);
  };
  const RemoveRow = (rowIndex) => {
    const updatedData = [...data];
    updatedData.splice(rowIndex, 1);
    setData(updatedData);
  };

  const headers = ["time", "type", "credit", "debit", "note"];

  if (!data.length) {
    return <Loader text="Details" color="#ffffff" size="120" />;
  }

  return (
    <div className="container-fluid mb-5 ">
      <div className="container mt-5">
        <div className="row mt-5">
          <div className="col-12 d-flex justify-content-between">
            <button className="btn-primary rounded border-0 p-2" onClick={() => navigate("/admin")}>
              Back to admin Panel
            </button>
            <button className="btn-success rounded border-0 p-2" onClick={UpdateUserDetails}>
              Update
            </button>
          </div>
          <h2 className="text-center text-light mt-3">User</h2>
          <div className="col-12">
            <UserForm key={inputList[1].value} inputList={inputList} onSubmit={HandleSubmitForm} edit="true" />
            <button
              onClick={() => {
                setShowModal(true);
                setModalUse({ action: "passwordupdate" });
              }}
              className="btn btn-primary border-0 rounded py-2 px-3 mt-2"
            >
              Update Password
            </button>
          </div>
          <h2 className="text-center text-light mt-3">{addDetails ? "Add Details" : "Details"}</h2>
          <div className="col-12">
            <Table
              data={data}
              headers={headers}
              EditData={EditData}
              RemoveRow={(i) => {
                setShowModal(true);
                setModalUse({ action: "removerow", i });
              }}
              editable="true"
            />
          </div>
          <div className="col-12 d-flex justify-content-end">
            <button className="btn-primary rounded border-0 p-2" onClick={AddRow}>
              ADD ANOTHER ROW
            </button>
          </div>
        </div>
        <ModalPopup
          showModal={showModal}
          setShowModal={setShowModal}
          title={`Do you really want to ${
            modalUse.action === "passwordupdate" ? "update the password " : modalUse.action === "removerow" ? "remove the row " : null
          } ?`}
        >
          <div className="col-12 d-flex justify-content-end">
            <button
              className="btn btn-danger px-3 py-2 m-2"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary px-3 py-2 m-2"
              onClick={() => {
                if (modalUse.action === "passwordupdate") {
                  UpdatePassword();
                } else if (modalUse.action === "removerow") {
                  RemoveRow(modalUse.i);
                }
                setShowModal(false);
              }}
            >
              {modalUse.action === "passwordupdate" ? "Update" : modalUse.action === "removerow" ? "Remove" : null}
            </button>
          </div>
        </ModalPopup>
      </div>
    </div>
  );
}
