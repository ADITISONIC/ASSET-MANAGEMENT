'use client'

import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useState } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type Category={
    id:number,
    name:string,
    createdAt:Date
}

type CloudinarySignature = {
    signature:string
    timestamp:number
    apiKey:string
}

type FormState ={
    title:string,
    description:string,
    categoryId:string,
    file: File|null
}

interface UploadDialogProperty{
    categories:Category[]
}

function UploadAsset({categories}:UploadDialogProperty){
    const [open,setOpen] = useState(false)
    const [isUploading,setIsUploading] = useState(false)
    const [uploadProgessStatus,setUploadProgressStatus] = useState(0)
    const [formState,setFormState] = useState<FormState>({
        title:'',
        description:'',
        categoryId:'',
        file:null
    })
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name,value} = e.target
        setFormState(prev=>({...prev,[name]:value}))
    }
    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0]
        if(file){
            setFormState(prev=>({...prev,file}))
        }
    }
    const handleCategoryChange = (value:string)=>{
        console.log(value);
        setFormState((prev) => ({ ...prev, categoryId: value }));
    }
    console.log(formState);

    async function getCloudinarySignature():Promise<CloudinarySignature>{
       const timestamp = Math.round(new Date().getTime()/1000)
       const response = await fetch('/api/cloudinary/signature',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({timestamp})
       }
    )
    if (!response.ok) {
      throw new Error("Failed to create cloudinary signature");
    }
    return await response.json();
    }
    const handleAssetUpload = async(event:React.FormEvent)=>{
        event.preventDefault()
        setIsUploading(true)
        setUploadProgressStatus(0)
        try {
          const { signature, apiKey, timestamp } =
            await getCloudinarySignature();
          const cloudinaryData = new FormData();
          cloudinaryData.append("file", formState.file as File);
          cloudinaryData.append("api_key", apiKey);
          cloudinaryData.append("timestamp", timestamp.toString());
          cloudinaryData.append("signature", signature); // <-- 🔴 Missing before
          cloudinaryData.append("folder", "next-full-course-asset-manager");

          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`
          );
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploadProgressStatus(progress);
            }
          };
          const cloudinaryPromise = new Promise<any>((resolve, reject) => {
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } else {
                reject(new Error("Upload to cloudinary failed"));
              }
            };
            xhr.onerror = () =>
              reject(new Error("Upload to cloudinary failed"));
          });
          xhr.send(cloudinaryData);
          const cloudinaryResponse = await cloudinaryPromise;
          console.log(cloudinaryResponse);

          const formData = new FormData();
          formData.append("title", formState.title);
          formData.append("description", formState.description);
          formData.append("categoryId", formState.categoryId);
          formData.append("fileUrl", cloudinaryResponse.secure_url);
          formData.append("thumbnailUrl", cloudinaryResponse.secure_url);
        } catch (error) {
            
        }
    }
    
    return (
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-400 hover:bg-pink-500 text-white">
              <Plus className="mr-2 w-4 h-4" />
              Upload Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload new Asset</DialogTitle>
            </DialogHeader>
            <form className="space-y-5" onSubmit={handleAssetUpload}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  value={formState.title}
                  onChange={handleInputChange}
                  id="title"
                  name="title"
                  placeholder="Title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={formState.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={handleCategoryChange} value={formState.categoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File Upload</Label>
                <Input onChange={handleFileChange} type="file" id="file" accept="image/*" />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-pink-400 text-white font-bold hover:bg-pink-500"
                >
                  Upload Asset
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
}

export default UploadAsset