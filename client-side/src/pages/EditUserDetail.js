import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import { getDataToUpdate, updateDetails, updatePassword } from "../api/apis";
import Loader from "../components/Loader";
import Table from "../components/Table";
import ModalPopup from "../components/ModalPopup";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useFormik } from "formik";
import createUserSchema from "../schemas/createUserSchema";
import Input from "../components/Input";

export default function EditUserDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id, userid } = useParams();
  const [inputList, setInputList] = useState([
    { name: "name", type: "text", value: "" },
    { name: "username", type: "text", value: "" },
    { name: "email", type: "email", value: "" },
  ]);
  const [data, setData] = useState([]);
  const [addDetails, setAddDetails] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [updatePasswordBtn, setUpdatePasswordBtn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalUse, setModalUse] = useState("");
  const [oldBalance, setOldBalance] = useState(0);

  const GetData = async (userid) => {
    try {
      const response = await getDataToUpdate(userid);
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
          setOldBalance(detail.oldblnc);
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
    GetData(userid);
    return () => {
      document.body.style.backgroundColor = "white";
    };
    // eslint-disable-next-line
  }, []);

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: createUserSchema,
  });

  const HandleSubmitForm = (newUser) => {
    setUpdatedUser(newUser);
  };

  const UpdatePassword = async () => {
    const data = {
      id: userid,
      password: values.password,
    };
    try {
      await updatePassword(data);
    } catch (error) {
      dispatch(setUser({ errormessage: "Please authenticate using a valid token" }));
      navigate("/error");
    }
  };
  const UpdateUserDetails = async () => {
    const content = {
      id: userid,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      data,
      oldblnc: oldBalance,
    };
    try {
      const response = await updateDetails(content);
      if (response.status === 200) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
      dispatch(setUser({ errormessage: "Please authenticate using a valid token" }));
      navigate("/error");
    }
    if (!updatePasswordBtn && values.password !== "") {
      UpdatePassword();
    }
    setShowModal(true);
    setUpdatePasswordBtn(true);
    setModalUse({ action: "update" });
    setTimeout(() => {
      setShowModal(false);
    }, 1000);
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
            <button className="btn-primary rounded border-0 p-2" onClick={() => navigate(`/admin/panel/${id}`)}>
              Back to admin Panel
            </button>
            <button className="btn-success rounded border-0 p-2" onClick={UpdateUserDetails}>
              Update
            </button>
          </div>
          <h2 className="text-center text-light mt-3">User</h2>
          <div className="col-12">
            <UserForm key={inputList[1].value} inputList={inputList} onSubmit={HandleSubmitForm} edit="true" />
            {updatePasswordBtn ? (
              <button
                onClick={() => {
                  setShowModal(true);
                  setModalUse({ action: "passwordupdate" });
                }}
                className="btn btn-primary border-0 rounded py-2 px-3 mt-2"
              >
                Update Password
              </button>
            ) : (
              <>
                <label htmlFor="password" className="form-label text-light">
                  Enter New Password
                </label>
                <Input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password && touched.password ? 1 : undefined}
                errormessage={errors.password}
              />
              </>
            )}
          </div>
          <div className="col-12 mt-4">
            <h2 className="text-light text-center">OLD BALANCE</h2>
            <input
              className={`bg-light fs-3 fw-bold text-dark rounded px-2 py-2 border border-light mt-3 w-100`}
              type="number"
              min={0}
              value={oldBalance}
              onChange={(e) => setOldBalance(e.target.value)}
            ></input>
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
          closeBtn={false}
          title={
            modalUse.action === "passwordupdate"
              ? "Do you really want to update the password ?"
              : modalUse.action === "removerow"
              ? "Do you really want to remove the row ?"
              : modalUse.action === "update"
              ? "Updated Successfully!"
              : null
          }
        >
          {modalUse.action !== "update" && (
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
                    setUpdatePasswordBtn(false);
                  } else if (modalUse.action === "removerow") {
                    RemoveRow(modalUse.i);
                  }
                  setShowModal(false);
                }}
              >
                {modalUse.action === "passwordupdate" ? "Update" : modalUse.action === "removerow" ? "Remove" : null}
              </button>
            </div>
          )}
        </ModalPopup>
      </div>
    </div>
  );
}
