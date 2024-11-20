import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    // Remove any server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-slate-900">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}
