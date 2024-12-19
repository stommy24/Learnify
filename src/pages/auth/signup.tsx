import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Start your learning journey today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
            >
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 