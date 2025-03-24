import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddStringingForm from "./AddStringingForm"
import DeleteStringingForm from "./DeleteStringingForm"
import ModifyStringingForm from "./ModifyStringingForm"
import StringingAdminList from "./StringingAdminList"

export default function StringingManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Stringing Management</h1>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Product List</TabsTrigger>
          <TabsTrigger value="add">Add String</TabsTrigger>
          <TabsTrigger value="modify">Modify String</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <StringingAdminList />
        </TabsContent>

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