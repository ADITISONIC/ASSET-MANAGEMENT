import { getAllUserAsset, getCategories } from "@/actions/dashboard-action";
import AssetGrid from "@/components/dashboard/asset-grid"
import UploadAsset from "@/components/dashboard/upload-asset";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


async function UserAssetsPage(){
    const session = await auth.api.getSession({
        headers:await headers()
    })
    if(session===null)return null
    const [categories,assets] = await Promise.all([getCategories(),getAllUserAsset(session?.user?.id)])
    console.log(assets);
    
    return (
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold">My Assets</h1>
          <UploadAsset categories={categories||[]}/>
        </div>
        <AssetGrid assets={assets}/>
      </div>
    );
}

export default UserAssetsPage