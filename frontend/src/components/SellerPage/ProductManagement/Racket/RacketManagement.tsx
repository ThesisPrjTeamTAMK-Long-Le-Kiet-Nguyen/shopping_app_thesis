import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddRacketForm } from "./AddRacketForm"
import ModifyRacketForm from "./ModifyRacketForm"
import DeleteRacketForm from "./DeleteRacketForm"

export default function RacketManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Racket Management</h1>

      <Tabs defaultValue="add" className="space-y-4">
        <TabsList>
          <TabsTrigger value="add">Add Racket</TabsTrigger>
          <TabsTrigger value="modify">Modify Racket</TabsTrigger>
          <TabsTrigger value="delete">Delete Racket</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <AddRacketForm />
        </TabsContent>

        <TabsContent value="modify">
          <ModifyRacketForm />
        </TabsContent>

        <TabsContent value="delete">
          <DeleteRacketForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}