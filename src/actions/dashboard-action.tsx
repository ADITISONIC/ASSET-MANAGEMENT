'use server'

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { asset, category } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import {z} from "zod"

const AssetSchema = z.object({
    title:z.string(),
    description:z.string().optional(),
    categoryId:z.number().positive('Please select a category'),
    fileUrl : z.string().url('Invalid string url'),
    thumbnailUrl:z.string().url('Invalid string url').optional()
})


export async function getCategories(){
    try {
         return db.select().from(category)
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function uploadAsset(formData:FormData){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session?.user){
      throw new Error('You must be logged in to upload asset')
    }
    try {
        const validateFields = AssetSchema.parse({
          title: formData.get("title"),
          description: formData.get("description"),
          categoryId: Number(formData.get("categoryId")),
          fileUrl: formData.get("fileUrl"),
          thumbnailUrl: formData.get("thumbnailUrl") || formData.get("fileUrl"),
        });

        await db.insert(asset).values({
            title:validateFields.title,
            description:validateFields.description,
            fileUrl:validateFields.fileUrl,
            thumbnailUrl:validateFields.thumbnailUrl,
            isApproved:'pending',
            userId:session.user.id,
            categoryId:validateFields.categoryId
        })
        revalidatePath('/dashboard/assets')
        return{
            success:true
        }
    } catch (error) {
        console.log(error)
        return{
            success:true,
            error:'Failed to upload asset'
        }
    }
}

export async function getAllUserAsset(userId:string){
try {
    return await db.select().from(asset).where(eq(asset.userId,userId)).orderBy(asset.createdAt)
} catch (error) {
    return []
}
}