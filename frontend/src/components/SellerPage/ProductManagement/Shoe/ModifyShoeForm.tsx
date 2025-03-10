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
import { addShoeColor, addShoeSize } from "@/services/adminService"
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

// Schema for adding a new size to an existing color
const sizeAddSchema = z.object({
  shoeId: z.string().min(2, { message: "Shoe ID is required" }),
  colorId: z.string().min(2, { message: "Color ID is required" }),
  size: z.string().min(1, { message: "Size is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" })
})

// Schema for adding a new color with sizes
const colorAddSchema = z.object({
  shoeId: z.string().min(2, { message: "Shoe ID is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  photo: z.string().url({ message: "Please enter a valid URL for the photo" }),
  types: z.array(z.object({
    size: z.string().min(1, { message: "Size is required" }),
    quantity: z.string().min(1, { message: "Quantity is required" })
  })).min(1, { message: "At least one size is required" })
})

type SizeAddFormValues = z.infer<typeof sizeAddSchema>
type ColorAddFormValues = z.infer<typeof colorAddSchema>

export default function ModifyShoeForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [modifyType, setModifyType] = useState<'color' | 'size'>('color')
  const [sizes, setSizes] = useState([{ size: '', quantity: '' }])

  const colorForm = useForm<ColorAddFormValues>({
    resolver: zodResolver(colorAddSchema),
    defaultValues: {
      shoeId: '',
      color: '',
      photo: '',
      types: [{ size: '', quantity: '' }]
    }
  })

  const sizeForm = useForm<SizeAddFormValues>({
    resolver: zodResolver(sizeAddSchema),
    defaultValues: {
      shoeId: '',
      colorId: '',
      size: '',
      quantity: ''
    }
  })

  const addSize = () => {
    setSizes([...sizes, { size: '', quantity: '' }])
  }

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index))
  }

  async function onSubmit(_data: ColorAddFormValues | SizeAddFormValues) {
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      let response;
      if (modifyType === 'color') {
        const colorData = colorForm.getValues()
        response = await addShoeColor(colorData.shoeId, {
          color: colorData.color,
          photo: colorData.photo,
          types: colorData.types.map(t => ({
            size: t.size,
            quantity: Number(t.quantity)
          }))
        })
      } else {
        const sizeData = sizeForm.getValues()
        response = await addShoeSize(
          sizeData.shoeId,
          sizeData.colorId,
          {
            size: sizeData.size,
            quantity: Number(sizeData.quantity)
          }
        )
      }

      if (response.success) {
        toast.success(`Shoe ${modifyType} added successfully`)
        setDialogOpen(false)
        modifyType === 'color' ? colorForm.reset() : sizeForm.reset()
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
          variant={modifyType === 'size' ? "default" : "outline"}
          onClick={() => setModifyType('size')}
        >
          Add New Size
        </Button>
      </div>

      {modifyType === 'color' ? (
        <Form {...colorForm}>
          <form onSubmit={colorForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={colorForm.control}
              name="shoeId"
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

            <div className="border rounded-lg p-6 space-y-4">
              <FormField
                control={colorForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Color name" {...field} />
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
                  <h3 className="text-lg font-medium">Sizes</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSize}
                  >
                    Add Size
                  </Button>
                </div>

                {sizes.map((_, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={colorForm.control}
                      name={`types.${index}.size`}
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
                        control={colorForm.control}
                        name={`types.${index}.quantity`}
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
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="mb-2"
                          onClick={() => removeSize(index)}
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
        <Form {...sizeForm}>
          <form onSubmit={sizeForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={sizeForm.control}
              name="shoeId"
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
              control={sizeForm.control}
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
                control={sizeForm.control}
                name="size"
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

              <FormField
                control={sizeForm.control}
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

            <Button type="submit" className="w-full">Add Size</Button>
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
                  <p><span className="font-medium">Shoe ID:</span> {colorForm.getValues().shoeId}</p>
                  <p><span className="font-medium">Color:</span> {colorForm.getValues().color}</p>
                  <p><span className="font-medium">Photo URL:</span> {colorForm.getValues().photo}</p>
                  {colorForm.getValues().types.map((type, index) => (
                    <div key={index}>
                      <p><span className="font-medium">Size {index + 1}:</span> {type.size}</p>
                      <p><span className="font-medium">Quantity:</span> {type.quantity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <p><span className="font-medium">Shoe ID:</span> {sizeForm.getValues().shoeId}</p>
                  <p><span className="font-medium">Color ID:</span> {sizeForm.getValues().colorId}</p>
                  <p><span className="font-medium">Size:</span> {sizeForm.getValues().size}</p>
                  <p><span className="font-medium">Quantity:</span> {sizeForm.getValues().quantity}</p>
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