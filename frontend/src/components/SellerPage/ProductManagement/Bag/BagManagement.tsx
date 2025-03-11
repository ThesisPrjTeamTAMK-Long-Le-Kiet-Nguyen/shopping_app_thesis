import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddBagForm from "./AddBagForm"
import ModifyBagForm from "./ModifyBagForm"
import DeleteBagForm from "./DeleteBagForm"

const BagManagement = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Bag Management</h1>
      
      <Tabs defaultValue="add" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Add Bag</TabsTrigger>
          <TabsTrigger value="modify">Modify Bag</TabsTrigger>
          <TabsTrigger value="delete">Delete Bag</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <AddBagForm />
        </TabsContent>

        <TabsContent value="modify" className="space-y-4">
          <ModifyBagForm />
        </TabsContent>

        <TabsContent value="delete" className="space-y-4">
          <DeleteBagForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BagManagement 