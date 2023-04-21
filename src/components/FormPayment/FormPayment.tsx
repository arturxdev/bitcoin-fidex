import { useState } from "react"
import Image from 'next/image'

const FormPayment = ({ generateInvoice }: { generateInvoice: (amount: number) => any }) => {
  const [amount, setAmount] = useState(0)
  const changeAmount = (e: any) => { setAmount(e.target.value) }
  return (
    <div className="lg:w-1/3 w-full border-solid border-2 border-gray-300 px-7 py-12  rounded-md bg-white drop-shadow-md">
      <div className="flex justify-center">
        <Image src="/logo.png" alt="logo" width={250} height={50} />
      </div>
      <p className="text-center font-mono text-lg text-gray-400">Bitcoin Checkout</p>
      <div className="my-9  w-full flex justify-center">
        <div>
          <label htmlFor="" className="text-gray-400 block">Monto</label>
          <input type="number" value={amount} onChange={changeAmount} className="border-b-2 text-black border-gray-300 w-full" />
        </div>
      </div>
      <div className="text-center">
        <button onClick={() => generateInvoice(amount)} className="bg-orange-500 px-5 py-2 text-white rounded-md font-mono">Generar QR</button>
      </div>
    </div>
  )
}
export default FormPayment
