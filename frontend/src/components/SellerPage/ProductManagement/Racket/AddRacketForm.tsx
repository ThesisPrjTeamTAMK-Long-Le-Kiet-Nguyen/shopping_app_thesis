import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { addRacket } from "@/services/adminService"
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

// First, update the schema to handle arrays
const racketTypeSchema = z.object({
  type: z.string().min(1, { message: "Type variant is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  maxTension: z.string().min(1, { message: "Max tension is required" })
})

const colorSchema = z.object({
  color: z.string().min(1, { message: "Color is required" }),
  photo: z.string().url({ message: "Please enter a valid URL for the photo" }),
  types: z.array(racketTypeSchema).min(1, { message: "At least one type is required" })
})

const racketFormSchema = z.object({
  id: z.string().min(2, { message: "ID must be at least 2 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  series: z.string().min(1, { message: "Series is required" }),
  racketType: z.string().min(1, { message: "Racket type is required" }),
  flexibility: z.string().min(1, { message: "Flexibility is required" }),
  material: z.string().min(1, { message: "Material is required" }),
  balancePoint: z.string().min(1, { message: "Balance point is required" }),
  cover: z.boolean(),
  colors: z.array(colorSchema).min(1, { message: "At least one color is required" })
})

type RacketFormValues = z.infer<typeof racketFormSchema>

const DEFAULT_TYPE = { type: '', quantity: '', maxTension: '' }
const DEFAULT_COLOR = { color: '', photo: '', types: [DEFAULT_TYPE] }

export default function RacketManagement() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<RacketFormValues | null>(null)
  const [colors, setColors] = useState([DEFAULT_COLOR])

  const form = useForm<RacketFormValues>({
    resolver: zodResolver(racketFormSchema),
    defaultValues: {
      id: "",
      name: "",
      price: "",
      brand: "",
      series: "",
      racketType: "",
      flexibility: "",
      material: "",
      balancePoint: "",
      cover: false,
      colors: [DEFAULT_COLOR]
    }
  })

  async function onSubmit(data: RacketFormValues) {
    setFormData(data)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      if (!formData) return

      // Structure the data properly for the API
      const racketData = {
        ...formData,
        price: Number(formData.price),
        balancePoint: Number(formData.balancePoint),
        colors: formData.colors.map(color => ({
          color: color.color,
          photo: color.photo,
          types: color.types.map(type => ({
            type: type.type,
            quantity: Number(type.quantity),
            maxTension: type.maxTension
          }))
        }))
      }

      const response = await addRacket(racketData)
      if (response.success) {
        toast.success("Racket added successfully")
        setDialogOpen(false)
        form.reset({
          id: "",
          name: "",
          price: "",
          brand: "",
          series: "",
          racketType: "",
          flexibility: "",
          material: "",
          balancePoint: "",
          cover: false,
          colors: [DEFAULT_COLOR]
        })
        setColors([DEFAULT_COLOR])
      } else {
        toast.error(response.error || "Failed to add racket")
      }
    } catch (error) {
      toast.error("Error adding racket")
    }
  }

  const addColor = () => {
    setColors([...colors, DEFAULT_COLOR]);
    const currentColors = form.getValues().colors;
    form.setValue('colors', [...currentColors, DEFAULT_COLOR]);
  };

  const removeColor = (colorIndex: number) => {
    const newColors = colors.filter((_, i) => i !== colorIndex);
    setColors(newColors);
    form.setValue('colors', newColors);
  };

  const addType = (colorIndex: number) => {
    const newColors = [...colors];
    newColors[colorIndex].types.push(DEFAULT_TYPE);
    setColors(newColors);
    form.setValue(`colors.${colorIndex}.types`, newColors[colorIndex].types);
  };

  const removeType = (colorIndex: number, typeIndex: number) => {
    const newColors = [...colors];
    if (newColors[colorIndex].types.length > 1) {
      newColors[colorIndex].types = newColors[colorIndex].types.filter((_, i) => i !== typeIndex);
      setColors(newColors);
      form.setValue(`colors.${colorIndex}.types`, newColors[colorIndex].types);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Racket</h1>
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
                    <FormLabel>Racket ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ID of the racket" {...field} />
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
                      <Input placeholder="Racket name" {...field} />
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
                      <Input placeholder="Racket series" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="racketType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Racket Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select racket type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Head Heavy">Head Heavy</SelectItem>
                        <SelectItem value="Even Balance">Even Balance</SelectItem>
                        <SelectItem value="Head Light">Head Light</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="flexibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flexibility</FormLabel>
                    <FormControl>
                      <Input placeholder="Flexible to Extra Stiff" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input placeholder="Racket material" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="balancePoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance Point (mm)</FormLabel>
                    <FormControl>
                      <Input placeholder="xxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Includes Cover
                      </FormLabel>
                      <FormDescription>
                        Check if the racket comes with a cover
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Color and Type Sections with borders */}
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
                    <h3 className="text-lg font-medium">Types</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addType(colorIndex)}
                    >
                      Add Type
                    </Button>
                  </div>

                  {color.types.map((_, typeIndex) => (
                    <div key={`${colorIndex}-${typeIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name={`colors.${colorIndex}.types.${typeIndex}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type Variant</FormLabel>
                            <FormControl>
                              <Input placeholder="4ug5" {...field} />
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
                          name={`colors.${colorIndex}.types.${typeIndex}.maxTension`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Max Tension</FormLabel>
                              <FormControl>
                                <Input placeholder="LBS" {...field} />
                              </FormControl>
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
            Add Racket
          </Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm New Racket</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <span>Are you sure you want to add this racket? Please verify the information:</span>
                {formData && (
                  <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-1 gap-2">
                      <div><span className="font-medium">ID:</span> {formData.id}</div>
                      <div><span className="font-medium">Name:</span> {formData.name}</div>
                      <div><span className="font-medium">Price:</span> ${formData.price}</div>
                      <div><span className="font-medium">Brand:</span> {formData.brand}</div>
                      <div><span className="font-medium">Series:</span> {formData.series}</div>
                      <div><span className="font-medium">Type:</span> {formData.racketType}</div>
                      <div><span className="font-medium">Flexibility:</span> {formData.flexibility}</div>
                      <div><span className="font-medium">Material:</span> {formData.material}</div>
                      <div><span className="font-medium">Balance Point:</span> {formData.balancePoint}mm</div>
                      <div><span className="font-medium">Includes Cover:</span> {formData.cover ? "Yes" : "No"}</div>
                      {formData.colors.map((color, index) => (
                        <div key={index} className="border-t pt-2 mt-2">
                          <div><span className="font-medium">Color {index + 1}:</span> {color.color}</div>
                          <div><span className="font-medium">Photo URL:</span> {color.photo}</div>
                          {color.types.map((type, typeIndex) => (
                            <div key={`${index}-${typeIndex}`}><span className="font-medium">Type {typeIndex + 1}:</span> {type.type}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Add Racket</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


export { default as AddRacketForm } from './AddRacketForm'