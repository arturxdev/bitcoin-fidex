import Image from 'next/image'
const SuccessPayment = ({ setStatus }: any) => {
  return (
    <div className="lg:w-1/3 w-full border-solid border-2 border-gray-300 px-7 py-12  rounded-2xl bg-white drop-shadow-md">
      <p className="text-center font-mono text-2xl">Pago con éxito</p>
      <div className="my-9 flex justify-center">
        <video autoPlay loop muted>
          <source src="/fish.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </div>
      <div className="text-center">
        <button className="bg-orange-500 px-5 py-2 text-white rounded-lg font-mono" onClick={() => setStatus(0)}>Inicio</button>
      </div>
    </div>
  )
}
export default SuccessPayment
