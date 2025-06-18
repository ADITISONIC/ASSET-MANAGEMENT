"use client";
import { Plus, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { addNewCategoryAction, deleteCategory } from "@/actions/admin-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Category = {
  id: number;
  name: string;
  createdAt: Date;
};

interface CategoryManagerProps {
  categories: Category[];
}

function CategoryManager({
  categories: initiaCategories,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initiaCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const handleAddNewCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newCategoryName);
      const result = await addNewCategoryAction(formData);
      if (result.success) {
        const newCategory = {
          id: Math.max(0, ...categories.map((c) => c.id)) + 1,
          name: newCategoryName,
          createdAt: new Date(),
        };
        setCategories([...categories, newCategory]);
        setNewCategoryName("");
      }
    } catch (error) {}
  };
  const handleDeleteCategory = async(currentCatId:number)=>{
    const result = await deleteCategory(currentCatId)
    if(result.success){
        setCategories(categories.filter(c=>c.id!==currentCatId))
    }
  }
  return (
    <div className="space-y-6">
      <form onSubmit={handleAddNewCategory} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="categoryName">New Category</Label>
          <div className="flex gap-2">
            <Input
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
            <Button type="submit" className="bg-pink-400 hover:bg-pink-500">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </form>
      <div>
        <h3 className="text-lg font-medium mb-4">Categories</h3>
        {categories.length === 0 ? (
          <p>No categories added. Add your first category above</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="font-medium">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Button variant={"ghost"} size={"icon"} onClick={()=>handleDeleteCategory(cat.id)}>
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default CategoryManager;
