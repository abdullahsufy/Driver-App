import React, { useEffect, useState } from "react";
import ContentModules from "../components/ContentModules";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetUser, setUser } from "../store/userSlice";
import { getDetail } from "../api/apis";
import Loader from "../components/Loader";
import Table from "../components/Table";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useParams();
  const [data, setData] = useState(null);
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);
  const [balance, setBalance] = useState(0);
  const [oldBalance, setOldBalance] = useState(0);

  useEffect(() => {
    getUserDetail();
    // eslint-disable-next-line
  }, []);

  const getUserDetail = async () => {
    try {
      const response = await getDetail(user);
      if (response.status === 200) {
        let newdata = response.data.detail.data;
        let newoldbalance = response.data.detail.oldblnc;
        setData(newdata);
        setOldBalance(newoldbalance);
      } else {
        console.log(`error occured with status: ${response.status}`);
      }
    } catch (error) {
      dispatch(setUser({ errormessage: "Please authenticate using a valid token", errorsource: "user" }));
      navigate("/error");
    }
  };

  useEffect(() => {
    if (data) {
      let newCredit = 0,
        newDebit = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].credit !== "") {
          newCredit += parseFloat(data[i].credit);
        }
        if (data[i].debit !== "") {
          newDebit += parseFloat(data[i].debit);
        }
      }
      setCredit(newCredit);
      setDebit(newDebit);
    }
  }, [data]);

  useEffect(() => {
    setBalance(credit - debit);
  }, [credit, debit]);

  const ResetFunction = () => {
    dispatch(resetUser);
    localStorage.removeItem("auth-token");
    navigate("/");
  };
  const headers = ["time", "type", "credit", "debit", "note"];

  if (!data) {
    return <Loader text="Details" color="#ffffff" size="120" />;
  }

  return (
    <div className="container-fluid my-3 mb-5 ">
      <div className="container d-flex justify-content-between">
        <button className="fs-2 text-light border-0 rounded" style={{ backgroundColor: "#347AB6" }}>
          VIEW
        </button>
        <button onClick={ResetFunction} className="fs-2 text-light border-0 rounded bg-danger">
          RESET
        </button>
      </div>
      {data.length ? (
        <div className="container mt-5 pt-5">
          <div>
            <ContentModules title="OLD BALANCE" amount={oldBalance} />
          </div>
          <div>
            <Table data={data} headers={headers} />
          </div>
          <div>
            <ContentModules title="TOTAL CREDIT" amount={credit} />
            <ContentModules title="TOTAL DEBIT" amount={debit} />
            <ContentModules title="TOTAL BALANCE" amount={balance} />
          </div>
        </div>
      ) : (
        <h1 className="text-center">No data to show</h1>
      )}
    </div>
  );
}
