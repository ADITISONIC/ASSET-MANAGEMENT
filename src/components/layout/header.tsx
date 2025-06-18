'use client'

import { signOut, useSession } from "@/lib/auth-client"
import { LogOut, Package2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback } from "../ui/avatar"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu"



function Header(){
    const pathName = usePathname()
    const router = useRouter()
    const isLoginPage :boolean = pathName ==="/login"
    const {data:session,isPending} = useSession()
    const user = session?.user
    const isAdminUser = user?.role ==='admin'

    const handleLogout = async()=>{
           await signOut({
            fetchOptions:{
                onSuccess:()=>{
                    router.push('/')
                }
            }
           })
    }

    return (
      <div className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href={"/"} className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-pink-400">
                <Package2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-pink-400">
                Asset Platform
              </span>
            </Link>
            <nav className="flex gap-6 ml-6 items-center">
              {!isPending && user && !isAdminUser && (
                <>
                  <Link
                    href={"/gallery"}
                    className="text-sm font-medium hover:text-pink-400"
                  >
                    Gallery
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-pink-400"
                    href={"/dashboard/asset"}
                  >
                    Asset
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-pink-400"
                    href={"/dashboard/purchases"}
                  >
                    My Purchases
                  </Link>
                </>
              )}
              {!isPending && user && isAdminUser && (
                <>
                  <Link
                    className="text-sm font-medium hover:text-pink-400"
                    href={"/admin/asset-aproval"}
                  >
                    Asset Approval
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-pink-400"
                    href={"/admin/setting"}
                  >
                    Setting
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-6">
            {isPending ? null : user ? (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9 border border-slate-300 rounded-full">
                        <AvatarFallback className="rounded-full bg-pink-400 text-white">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-4">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-500"
                    >
                      <LogOut className="mr-2 h-2 w-4" />
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href={"/login"}>
                <Button className="bg-pink-400 hover:bg-pink-400 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
}

export default Header