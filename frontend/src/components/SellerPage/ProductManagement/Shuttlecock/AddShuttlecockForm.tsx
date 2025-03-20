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

const DEFAULT_TYPE = { type: '', quantity: '', speed: '' }
const DEFAULT_COLOR = { color: '', photo: '', types: [DEFAULT_TYPE] }

export default function AddShuttlecockForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [colors, setColors] = useState([DEFAULT_COLOR])

  const form = useForm<ShuttlecockFormValues>({
    resolver: zodResolver(shuttlecockFormSchema),
    defaultValues: {
      id: "",
      name: "",
      price: "",
      brand: "",
      featherType: "",
      unitsPerTube: "",
      colors: [DEFAULT_COLOR]
    }
  })

  function onSubmit(_data: ShuttlecockFormValues) {
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      const formData = form.getValues();
      
      // Transform the data to ensure types array is properly handled
      const transformedData = {
        ...formData,
        price: Number(formData.price),
        unitsPerTube: Number(formData.unitsPerTube),
        colors: formData.colors.map(color => ({
          color: color.color,
          photo: color.photo,
          types: color.types.map(type => ({
            type: type.type,
            quantity: Number(type.quantity),
            speed: Number(type.speed)
          }))
        }))
      };

      // Validate numbers
      if (isNaN(transformedData.price) || isNaN(transformedData.unitsPerTube)) {
        toast.error("Invalid number format for price or units per tube");
        return;
      }

      // Validate colors and types
      for (const [colorIndex, color] of transformedData.colors.entries()) {
        if (!color.color || !color.photo) {
          toast.error(`Color ${colorIndex + 1} is missing required fields`);
          return;
        }

        for (const [typeIndex, type] of color.types.entries()) {
          if (!type.type || isNaN(type.quantity) || isNaN(type.speed)) {
            toast.error(`Invalid data in color ${colorIndex + 1}, type ${typeIndex + 1}`);
            return;
          }
        }
      }

      const response = await addShuttlecock(transformedData);

      if (response.success) {
        toast.success("Shuttlecock added successfully");
        setDialogOpen(false);
        form.reset({
          id: "",
          name: "",
          price: "",
          brand: "",
          featherType: "",
          unitsPerTube: "",
          colors: [DEFAULT_COLOR]
        });
        setColors([DEFAULT_COLOR]);
      } else {
        toast.error(response.error || "Failed to add shuttlecock");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

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

            {colors.map((color, colorIndex) => (
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

                  {color.types.map((_, typeIndex) => (
                    <div key={`${colorIndex}-${typeIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value || ''}
                              >
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
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Adding New Shuttlecock</AlertDialogTitle>
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