import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Dynamically import the Amicooked component with no SSR
const Amicooked = dynamic(() => import('../components/amicooked'), {
  ssr: false,
})

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-2xl font-bold text-center py-6">
            Welcome to Amicooked
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Please sign in to continue</p>
            <Button onClick={() => window.location.href = '/auth/signin'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-2xl font-bold text-center py-6">
          Welcome to Amicooked
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium">You are posting as:</p>
              <p className="text-xl font-bold text-primary">{session.user?.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                (Your anonymous name changes with each new thread)
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <Button 
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                variant="outline"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Amicooked />
    </div>
  )
}
