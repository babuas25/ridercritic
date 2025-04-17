import localFont from 'next/font/local'

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
  ],
  variable: '--font-nordique'
})