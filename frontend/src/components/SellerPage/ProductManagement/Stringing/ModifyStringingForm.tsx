import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { addStringingColor, updateProductQuantity } from "@/services/adminService"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const colorAddSchema = z.object({
  stringingId: z.string().min(2, { message: "Stringing ID is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  photo: z.string().url({ message: "Please enter a valid URL for the photo" }),
  quantity: z.string().min(1, { message: "Quantity is required" })
})

const quantityUpdateSchema = z.object({
  stringingId: z.string().min(2, { message: "Stringing ID is required" }),
  colorId: z.string().min(1, { message: "Color ID is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" })
})

type ColorAddFormValues = z.infer<typeof colorAddSchema>
type QuantityUpdateFormValues = z.infer<typeof quantityUpdateSchema>

export default function ModifyStringingForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<{ title: string; type: "add" | "update" }>({
    title: "Add Color",
    type: "add"
  })

  const addColorForm = useForm<ColorAddFormValues>({
    resolver: zodResolver(colorAddSchema),
    defaultValues: {
      stringingId: '',
      color: '',
      photo: '',
      quantity: ''
    }
  })

  const updateQuantityForm = useForm<QuantityUpdateFormValues>({
    resolver: zodResolver(quantityUpdateSchema),
    defaultValues: {
      stringingId: '',
      colorId: '',
      quantity: ''
    }
  })

  function onAddColorSubmit(_data: ColorAddFormValues) {
    setDialogContent({ title: "Add Color", type: "add" })
    setDialogOpen(true)
  }

  function onUpdateQuantitySubmit(_data: QuantityUpdateFormValues) {
    setDialogContent({ title: "Update Quantity", type: "update" })
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      if (dialogContent.type === "add") {
        const colorData = addColorForm.getValues()
        const response = await addStringingColor(colorData.stringingId, {
          color: colorData.color,
          photo: colorData.photo,
          quantity: Number(colorData.quantity)
        })

        if (response.success) {
          toast.success("Stringing color added successfully")
          addColorForm.reset()
        } else {
          toast.error("Failed to add color")
        }
      } else {
        const quantityData = updateQuantityForm.getValues()
        const response = await updateProductQuantity(
          "stringings",
          quantityData.stringingId,
          {
            colorId: quantityData.colorId,
            quantity: Number(quantityData.quantity)
          }
        )

        if (response.success) {
          toast.success("Quantity updated successfully")
          updateQuantityForm.reset()
        } else {
          toast.error("Failed to update quantity")
        }
      }
      setDialogOpen(false)
    } catch (error) {
      toast.error(dialogContent.type === "add" ? "Error adding color" : "Error updating quantity")
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="add-color" className="w-full" onValueChange={(value) => {
        if (value === "add-color") {
          setDialogContent({ title: "Add Color", type: "add" });
          addColorForm.reset();
        } else {
          setDialogContent({ title: "Update Quantity", type: "update" });
          updateQuantityForm.reset();
        }
      }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add-color">Add Color</TabsTrigger>
          <TabsTrigger value="update-quantity">Update Quantity</TabsTrigger>
        </TabsList>

        <TabsContent value="add-color">
          <Form {...addColorForm}>
            <form onSubmit={addColorForm.handleSubmit(onAddColorSubmit)} className="space-y-4">
              <FormField
                control={addColorForm.control}
                name="stringingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stringing ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ID of the String" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border rounded-lg p-6 space-y-4">
                <FormField
                  control={addColorForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addColorForm.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/photo.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addColorForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">Add Color</Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="update-quantity">
          <Form {...updateQuantityForm}>
            <form onSubmit={updateQuantityForm.handleSubmit(onUpdateQuantitySubmit)} className="space-y-4">
              <FormField
                control={updateQuantityForm.control}
                name="stringingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stringing ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ID of the String" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border rounded-lg p-6 space-y-4">
                <FormField
                  control={updateQuantityForm.control}
                  name="colorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color ID</FormLabel>
                      <FormControl>
                        <Input placeholder="ID of the color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={updateQuantityForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">Update Quantity</Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <span>Are you sure you want to {dialogContent.type === "add" ? "add this new color" : "update the quantity"}?</span>

                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-1 gap-2">
                    {dialogContent.type === "add" ? (
                      <>
                        <div><span className="font-medium">Stringing ID:</span> {addColorForm.getValues().stringingId}</div>
                        <div><span className="font-medium">Color:</span> {addColorForm.getValues().color}</div>
                        <div><span className="font-medium">Photo URL:</span> {addColorForm.getValues().photo}</div>
                        <div><span className="font-medium">Quantity:</span> {addColorForm.getValues().quantity}</div>
                      </>
                    ) : (
                      <>
                        <div><span className="font-medium">Stringing ID:</span> {updateQuantityForm.getValues().stringingId}</div>
                        <div><span className="font-medium">Color ID:</span> {updateQuantityForm.getValues().colorId}</div>
                        <div><span className="font-medium">New Quantity:</span> {updateQuantityForm.getValues().quantity}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {dialogContent.type === "add" ? "Add Color" : "Update Quantity"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}