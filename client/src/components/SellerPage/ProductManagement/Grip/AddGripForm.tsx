import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
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
import { addGrip } from "@/services/adminService"
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

const gripFormSchema = z.object({
  id: z.string().min(2, { message: "ID is required" }),
  name: z.string().min(2, { message: "Name is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  brand: z.string().min(2, { message: "Brand is required" }),
  thickness: z.string().min(1, { message: "Thickness is required" }),
  length: z.string().min(1, { message: "Length is required" }),
  colors: z.array(z.object({
    color: z.string().min(1, { message: "Color is required" }),
    photo: z.string().url({ message: "Please enter a valid URL" }),
    quantity: z.string().min(1, { message: "Quantity is required" })
  })).min(1, { message: "At least one color is required" })
})

type GripFormValues = z.infer<typeof gripFormSchema>

export default function AddGripForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)

  const form = useForm<GripFormValues>({
    resolver: zodResolver(gripFormSchema),
    defaultValues: {
      id: "",
      name: "",
      price: "",
      brand: "",
      thickness: "",
      length: "",
      colors: [{ color: '', photo: '', quantity: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "colors"
  })

  const addColor = () => {
    append({ color: '', photo: '', quantity: '' })
  }

  const removeColor = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  function onSubmit(_data: GripFormValues) {
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      const formData = form.getValues()
      const response = await addGrip({
        ...formData,
        price: Number(formData.price),
        thickness: Number(formData.thickness),
        length: Number(formData.length),
        colors: formData.colors.map(color => ({
          ...color,
          quantity: Number(color.quantity),
          types: [] // Ensure types array is included but empty
        }))
      })

      if (response.success) {
        toast.success("Grip added successfully")
        setDialogOpen(false)
        form.reset()
      } else {
        toast.error("Failed to add grip")
      }
    } catch (error) {
      toast.error("Error adding grip")
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input placeholder="ID of the Grip" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Grip name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="€" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Yonex, Victor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thickness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thickness (mm)</FormLabel>
                  <FormControl>
                    <Input placeholder="Thickness" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (mm)</FormLabel>
                  <FormControl>
                    <Input placeholder="Length" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Colors</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addColor}
              >
                Add Color
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Color {index + 1}</h4>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeColor(index)}
                    >
                      Remove Color
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`colors.${index}.color`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`colors.${index}.photo`}
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
                    name={`colors.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full">Add Grip</Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Adding New Grip</AlertDialogTitle>
            <AlertDialogDescription>
              {form.getValues().name && `Do you want to add "${form.getValues().name}"?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100">Re-check Details</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Confirm Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}