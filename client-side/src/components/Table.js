import React from "react";
import { useNavigate } from "react-router-dom";

export default function Table({ data, setData, headers, HandleDelete, editable = false }) {
  const navigate = useNavigate();
  const EditHandle = (id) => {
    navigate(`/update/${id}`);
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

  return (
    <table className="table table-bordered bg-light border border-muted border-2 mt-4 fw-bold fs-5">
      <thead className="table-secondary">
        <tr>
          {headers &&
            headers.map((header) => (
              <th key={header} scope="col">
                {header.toUpperCase()}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((item, rowIndex) => (
            <tr key={rowIndex} className="">
              {headers.map((header) => (
                <td key={header}>
                  {header === "operations" ? (
                    <>
                      <button className="btn-primary rounded ms-2 border-0" onClick={() => EditHandle(item._id)}>
                        Edit
                      </button>
                      <button className="btn-danger rounded ms-3 border-0" onClick={() => HandleDelete(item._id)}>
                        Delete
                      </button>
                    </>
                  ) : editable ? (
                    <input type="text" value={item[header]} onChange={(e) => EditData(rowIndex, header, e.target.value)} className="border-0 w-100" />
                  ) : (
                    item[header]
                  )}
                </td>
              ))}
              {editable ? (
                <td>
                  <button className="btn-danger rounded border-0 fs-6" onClick={() => RemoveRow(rowIndex)}>
                    remove
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
      </tbody>
    </table>
  );
}
