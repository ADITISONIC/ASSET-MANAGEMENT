'use server'
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, category, user } from "@/lib/db/schema";
import { count } from "console";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {z} from "zod"


const CategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must atleast be 2 letters")
    .max(50, "Category name must atmost be 50 letters"),
});

export type CategoryFormValues = z.infer<typeof CategorySchema>

export async function addNewCategoryAction(formData:FormData){
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(!session?.user||session.user.role!=='admin'){
    throw new Error('You must be an admin to add categories')
  }
  try {
     const name = formData.get('name') as string
     const validateFields = CategorySchema.parse({name})
     const existingCategory = await db.select().from(category).where(eq(category.name,validateFields.name)).limit(1)
     if(existingCategory.length>0){
        return{
            success:false,
            message:'category already exists!'
        }
     }
     await db.insert(category).values({
        name:validateFields.name
     })
     revalidatePath('admin/setting')
     return {
       success: true,
       message: "category added",
     };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: "category failed",
    };
  }
}

export async function getAllCategories(){
    const session = await auth.api.getSession({
        headers: await headers()
      })
      if(!session?.user||session.user.role!=='admin'){
        throw new Error('You must be an admin to add categories')
      }
    
    try {
        return await db.select().from(category).orderBy(category.name)
    } catch (error) {
        console.log(error);
        return []
    }
}

export async function getAllUsersCountAction(){
    const session = await auth.api.getSession({
    headers: await headers()
  })
  if(!session?.user||session.user.role!=='admin'){
    throw new Error('You must be an admin to add categories')
  }
  try {
     const result = await db.select({count:sql<number>`count(*)`}).from(user)
     return result[0]?.count||0
    return 0
  } catch (error) {
    console.log(error);
    return 0
  }
}

export async function deleteCategory(categoryId:number){
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || session.user.role !== "admin") {
      throw new Error("You must be an admin to add categories");
    }
    try {
         await db.delete(category).where(eq(category.id,categoryId)) 
        revalidatePath('admin/setting')
        return {
          success: true,
          message: "deleted category",
        };
    } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Failed to delete category",
        };
    }
}

export async function getTotalAssetsCount(){
    const session = await auth.api.getSession({
        headers:await headers()
    })
    if(!session?.user||session?.user.role!=='admin'){
        throw new Error("You must be an admin to access")
    }
    try {
        const result = await db.select({count:sql<number>`count(*)`}).from(asset)
        return result[0]?.count||0
    } catch (error) {
        console.log(error)
    }
}

export async function rejectAsset(assetId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user || session?.user.role === "user") {
    throw new Error("You must be an admin to access");
  }
  try {
    await db
      .update(asset)
      .set({ isApproved: "rejected", updatedAt: new Date() })
      .where(eq(asset.id, assetId));
    revalidatePath("/admin/asset-approval");
    return{
        success:true
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}
export async function acceptAsset(assetId:string) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || session?.user.role === "user") {
      throw new Error("You must be an admin to access");
    }
    try {
        await db.update(asset).set({isApproved:'approved',updatedAt:new Date()}).where(eq(asset.id,assetId))
        revalidatePath('/admin/asset-approval')
        return {
          success: true,
        };
    } catch (error) {
        console.log(error)
        return{
            success:false
        }
    }
}

export async function getPendingAssets(){
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || session?.user.role === "user") {
      throw new Error("You must be an admin to access");
    }
    try {
        const pendingAssets = await db.select({
            asset:asset,
            userName:user.name
        }).from(asset).leftJoin(user,eq(asset.userId,user.id)).where(eq(asset.isApproved,'pending'))
        return pendingAssets
    } catch (error) {
        return []
    }
}

