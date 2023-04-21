import { Inter } from 'next/font/google'
import Image from 'next/image'
import FormPayment from '@/components/FormPayment/FormPayment'
import QRPayment from '@/components/QRPayment/QRPayment'
import { useEffect, useState } from 'react';
import SuccessPayment from '@/components/SuccessPayment/SuccessPayment';
import ErrorPayment from '@/components/ErrorPayment/ErrorPayment';


const inter = Inter({ subsets: ['latin'] })
export default function Home() {

  const [invoice, setInvoice] = useState<any>({})
  const [status, setStatus] = useState(0)

  function setTimeoutAsync(timeout: number) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  useEffect(() => {
    if (status == 1) checkPayment(invoice.invoice.bolt11)
  }, [status]);

  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODIwMzUzMTIsIklEIjoiIiwiVHlwZSI6ImFjY2VzcyIsIlVzZXJJRCI6IjM0NjMzYzk0LTU5NWYtNDNiYi1iYmE1LTNlNzc5ZDA1MjNkZiIsIlBlcm1pc3Npb25zIjpudWxsLCJQb29sIjoiSUJFWF9IVUIifQ.nEytqgU3ITc6mscrtf29uQxlLyB-FIi0ljKPoXpGv5yVUwujOZNk2uou5sw97XRERqnqUrBpHQQ0ezsgkYqNHNgxchdsCOuJkQq13EUoVHRK6UgjEM19brVegMRL44dGAx6wOZWHQ0EqtXGfi4iTjGkzsmXLiA5UnCZe52Huejqycz7LCI8LkvK3TXH1aisbp8QTOArYdQEEtFTLpGbmorc4ny8C5Ad7LYZ7jyTL6UgOHutchE19-D8_-J3caU9fimecKZQE0uxK4yWZNmdgx1-VW6Ul4SFXRzaKNBF9IrMDUbFqseF9-ONQVL3npMSfMmwXGxBq-NxK9vfzzr_kZdCOReaeRxChHQ_iuGUTI0alAjdYLBtgNY5MEvOuN25le-XDg07pOAV8Gwghq4ztZIGe8hyUdf5werrV7WBkz7F6dSVLBtxfSFCbnpXX-Fn00g7oF4ehQTMtw964LdReSHw6JW91o3DPCnazJ-A2HhhbGlOfwrfToki_5F7rwlXlviZG60cv5-pktygw89QXaYrsNppr1w5bdGk_rszKKjUTe7TGRXA7f7hqockg1KCtosxHYZ28pe3GDv4M9kKC90l8zMjF5itstDj-i61YWkxQ8alBaJsAMn2aaSNSEJGP5VREmHckllfB2ACibswzlumpimJcgKMFUQSoGUDQ2eQ'

  const generateInvoice = async (amount: number) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: token
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
  }

  const checkPayment = async (bolt11: string) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: token
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
