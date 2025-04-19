import localFont from 'next/font/local'
import { GeistSans } from 'geist/font'

export const nordique = localFont({
  src: [
    {
      path: '../public/fonts/nordique-pro-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/nordique-pro-semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/nordique-pro-bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-nordique'
})

export const fonts = {
  nordique,
  geist: GeistSans
}