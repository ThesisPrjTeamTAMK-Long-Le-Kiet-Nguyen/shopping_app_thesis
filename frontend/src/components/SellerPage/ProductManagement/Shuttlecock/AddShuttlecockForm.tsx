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
import { addShuttlecock } from "@/services/adminService"
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

const shuttlecockFormSchema = z.object({
  id: z.string().min(2, { message: "ID is required" }),
  name: z.string().min(2, { message: "Name is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  brand: z.string().min(2, { message: "Brand is required" }),
  featherType: z.string().min(2, { message: "Feather type is required" }),
  unitsPerTube: z.string().min(1, { message: "Units per tube is required" }),
  colors: z.array(z.object({
    color: z.string().min(1, { message: "Color is required" }),
    photo: z.string().url({ message: "Please enter a valid URL" }),
    types: z.array(z.object({
      type: z.string().min(1, { message: "Type is required" }),
      quantity: z.string().min(1, { message: "Quantity is required" }),
      speed: z.string().min(1, { message: "Speed is required" })
    })).min(1, { message: "At least one type is required" })
  })).min(1, { message: "At least one color is required" })
})

type ShuttlecockFormValues = z.infer<typeof shuttlecockFormSchema>

const SPEED_OPTIONS = [
  { value: "76", label: "76" },
  { value: "77", label: "77" },
  { value: "78", label: "78" },
]

export default function AddShuttlecockForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)

  const form = useForm<ShuttlecockFormValues>({
    resolver: zodResolver(shuttlecockFormSchema),
    defaultValues: {
      id: "",
      name: "",
      price: "",
      brand: "",
      featherType: "",
      unitsPerTube: "",
      colors: [{
        color: "",
        photo: "",
        types: [{ type: '', quantity: '', speed: '' }]
      }]
    }
  })

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control: form.control,
    name: "colors"
  })

  const getTypesFieldArray = (colorIndex: number) => {
    return useFieldArray({
      control: form.control,
      name: `colors.${colorIndex}.types`
    })
  }

  const addColor = () => {
    appendColor({ color: '', photo: '', types: [{ type: '', quantity: '', speed: '' }] })
  }

  const addType = (colorIndex: number) => {
    const { append } = getTypesFieldArray(colorIndex)
    append({ type: '', quantity: '', speed: '' })
  }

  const removeType = (colorIndex: number, typeIndex: number) => {
    const { remove, fields } = getTypesFieldArray(colorIndex)
    if (fields.length > 1) {
      remove(typeIndex)
    }
  }

  function onSubmit(_data: ShuttlecockFormValues) {
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      const formData = form.getValues()
      const response = await addShuttlecock({
        ...formData,
        price: Number(formData.price),
        unitsPerTube: Number(formData.unitsPerTube),
        colors: formData.colors.map(color => ({
          ...color,
          types: color.types.map(type => ({
            ...type,
            quantity: Number(type.quantity),
            speed: Number(type.speed)
          }))
        }))
      })

      if (response.success) {
        toast.success("Shuttlecock added successfully")
        setDialogOpen(false)
        form.reset()
        appendColor({ color: '', photo: '', types: [{ type: '', quantity: '', speed: '' }] })
      } else {
        toast.error("Failed to add shuttlecock")
      }
    } catch (error) {
      toast.error("Error adding shuttlecock")
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
                    <Input placeholder="ID of the Shuttlecock" {...field} />
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
                    <Input placeholder="Shuttle name" {...field} />
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
              name="featherType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feather Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Type of Feather" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitsPerTube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units per Tube</FormLabel>
                  <FormControl>
                    <Input placeholder="Number" {...field} />
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

            {colorFields.map((colorField, colorIndex) => (
              <div key={colorField.id} className="border rounded-lg p-6 space-y-4">
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
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-sm font-medium">Types</h5>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addType(colorIndex)}
                    >
                      Add Type
                    </Button>
                  </div>

                  {getTypesFieldArray(colorIndex).fields.map((typeField, typeIndex) => (
                    <div key={typeField.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name={`colors.${colorIndex}.types.${typeIndex}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                              <Input placeholder="Type" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`colors.${colorIndex}.types.${typeIndex}.quantity`}
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

                      <div className="flex items-end gap-2">
                        <FormField
                          control={form.control}
                          name={`colors.${colorIndex}.types.${typeIndex}.speed`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Speed</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select speed" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {SPEED_OPTIONS.map((option) => (
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
                        {typeIndex > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="mb-2"
                            onClick={() => removeType(colorIndex, typeIndex)}
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
          </div>

          <Button type="submit" className="w-full">Add Shuttlecock</Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Addition</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <span>Are you sure you want to add this shuttlecock?</span>

                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-1 gap-2">
                    <div><span className="font-medium">ID:</span> {form.getValues().id}</div>
                    <div><span className="font-medium">Name:</span> {form.getValues().name}</div>
                    <div><span className="font-medium">Price:</span> {form.getValues().price}</div>
                    <div><span className="font-medium">Brand:</span> {form.getValues().brand}</div>
                    <div><span className="font-medium">Feather Type:</span> {form.getValues().featherType}</div>
                    <div><span className="font-medium">Units per Tube:</span> {form.getValues().unitsPerTube}</div>
                    <div><span className="font-medium">Colors:</span></div>
                    {form.getValues().colors.map((color, index) => (
                      <div key={index} className="ml-4 border-t pt-2 mt-2">
                        <div><span className="font-medium">Color {index + 1}:</span> {color.color}</div>
                        <div><span className="font-medium">Photo:</span> {color.photo}</div>
                        <div><span className="font-medium">Types:</span></div>
                        {color.types.map((type, typeIndex) => (
                          <div key={typeIndex} className="ml-4">
                            <div><span className="font-medium">Type {typeIndex + 1}:</span> {type.type}</div>
                            <div><span className="font-medium">Quantity:</span> {type.quantity}</div>
                            <div><span className="font-medium">Speed:</span> {type.speed}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Add Shuttlecock</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}