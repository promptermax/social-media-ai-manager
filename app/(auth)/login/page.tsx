"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Info } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const useDummyAccount = (userEmail: string) => {
    setEmail(userEmail)
    setPassword("demo123")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Access your social media management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Accounts Available:</strong>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Admin:</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => useDummyAccount("john@example.com")}
                      className="h-6 px-2 text-xs"
                    >
                      Use Account
                    </Button>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Lead:</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => useDummyAccount("jane@example.com")}
                      className="h-6 px-2 text-xs"
                    >
                      Use Account
                    </Button>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Member:</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => useDummyAccount("mike@example.com")}
                      className="h-6 px-2 text-xs"
                    >
                      Use Account
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Any password works for demo
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
