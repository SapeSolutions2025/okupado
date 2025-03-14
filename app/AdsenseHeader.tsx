'use client'
import Adsense from '@/components/Adsense/ScriptAdSense'
import { useEffect, useState } from 'react'

export default function AdsenseHeader() {
  const [loadAds, setLoadAds] = useState(false)

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent')
    if (storedConsent) {
      const preferences = JSON.parse(storedConsent)
      if (preferences.marketing) {
        setLoadAds(true)
      }
    }
  }, [])

  return (
    <>
      {loadAds && <Adsense pId={'ca-pub-9478860631244349'} />}
      <meta name="google-adsense-account" content={'ca-pub-9478860631244349'} />
    </>
  )
}
