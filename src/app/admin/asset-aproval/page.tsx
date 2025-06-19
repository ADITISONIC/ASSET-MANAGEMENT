import { acceptAsset, getPendingAssets, rejectAsset } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import Image from "next/image";

async function AssetApproval() {
  const pendingAssets = await getPendingAssets();

  return (
    <div className="container py-10">
      {pendingAssets.length === 0 ? (
        <div className="ml-5">
          <Card className="bg-white m-6">
            <CardContent className="py-16 flex flex-col items-center justify-center">
              <p className="text-center text-slate-300 text-lg">
                All assets have been reviewed
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 m-6">
          {pendingAssets.map(({ asset, userName }) => (
            <div
              key={asset.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow"
            >
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                <Image
                  src={asset.fileUrl}
                  alt={asset.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium truncate">{asset.title}</h3>
                {asset.description && (
                  <p className="text-xs text-slate-500">{asset.description}</p>
                )}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(asset.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <div className="flex items-center text-xs text-slate-500">
                    <User className="mr-2 w-4 h-4 text-pink-400" />
                    {userName}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <form
                  action={async () => {
                    "use server";
                    await acceptAsset(asset.id);
                  }}
                >
                  <Button className="bg-pink-400 hover:bg-pink-500 text-white">
                    Approve
                  </Button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await rejectAsset(asset.id);
                  }}
                >
                  <Button className="bg-red-400 hover:bg-red-500 text-white">
                    Reject
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssetApproval;
