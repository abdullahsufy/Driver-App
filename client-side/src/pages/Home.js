import React, { useEffect, useState } from "react";
import ContentModules from "../components/ContentModules";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetUser } from "../store/userSlice";
import { getDetail } from "../api/apis";
import Loader from "../components/Loader";
import Table from "../components/Table";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user._id);
  const [data, setData] = useState(null);
  const [credit, setCredit] = useState(0);
  const [debit, setDebit] = useState(0);
  const [balance, setBalance] = useState(0);
  // const [oldBalance, setOldBalance] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/");
    }
    getUserDetail();
    document.body.style.backgroundColor = "#084c61";
    return () => {
      document.body.style.backgroundColor = "white";
    };
    // eslint-disable-next-line
  }, []);

  const getUserDetail = async () => {
    try {
      const response = await getDetail(user);
      if (response.status === 200) {
        let newdata = response.data.detail.data;
        setData(newdata);
      } else {
        console.log(response.status);
      }
    } catch (error) {
      console.error(error);
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
    localStorage.clear();
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
            <ContentModules title="OLD BALANCE" amount="0" />
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
