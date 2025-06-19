import Image from "next/image"
import { Badge } from "../ui/badge"
import { formatDistanceToNow } from "date-fns"

type Asset = {
    id:string
    title:string
    description:string|null
    fileUrl:string
    isApproved: string
    categoryId:number|null
    createdAt:Date
}

interface AssetGridProps{
    assets:Asset[]
}

function AssetGrid({assets}:AssetGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {assets.map((as) => (
        <div
          key={as.id}
          className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow"
        >
          <div className="h-48 bg-slate-200 relative transition-transform duration-300 hover:scale-105">
            <Image
              src={as.fileUrl}
              alt={as.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
             <Badge className={
                as.isApproved==='approved'?'bg-pink-400':
                as.isApproved==='rejected'?'bg-red-500':'bg-amber-300'
             } variant={'default'}>
                {
                    as.isApproved==='approved'?'Approved':
                    as.isApproved==='rejected'?'Rejected':'Pending'
                }

             </Badge>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium truncate">{as.title}</h3>
            {
                as.description && (
                    <p className="text-xs text-slate-500">{as.description}</p>
                )
            }
            <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-slate-400">
                  {
                    formatDistanceToNow(new Date(as.createdAt),{
                        addSuffix:true
                    })
                  }
                </span>
            </div>
            </div>
        </div>
      ))}
    </div>
  );
}

export default AssetGrid
