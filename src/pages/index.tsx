import { Inter } from 'next/font/google'
import dayjs from 'dayjs'
import Image from 'next/image'
import FormPayment from '@/components/FormPayment/FormPayment'
import QRPayment from '@/components/QRPayment/QRPayment'
import { useEffect, useState } from 'react';
import SuccessPayment from '@/components/SuccessPayment/SuccessPayment';
import ErrorPayment from '@/components/ErrorPayment/ErrorPayment';
import Login from '@/components/Login/Login';


const inter = Inter({ subsets: ['latin'] })
export default function Home() {

  const [invoice, setInvoice] = useState<any>({})
  const [token, setToken] = useState<any>({})
  const [status, setStatus] = useState(4)

  function setTimeoutAsync(timeout: number) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  useEffect(() => {
    if (status == 1) checkPayment(invoice.invoice.bolt11)
    if (!token) setStatus(4)
  }, [status]);

  const generateInvoice = async (amount: number) => {
    try {

      refreshToken()
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: token.accessToken
        },
        body: JSON.stringify({
          expiration: 120,
          amount: amount * 1000,
          accountId: 'ca37346a-9ba7-4f49-9656-cc2c920f8a7d'
        })
      };

      const response = await fetch('https://ibexhub.ibexmercado.com/v2/invoice/add', options)
      const invoice = await response.json()
      setInvoice(invoice)
      setStatus(1)
    } catch (error) {
      console.log(error)
      setStatus(4)
    }
  }

  const refreshToken = async () => {
    try {
      if (!token) {
        setStatus(4)
      }
      if (!dayjs(token.accessTokenExpiresAt).isAfter(dayjs())) {
        return
      }
      console.log("refresh token")
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: token.accessToken
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        })
      };

      const response = await fetch('https://ibexhub.ibexmercado.com/auth/refresh-access-token', options)
      const logged = await response.json()
      console.log(logged)
      setToken(logged)
    } catch (error) {
      console.log(error)
      setStatus(4)
    }
  }
  const login = async (email: string, password: string) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: token.accessToken
        },
        body: JSON.stringify({
          email,
          password
        })
      };

      const response = await fetch('https://ibexhub.ibexmercado.com/auth/signin', options)
      const logged = await response.json()
      console.log(logged)
      setToken(logged)
      setStatus(0)
    } catch (error) {
      console.log(error)
    }
  }

  const checkPayment = async (bolt11: string) => {
    try {
      refreshToken()
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: token.accessToken
        }
      };
      while (status == 1) {
        const response = await fetch(`https://ibexhub.ibexmercado.com/invoice/from-bolt11/${bolt11}`, options)
        const status = await response.json()
        await setTimeoutAsync(1500)
        if (status.state.name == 'SETTLED') {
          setStatus(2)
          return
        }
      }
    } catch (error) {
      console.log(error)
      setStatus(4)
    }
  }
  const drawComponent = () => {
    switch (status) {
      case 0:
        return <FormPayment generateInvoice={generateInvoice} />
      case 1:
        return <QRPayment bolt11={invoice.invoice.bolt11} setStatus={setStatus} status={status} />
      case 2:
        return <SuccessPayment setStatus={setStatus} />
      case 3:
        return <ErrorPayment setStatus={setStatus} />
      case 4:
        return <Login signIn={login} />
      default:
        return <FormPayment generateInvoice={generateInvoice} />
    }
  }

  return (
    <main className="flex px-5 min-h-screen flex-col items-center justify-center">
      {drawComponent()}
    </main>
  )
}
