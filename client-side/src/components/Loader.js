import { TailSpin } from "react-loader-spinner";

export default function Loader({ text, size, color }) {
  return (
    <div className="loaderWrapper">
      <h2 className="text-light">Loading {text}</h2>
      <TailSpin height={size} width={size} radius={1} color={color} />
    </div>
  );
}
