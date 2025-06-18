'use server'
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { category, user } from "@/lib/db/schema";
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