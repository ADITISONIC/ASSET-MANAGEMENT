"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "../ui/button";

function LoginButton() {
    const handleLogin = async()=>{
        await signIn.social({
            provider:'google',
            callbackURL:'/'
        })
    }
  return <div>
    <Button onClick={handleLogin} className="w-full bg-pink-400 hover:bg-pink-600 text-white py-6 text-base font-medium">
        <span>Sign in to Google</span>
    </Button>
  </div>;
}

export default LoginButton;
