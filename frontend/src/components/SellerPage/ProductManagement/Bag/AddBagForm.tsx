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
import { addBag } from "@/services/adminService"
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

const bagFormSchema = z.object({
  id: z.string().min(2, { message: "ID must be at least 2 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  type: z.string().min(1, { message: "Bag type is required" }),
  size: z.string().min(1, { message: "Size is required" }),
  colors: z.array(z.object({
    color: z.string().min(1, { message: "Color is required" }),
    photo: z.string().url({ message: "Please enter a valid URL for the photo" }),
    quantity: z.string().min(1, { message: "Quantity is required" })
  })).min(1, { message: "At least one color is required" })
})

const BAG_TYPES = [
  { value: "Backpack", label: "Backpack" },
  { value: "Rectangular Racket Bag", label: "Rectangular Racket Bag" },
  { value: "6-Piece Racket Bags", label: "6-Piece Racket Bags" },
  { value: "9-Piece Racket Bags", label: "9-Piece Racket Bags" },
]

type BagFormValues = z.infer<typeof bagFormSchema>

export default function AddBagForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [colors, setColors] = useState([{ color: '', photo: '', quantity: '' }])

  const form = useForm<BagFormValues>({
    resolver: zodResolver(bagFormSchema),
    defaultValues: {
      id: "",
      name: "",
      price: "",
      brand: "",
      type: "",
      size: "",
      colors: [{ color: '', photo: '', quantity: '' }]
    }
  })

  const addColor = () => {
    setColors([...colors, { color: '', photo: '', quantity: '' }])
  }

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  function onSubmit(_data: BagFormValues) {
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      const formData = form.getValues()
      const response = await addBag({
        ...formData,
        price: Number(formData.price),
        colors: formData.colors.map(color => ({
          ...color,
          quantity: Number(color.quantity)
        }))
      })

      if (response.success) {
        toast.success("Bag added successfully")
        setDialogOpen(false)
        form.reset()
        setColors([{ color: '', photo: '', quantity: '' }])
      } else {
        toast.error("Failed to add bag")
      }
    } catch (error) {
      toast.error("Error adding bag")
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
                    <Input placeholder="ID of the bag" {...field} />
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
                    <Input placeholder="Name of the Bag" {...field} />
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bag Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bag type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BAG_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (L x W x H)</FormLabel>
                  <FormControl>
                    <Input placeholder="L x W x H cm" {...field} />
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

            {colors.map((_, colorIndex) => (
              <div key={colorIndex} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Color {colorIndex + 1}</h4>
                  {colorIndex > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeColor(colorIndex)}
                    >
                      Remove Color
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`colors.${colorIndex}.color`}
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
                    name={`colors.${colorIndex}.photo`}
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
                    name={`colors.${colorIndex}.quantity`}
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
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full">Add Bag</Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Addition</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add this bag?

              <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                <p><span className="font-medium">ID:</span> {form.getValues().id}</p>
                <p><span className="font-medium">Name:</span> {form.getValues().name}</p>
                <p><span className="font-medium">Price:</span> {form.getValues().price}</p>
                <p><span className="font-medium">Brand:</span> {form.getValues().brand}</p>
                <p><span className="font-medium">Type:</span> {form.getValues().type}</p>
                <p><span className="font-medium">Size:</span> {form.getValues().size}</p>
                <p><span className="font-medium">Colors:</span></p>
                {form.getValues().colors.map((color, index) => (
                  <div key={index} className="ml-4">
                    <p><span className="font-medium">Color {index + 1}:</span> {color.color}</p>
                    <p><span className="font-medium">Photo:</span> {color.photo}</p>
                    <p><span className="font-medium">Quantity:</span> {color.quantity}</p>
                  </div>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Add Bag</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 