import LoginButton from "@/components/auth/LoginButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package2Icon } from "lucide-react"
import Link from "next/link";


function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md shadow">
        <CardHeader className="text-center">
          <div className="mx-auto p-2 rounded-full bg-pink-400 w-fit">
            <Package2Icon className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-3xl text-bold text-pink-400">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-500">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton/>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Link href={'/'} className="text-sm text-slate-500 hover:text-pink-400">Back to Home</Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginPage