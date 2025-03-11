import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddStringingForm from "./AddStringingForm"
import DeleteStringingForm from "./DeleteStringingForm"
import ModifyStringingForm from "./ModifyStringingForm"

export default function StringingManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Stringing Management</h1>

      <Tabs defaultValue="add" className="space-y-4">
        <TabsList>
          <TabsTrigger value="add">Add Stringing</TabsTrigger>
          <TabsTrigger value="modify">Add Color</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <AddStringingForm />
        </TabsContent>

        <TabsContent value="modify">
          <ModifyStringingForm />
        </TabsContent>

        <TabsContent value="delete">
          <DeleteStringingForm />
        </TabsContent>
      </Tabs>
    </div>
  )
} 