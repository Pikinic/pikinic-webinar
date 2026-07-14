import localFont from 'next/font/local'

export const atyp = localFont({
    src:[
        {path:'../public/fonts/Atyp-Regular.otf', weight:'400', style:'normal'},
        {path:'../public/fonts/Atyp-Medium.otf', weight:'500', style:'normal'},
        {path:'../public/fonts/Atyp-Semibold.otf', weight:'600', style:'normal'},
        {path:'../public/fonts/Atyp-Bold.otf', weight:'700', style:'normal'}
    ],
    variable: '--font-atyp',
})