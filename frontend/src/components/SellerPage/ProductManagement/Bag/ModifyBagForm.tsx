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
import { addBagColor } from "@/services/adminService"
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

const colorAddSchema = z.object({
  bagId: z.string().min(2, { message: "Bag ID is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  photo: z.string().url({ message: "Please enter a valid URL for the photo" }),
  quantity: z.string().min(1, { message: "Quantity is required" })
})

type ColorAddFormValues = z.infer<typeof colorAddSchema>

export default function ModifyBagForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)

  const form = useForm<ColorAddFormValues>({
    resolver: zodResolver(colorAddSchema),
    defaultValues: {
      bagId: '',
      color: '',
      photo: '',
      quantity: ''
    }
  })

  function onSubmit(_data: ColorAddFormValues) {
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      const formData = form.getValues()
      const response = await addBagColor(formData.bagId, {
        color: formData.color,
        photo: formData.photo,
        quantity: Number(formData.quantity)
      })

      if (response.success) {
        toast.success("Color added successfully")
        setDialogOpen(false)
        form.reset()
      } else {
        toast.error("Failed to add color")
      }
    } catch (error) {
      toast.error("Error adding color")
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="bagId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bag ID</FormLabel>
                <FormControl>
                  <Input placeholder="ID of the bag" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border rounded-lg p-6 space-y-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Addition</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add this color?

              <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                <p><span className="font-medium">Bag ID:</span> {form.getValues().bagId}</p>
                <p><span className="font-medium">Color:</span> {form.getValues().color}</p>
                <p><span className="font-medium">Photo URL:</span> {form.getValues().photo}</p>
                <p><span className="font-medium">Quantity:</span> {form.getValues().quantity}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Add Color</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 