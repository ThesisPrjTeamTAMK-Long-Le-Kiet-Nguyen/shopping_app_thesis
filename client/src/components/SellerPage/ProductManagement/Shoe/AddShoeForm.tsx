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
import { addShoe } from "@/services/adminService"
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
import { ShoeRequest } from "@/types"

// Schema for shoe types (sizes)
const shoeTypeSchema = z.object({
  size: z.string().min(1, { message: "Size is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" })
})

const colorSchema = z.object({
  color: z.string().min(1, { message: "Color is required" }),
  photo: z.string().url({ message: "Please enter a valid URL for the photo" }),
  types: z.array(shoeTypeSchema).min(1, { message: "At least one size is required" })
})

const shoeFormSchema = z.object({
  id: z.string().min(2, { message: "ID must be at least 2 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  series: z.string().min(1, { message: "Series is required" }),
  midsole: z.string().min(1, { message: "Midsole material is required" }),
  outsole: z.string().min(1, { message: "Outsole material is required" }),
  colors: z.array(colorSchema).min(1, { message: "At least one color is required" })
})

type ShoeFormValues = z.infer<typeof shoeFormSchema>

const DEFAULT_TYPE = { size: '', quantity: '' }
const DEFAULT_COLOR = { color: '', photo: '', types: [DEFAULT_TYPE] }

export default function AddShoeForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ShoeFormValues | null>(null)
  const [colors, setColors] = useState([DEFAULT_COLOR])

  const form = useForm<ShoeFormValues>({
    resolver: zodResolver(shoeFormSchema),
    defaultValues: {
      id: "",
      name: "",
      price: "",
      brand: "",
      series: "",
      midsole: "",
      outsole: "",
      colors: [DEFAULT_COLOR]
    }
  })

  async function onSubmit(data: ShoeFormValues) {
    setFormData(data)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      if (!formData) return

      const shoeData: ShoeRequest = {
        ...formData,
        price: Number(formData.price),
        colors: formData.colors.map(color => ({
          color: color.color,
          photo: color.photo,
          types: color.types.map(type => ({
            size: type.size,
            quantity: Number(type.quantity)
          }))
        }))
      }

      const response = await addShoe(shoeData)
      if (response.success) {
        toast.success("Shoe added successfully")
        setDialogOpen(false)
        // Reset both form and state
        form.reset({
          id: "",
          name: "",
          price: "",
          brand: "",
          series: "",
          midsole: "",
          outsole: "",
          colors: [DEFAULT_COLOR]
        })
        setColors([DEFAULT_COLOR])
      } else {
        toast.error(response.error || "Failed to add shoe")
      }
    } catch (error) {
      toast.error("Error adding shoe")
    }
  }

  const addColor = () => {
    const newColors = [...colors, DEFAULT_COLOR]
    setColors(newColors)
    form.setValue('colors', newColors)
  }

  const removeColor = (colorIndex: number) => {
    const newColors = colors.filter((_, i) => i !== colorIndex)
    setColors(newColors)
    form.setValue('colors', newColors)
  }

  const addSize = (colorIndex: number) => {
    const newColors = [...colors]
    newColors[colorIndex].types.push(DEFAULT_TYPE)
    setColors(newColors)
    form.setValue(`colors.${colorIndex}.types`, newColors[colorIndex].types)
  }

  const removeSize = (colorIndex: number, sizeIndex: number) => {
    const newColors = [...colors]
    if (newColors[colorIndex].types.length > 1) {
      newColors[colorIndex].types = newColors[colorIndex].types.filter((_, i) => i !== sizeIndex)
      setColors(newColors)
      form.setValue(`colors.${colorIndex}.types`, newColors[colorIndex].types)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Shoe</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shoe ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ID of the shoe" {...field} />
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
                      <Input placeholder="Shoe name" {...field} />
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
            </div>

            {/* Specifications */}
            <div className="space-y-4">
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
                      <Input placeholder="Shoe series" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="midsole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Midsole</FormLabel>
                    <FormControl>
                      <Input placeholder="Midsole material" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outsole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outsole</FormLabel>
                    <FormControl>
                      <Input placeholder="Outsole material" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Color and Size Sections */}
          <div className="space-y-6">
            {colors.map((color, colorIndex) => (
              <div key={colorIndex} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Color Information #{colorIndex + 1}</h2>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name={`colors.${colorIndex}.color`}
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
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Sizes</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSize(colorIndex)}
                    >
                      Add Size
                    </Button>
                  </div>

                  {color.types.map((_, sizeIndex) => (
                    <div key={sizeIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name={`colors.${colorIndex}.types.${sizeIndex}.size`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size</FormLabel>
                            <FormControl>
                              <Input placeholder="Europe Size" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end gap-2">
                        <FormField
                          control={form.control}
                          name={`colors.${colorIndex}.types.${sizeIndex}.quantity`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input placeholder="Number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {sizeIndex > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="mb-2"
                            onClick={() => removeSize(colorIndex, sizeIndex)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addColor}
            >
              Add Another Color
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Shoe
          </Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Adding New Shoe</AlertDialogTitle>
            <AlertDialogDescription>
              {formData && `Do you want to add "${formData.name}"?`}
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

export { default as AddShoeForm } from './AddShoeForm'