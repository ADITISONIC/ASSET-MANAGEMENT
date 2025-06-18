import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, User2 } from "lucide-react";
import CategoryManager from "@/components/admin/category-management";
import {
  getAllCategories,
  getAllUsersCountAction,
} from "@/actions/admin-actions";
import { user } from "@/lib/db/schema";

async function SettingPage() {
  const [categories, userCount] = await Promise.all([
    getAllCategories(),
    getAllUsersCountAction(),
  ]);
  return (
    <div className="container py-10 px-6">
      <h1 className="text-3xl font-bold mb-5">Admin Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-7 items-end">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-bold">
              <User2 className="mr-2 w-5 h-5 text-pink-400" />
              Total Users
            </CardTitle>
            <CardDescription>
              All registered user on this Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-pink-400 text-3xl">{userCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-bold">
              <User2 className="mr-2 w-5 h-5 text-pink-400" />
              Total Assets
            </CardTitle>
            <CardDescription>
              All uploaded assets on this Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-pink-400 text-3xl">1000</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryManager categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingPage;
