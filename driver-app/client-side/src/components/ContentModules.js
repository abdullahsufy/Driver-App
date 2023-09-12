import React from "react";

export default function ContentModules({ title, amount }) {
  const balance = title === "BALANCE" ? true : false;

  return (
    <div className="mt-4">
      <p className="text-light text-center fs-3">{title}</p>
      <p className={`bg-${balance ? "success" : "light"} fs-3 fw-bold text-${balance ? "dark" : "muted"} rounded px-2 py-2 border border-light`}>{amount}</p>
    </div>
  );
}
