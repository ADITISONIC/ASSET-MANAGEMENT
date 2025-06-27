"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { asset, category, user } from "@/lib/db/schema";
import { username } from "better-auth/plugins";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const AssetSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  categoryId: z.number().positive("Please select a category"),
  fileUrl: z.string().url("Invalid string url"),
  thumbnailUrl: z.string().url("Invalid string url").optional(),
});

export async function getCategories() {
  try {
    return db.select().from(category);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function uploadAsset(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("You must be logged in to upload asset");
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
      title: validateFields.title,
      description: validateFields.description,
      fileUrl: validateFields.fileUrl,
      thumbnailUrl: validateFields.thumbnailUrl,
      isApproved: "pending",
      userId: session.user.id,
      categoryId: validateFields.categoryId,
    });
    revalidatePath("/dashboard/assets");
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: true,
      error: "Failed to upload asset",
    };
  }
}

export async function getAllUserAsset(userId: string) {
  try {
    return await db
      .select()
      .from(asset)
      .where(eq(asset.userId, userId))
      .orderBy(asset.createdAt);
  } catch (error) {
    return [];
  }
}

export async function getPublicAssets(categoryId?: number) {
  try {
    let conditions = and(eq(asset.isApproved, "approved"));
    if (categoryId) {
      conditions = and(conditions, eq(asset.categoryId, categoryId));
    }
    const query = await db
      .select({
        asset: asset,
        categoryName: category.name,
        userName: user.name,
      })
      .from(asset)
      .leftJoin(category, eq(asset.categoryId, category.id))
      .leftJoin(user, eq(asset.userId, user.id))
      .where(conditions);
    return query;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAssetById(assetId: string) {
  try {
    const [result] = await db
      .select({
        asset: asset,
        categoryName: category.name,
        username: user.name,
        userImage: user.image,
        userId: user.id,
      })
      .from(asset)
      .leftJoin(category, eq(asset.categoryId, category.id))
      .leftJoin(user, eq(asset.userId, user.id));
      return result
  } catch (error) {
    return null;
  }
}
