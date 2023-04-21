import { useState } from "react"
import Image from 'next/image'

const Login = ({ signIn }: any) => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const changeAmount = (e: any) => { setEmail(e.target.value) }
  const changePass = (e: any) => { setPass(e.target.value) }
  return (
    <div className="lg:w-1/3 w-full border-solid border-2 border-gray-300 px-7 py-12  rounded-md bg-white drop-shadow-md">
      <div className="flex justify-center">
        <Image src="/logo.png" alt="logo" width={250} height={50} />
      </div>
      <p className="text-center font-mono text-lg text-gray-400">Bitcoin Checkout</p>
      <div className="my-9  w-3/4 m-auto">
        <div>
          <label htmlFor="" className="text-gray-400 block">Usuario</label>
          <input type="email" value={email} onChange={changeAmount} className="border-b-2 border-gray-300 w-full" />
        </div>
        <div className="mt-10">
          <label htmlFor="" className="text-gray-400 block">Password</label>
          <input type="password" value={pass} onChange={changePass} className="border-b-2 border-gray-300 w-full" />
        </div>
      </div>
      <div className="text-center">
        <button onClick={() => signIn(email, pass)} className="bg-orange-500 px-5 py-2 text-white rounded-md font-mono">Entrar</button>
      </div>
    </div>
  )
}
export default Login
