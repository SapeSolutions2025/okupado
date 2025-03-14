'use client'

import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface AnuncioProps {
  className?: string
  fullHeight?: boolean
  dataSlot?: string
}

export function Ads({ className, fullHeight = false, dataSlot }: AnuncioProps) {
  useEffect(() => {
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      )
    } catch (e) {
      console.error('Adsense error:', e)
    }
  }, [])

  return (
    <div className={cn('w-full', fullHeight ? 'h-full' : '', className)}>
      <div
        className={cn(
          'bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg p-4 text-center',
          fullHeight ? 'h-full flex flex-col' : '',
        )}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-9478860631244349"
          data-ad-slot={dataSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  )
}
