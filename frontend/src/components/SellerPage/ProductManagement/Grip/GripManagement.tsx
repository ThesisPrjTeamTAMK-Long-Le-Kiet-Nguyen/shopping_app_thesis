import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddGripForm from "./AddGripForm"
import DeleteGripForm from "./DeleteGripForm"
import ModifyGripForm from "./ModifyGripForm"
import GripAdminList from "./GripAdminList"

export default function GripManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Grip Management</h1>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Product List</TabsTrigger>
          <TabsTrigger value="add">Add Grip</TabsTrigger>
          <TabsTrigger value="modify">Modify Grip</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <GripAdminList />
        </TabsContent>

        <TabsContent value="add">
          <AddGripForm />
        </TabsContent>

        <TabsContent value="modify">
          <ModifyGripForm />
        </TabsContent>

        <TabsContent value="delete">
          <DeleteGripForm />
        </TabsContent>
      </Tabs>
    </div>
  )
} 