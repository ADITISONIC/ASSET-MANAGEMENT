import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"


export default async function UserDashboardLayout({
    children
}:{children:React.ReactNode}){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        redirect('/login')
    }
    if(session && session.user.role==='admin'){
        redirect('/admin/asset-aproval')
    }
    return(
        <main className="flex-1 p-4 lg:p-6">
       {children}
        </main>
    )
}