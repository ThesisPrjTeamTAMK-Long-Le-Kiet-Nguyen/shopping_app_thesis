import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddShoeForm } from "./AddShoeForm"
import DeleteShoeForm from "./DeleteShoeForm"
import ModifyShoeForm from "./ModifyShoeForm"

export default function ShoeManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shoe Management</h1>

      <Tabs defaultValue="add" className="space-y-4">
        <TabsList>
          <TabsTrigger value="add">Add Shoe</TabsTrigger>
          <TabsTrigger value="modify">Modify Shoe</TabsTrigger>
          <TabsTrigger value="delete">Delete Shoe</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <AddShoeForm />
        </TabsContent>

        <TabsContent value="modify">
          <ModifyShoeForm />
        </TabsContent>

        <TabsContent value="delete">
          <DeleteShoeForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}