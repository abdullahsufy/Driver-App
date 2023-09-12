export default function Input(props) {
  return (
    <div className={`border-0 ${props.error ? "" : "mb-3"}`}>
      <input {...props} className="w-100 p-2 border-1 rounded" />
      {props.error && (
        <p className="text-danger text-end border-0 m-0 ">
          <small>{props.errormessage}</small>
        </p>
      )}
    </div>
  );
}
