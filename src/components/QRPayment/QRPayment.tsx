import QRCode from "react-qr-code";
import Countdown from 'react-countdown';

const QRPayment = ({ bolt11, setStatus, status }) => {
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      if (status == 1) setStatus(0)
    } else {
      return <span style={{ fontSize: "40px" }}>{minutes}:{seconds}</span>;
    }
  };

  return (
    <div className="lg:w-1/3 w-full border-solid border-2 border-gray-300 px-7 py-12  rounded-2xl bg-white drop-shadow-md">
      <div className="flex justify-center">
        <Countdown
          date={Date.now() + 120000}
          renderer={renderer}
        />
      </div>
      <div className="my-9 flex justify-center ">
        <QRCode value={bolt11} className="text-center" />
      </div>
      <div className="text-center">
        <button className="bg-orange-500 px-5 py-2 text-white rounded-lg font-mono" onClick={() => setStatus(0)}>Cancelar</button>
      </div>
    </div>
  )
}
export default QRPayment
