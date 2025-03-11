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
import { addStringing } from "@/services/adminService"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STRING_TYPES = [
  { value: "High Resilience", label: "High Resilience" },
  { value: "Quick Repulsion", label: "Quick Repulsion" },
  { value: "Durability", label: "Durability" },
  { value: "Control", label: "Control" },
]

const stringingFormSchema = z.object({
  id: z.string().min(2, { message: "ID must be at least 2 characters" }),
  name: z.string().min(2, { message: "Name is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  series: z.string().min(1, { message: "Series is required" }),
  gauge: z.string().min(1, { message: "Gauge is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  photo: z.string().url({ message: "Please enter a valid URL for the photo" }),
  quantity: z.string().min(1, { message: "Quantity is required" })
})

type StringingFormValues = z.infer<typeof stringingFormSchema>

export default function AddStringingForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)

  const form = useForm<StringingFormValues>({
    resolver: zodResolver(stringingFormSchema),
    defaultValues: {
      id: "",
      name: "",
      price: "",
      brand: "",
      series: "",
      gauge: "",
      type: "",
      color: "",
      photo: "",
      quantity: ""
    }
  })

  async function onSubmit(_data: StringingFormValues) {
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      const formData = form.getValues()
      const response = await addStringing({
        id: formData.id,
        name: formData.name,
        price: Number(formData.price),
        brand: formData.brand,
        series: formData.series,
        gauge: Number(formData.gauge),
        type: formData.type,
        colors: [{
          color: formData.color,
          photo: formData.photo,
          quantity: Number(formData.quantity)
        }]
      })

      if (response.success) {
        toast.success("Stringing added successfully")
        setDialogOpen(false)
        form.reset()
      } else {
        toast.error("Failed to add stringing")
      }
    } catch (error) {
      toast.error("Error adding stringing")
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input placeholder="ID of the string" {...field} />
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
                    <Input placeholder="String name" {...field} />
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
              name="series"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Series</FormLabel>
                  <FormControl>
                    <Input placeholder="Series name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gauge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gauge (mm)</FormLabel>
                  <FormControl>
                    <Input step="mm" placeholder="mm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select string type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STRING_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Color Information</h2>
            <div className="grid grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/photo.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Add Stringing</Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Addition</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <span>Are you sure you want to add this stringing?</span>

                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-1 gap-2">
                    <div><span className="font-medium">ID:</span> {form.getValues().id}</div>
                    <div><span className="font-medium">Name:</span> {form.getValues().name}</div>
                    <div><span className="font-medium">Price:</span> ${form.getValues().price}</div>
                    <div><span className="font-medium">Brand:</span> {form.getValues().brand}</div>
                    <div><span className="font-medium">Series:</span> {form.getValues().series}</div>
                    <div><span className="font-medium">Gauge:</span> {form.getValues().gauge}</div>
                    <div><span className="font-medium">Type:</span> {form.getValues().type}</div>
                    <div><span className="font-medium">Color:</span> {form.getValues().color}</div>
                    <div><span className="font-medium">Quantity:</span> {form.getValues().quantity}</div>
                    <div><span className="font-medium">Photo URL:</span> {form.getValues().photo}</div>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Add Stringing</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}