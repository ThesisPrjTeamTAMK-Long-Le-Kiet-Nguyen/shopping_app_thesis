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
import { addRacketColor, addRacketType } from "@/services/adminService"
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

// Schema for adding a new type to an existing color
const typeAddSchema = z.object({
  racketId: z.string().min(2, { message: "Racket ID is required" }),
  colorId: z.string().min(2, { message: "Color ID is required" }),
  type: z.string().min(1, { message: "Type variant is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  maxTension: z.string().min(1, { message: "Max tension is required" })
})

// Schema for adding a new color with types
const colorAddSchema = z.object({
  racketId: z.string().min(2, { message: "Racket ID is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  photo: z.string().url({ message: "Please enter a valid URL for the photo" }),
  types: z.array(z.object({
    type: z.string().min(1, { message: "Type variant is required" }),
    quantity: z.string().min(1, { message: "Quantity is required" }),
    maxTension: z.string().min(1, { message: "Max tension is required" })
  })).min(1, { message: "At least one type is required" })
})

type TypeAddFormValues = z.infer<typeof typeAddSchema>
type ColorAddFormValues = z.infer<typeof colorAddSchema>

export default function ModifyRacketForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [modifyType, setModifyType] = useState<'color' | 'type'>('color')
  const [types, setTypes] = useState([{ type: '', quantity: '', maxTension: '' }])

  const colorForm = useForm<ColorAddFormValues>({
    resolver: zodResolver(colorAddSchema),
    defaultValues: {
      racketId: '',
      color: '',
      photo: '',
      types: [{ type: '', quantity: '', maxTension: '' }]
    }
  })

  const typeForm = useForm<TypeAddFormValues>({
    resolver: zodResolver(typeAddSchema),
    defaultValues: {
      racketId: '',
      colorId: '',
      type: '',
      quantity: '',
      maxTension: ''
    }
  })

  const addType = () => {
    setTypes([...types, { type: '', quantity: '', maxTension: '' }])
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
        response = await addRacketColor(colorData.racketId, {
          color: colorData.color,
          photo: colorData.photo,
          types: colorData.types.map(t => ({
            type: t.type,
            quantity: Number(t.quantity),
            maxTension: t.maxTension
          }))
        })
      } else {
        const typeData = typeForm.getValues()
        response = await addRacketType(
          typeData.racketId,
          typeData.colorId,
          {
            type: typeData.type,
            quantity: Number(typeData.quantity),
            maxTension: typeData.maxTension
          }
        )
      }

      if (response.success) {
        toast.success(`Racket ${modifyType} added successfully`)
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
              name="racketId"
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
                          <FormLabel>Type Variant</FormLabel>
                          <FormControl>
                            <Input placeholder="4ug5" {...field} />
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
                        name={`types.${index}.maxTension`}
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
              name="racketId"
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
              control={typeForm.control}
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

            <div className="border rounded-lg p-6 space-y-4">
              <FormField
                control={typeForm.control}
                name="type"
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
                name="maxTension"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tension</FormLabel>
                    <FormControl>
                      <Input placeholder="LBS" {...field} />
                    </FormControl>
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
            <AlertDialogDescription>
              Are you sure you want to add this new {modifyType}?

              {modifyType === 'color' ? (
                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <p><span className="font-medium">Racket ID:</span> {colorForm.getValues().racketId}</p>
                  <p><span className="font-medium">Color:</span> {colorForm.getValues().color}</p>
                  <p><span className="font-medium">Photo URL:</span> {colorForm.getValues().photo}</p>
                  {colorForm.getValues().types.map((type, index) => (
                    <div key={index}>
                      <p><span className="font-medium">Type {index + 1}:</span> {type.type}</p>
                      <p><span className="font-medium">Quantity:</span> {type.quantity}</p>
                      <p><span className="font-medium">Max Tension:</span> {type.maxTension}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <p><span className="font-medium">Racket ID:</span> {typeForm.getValues().racketId}</p>
                  <p><span className="font-medium">Color ID:</span> {typeForm.getValues().colorId}</p>
                  <p><span className="font-medium">Type:</span> {typeForm.getValues().type}</p>
                  <p><span className="font-medium">Quantity:</span> {typeForm.getValues().quantity}</p>
                  <p><span className="font-medium">Max Tension:</span> {typeForm.getValues().maxTension}</p>
                </div>
              )}
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