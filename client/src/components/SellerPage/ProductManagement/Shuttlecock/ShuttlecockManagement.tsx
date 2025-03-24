import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddShuttlecockForm from "./AddShuttlecockForm"
import ModifyShuttlecockForm from "./ModifyShuttlecockForm"
import DeleteShuttlecockForm from "./DeleteShuttlecockForm"
import ShuttlecockAdminList from "./ShuttlecockAdminList"

const ShuttlecockManagement = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shuttlecock Management</h1>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Product List</TabsTrigger>
          <TabsTrigger value="add">Add Shuttlecock</TabsTrigger>
          <TabsTrigger value="modify">Modify Shuttlecock</TabsTrigger>
          <TabsTrigger value="delete">Delete Shuttlecock</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ShuttlecockAdminList />
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <AddShuttlecockForm />
        </TabsContent>

        <TabsContent value="modify" className="space-y-4">
          <ModifyShuttlecockForm />
        </TabsContent>

        <TabsContent value="delete" className="space-y-4">
          <DeleteShuttlecockForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ShuttlecockManagement 