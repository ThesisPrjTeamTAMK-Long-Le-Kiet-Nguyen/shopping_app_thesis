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
import { addShuttlecockColor, addShuttlecockType } from "@/services/adminService"
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

// Schema for adding a new type to an existing color
const typeAddSchema = z.object({
  shuttlecockId: z.string().min(2, { message: "Shuttlecock ID is required" }),
  colorId: z.string().min(2, { message: "Color ID is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  speed: z.string().min(1, { message: "Speed is required" })
})

// Schema for adding a new color with types
const colorAddSchema = z.object({
  shuttlecockId: z.string().min(2, { message: "Shuttlecock ID is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  photo: z.string().url({ message: "Please enter a valid URL for the photo" }),
  types: z.array(z.object({
    type: z.string().min(1, { message: "Type is required" }),
    quantity: z.string().min(1, { message: "Quantity is required" }),
    speed: z.string().min(1, { message: "Speed is required" })
  })).min(1, { message: "At least one type is required" })
})

type TypeAddFormValues = z.infer<typeof typeAddSchema>
type ColorAddFormValues = z.infer<typeof colorAddSchema>

const SPEED_OPTIONS = [
  { value: "76", label: "76" },
  { value: "77", label: "77" },
  { value: "78", label: "78" },
]

export default function ModifyShuttlecockForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [modifyType, setModifyType] = useState<'color' | 'type'>('color')
  const [types, setTypes] = useState([{ type: '', quantity: '', speed: '' }])

  const colorForm = useForm<ColorAddFormValues>({
    resolver: zodResolver(colorAddSchema),
    defaultValues: {
      shuttlecockId: '',
      color: '',
      photo: '',
      types: [{ type: '', quantity: '', speed: '' }]
    }
  })

  const typeForm = useForm<TypeAddFormValues>({
    resolver: zodResolver(typeAddSchema),
    defaultValues: {
      shuttlecockId: '',
      colorId: '',
      type: '',
      quantity: '',
      speed: ''
    }
  })

  const addType = () => {
    setTypes([...types, { type: '', quantity: '', speed: '' }])
  }

  const removeType = (index: number) => {
    setTypes(types.filter((_, i) => i !== index))
  }

  async function onSubmit(_data: ColorAddFormValues | TypeAddFormValues) {
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      let response;
      if (modifyType === 'color') {
        const colorData = colorForm.getValues()
        response = await addShuttlecockColor(colorData.shuttlecockId, {
          color: colorData.color,
          photo: colorData.photo,
          types: colorData.types.map(t => ({
            type: t.type,
            quantity: Number(t.quantity),
            speed: Number(t.speed)
          }))
        })
      } else {
        const typeData = typeForm.getValues()
        response = await addShuttlecockType(
          typeData.shuttlecockId,
          typeData.colorId,
          {
            type: typeData.type,
            quantity: Number(typeData.quantity),
            speed: Number(typeData.speed)
          }
        )
      }

      if (response.success) {
        toast.success(`Shuttlecock ${modifyType} added successfully`)
        setDialogOpen(false)
        modifyType === 'color' ? colorForm.reset() : typeForm.reset()
      } else {
        toast.error(`Failed to add ${modifyType}`)
      }
    } catch (error) {
      toast.error(`Error adding ${modifyType}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Button
          variant={modifyType === 'color' ? "default" : "outline"}
          onClick={() => setModifyType('color')}
        >
          Add New Color
        </Button>
        <Button
          variant={modifyType === 'type' ? "default" : "outline"}
          onClick={() => setModifyType('type')}
        >
          Add New Type
        </Button>
      </div>

      {modifyType === 'color' ? (
        <Form {...colorForm}>
          <form onSubmit={colorForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={colorForm.control}
              name="shuttlecockId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shuttlecock ID</FormLabel>
                  <FormControl>
                    <Input placeholder="ID of the Shuttle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border rounded-lg p-6 space-y-4">
              <FormField
                control={colorForm.control}
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
                control={colorForm.control}
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

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Types</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addType}
                  >
                    Add Type
                  </Button>
                </div>

                {types.map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={colorForm.control}
                      name={`types.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Shuttle Type" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={colorForm.control}
                      name={`types.${index}.quantity`}
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
                        control={colorForm.control}
                        name={`types.${index}.speed`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Speed</FormLabel>
                            <FormControl>
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="mb-2"
                          onClick={() => removeType(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">Add Color</Button>
          </form>
        </Form>
      ) : (
        <Form {...typeForm}>
          <form onSubmit={typeForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={typeForm.control}
              name="shuttlecockId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shuttlecock ID</FormLabel>
                  <FormControl>
                    <Input placeholder="ID of the shuttle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={typeForm.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color ID</FormLabel>
                  <FormControl>
                    <Input placeholder="color-id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border rounded-lg p-6 space-y-4">
              <FormField
                control={typeForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Shuttle Type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={typeForm.control}
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
                control={typeForm.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
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
            </div>

            <Button type="submit" className="w-full">Add Type</Button>
          </form>
        </Form>
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Addition</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <span>Are you sure you want to add this new {modifyType}?</span>

                {modifyType === 'color' ? (
                  <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-1 gap-2">
                      <div><span className="font-medium">Shuttlecock ID:</span> {colorForm.getValues().shuttlecockId}</div>
                      <div><span className="font-medium">Color:</span> {colorForm.getValues().color}</div>
                      <div><span className="font-medium">Photo URL:</span> {colorForm.getValues().photo}</div>
                      {colorForm.getValues().types.map((type, index) => (
                        <div key={index} className="border-t pt-2 mt-2">
                          <div><span className="font-medium">Type {index + 1}:</span> {type.type}</div>
                          <div><span className="font-medium">Quantity:</span> {type.quantity}</div>
                          <div><span className="font-medium">Speed:</span> {type.speed}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-1 gap-2">
                      <div><span className="font-medium">Shuttlecock ID:</span> {typeForm.getValues().shuttlecockId}</div>
                      <div><span className="font-medium">Color ID:</span> {typeForm.getValues().colorId}</div>
                      <div><span className="font-medium">Type:</span> {typeForm.getValues().type}</div>
                      <div><span className="font-medium">Quantity:</span> {typeForm.getValues().quantity}</div>
                      <div><span className="font-medium">Speed:</span> {typeForm.getValues().speed}</div>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Add {modifyType}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}