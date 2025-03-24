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
import { addShoeColor, addShoeSize, updateProductQuantity } from "@/services/adminService"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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

// Schema for updating quantity
const quantityUpdateSchema = z.object({
  shoeId: z.string().min(2, { message: "Shoe ID is required" }),
  colorId: z.string().min(2, { message: "Color ID is required" }),
  sizeId: z.string().min(1, { message: "Size ID is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" })
})

type SizeAddFormValues = z.infer<typeof sizeAddSchema>
type ColorAddFormValues = z.infer<typeof colorAddSchema>
type QuantityUpdateFormValues = z.infer<typeof quantityUpdateSchema>

const DEFAULT_SIZE = { size: '', quantity: '' }

export default function ModifyShoeForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [sizes, setSizes] = useState([DEFAULT_SIZE])
  const [dialogContent, setDialogContent] = useState<{ title: string; type: "color" | "size" | "quantity" }>({
    title: "Add Color",
    type: "color"
  })

  const colorForm = useForm<ColorAddFormValues>({
    resolver: zodResolver(colorAddSchema),
    defaultValues: {
      shoeId: '',
      color: '',
      photo: '',
      types: [DEFAULT_SIZE]
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

  const quantityForm = useForm<QuantityUpdateFormValues>({
    resolver: zodResolver(quantityUpdateSchema),
    defaultValues: {
      shoeId: '',
      colorId: '',
      sizeId: '',
      quantity: ''
    }
  })

  const addSize = () => {
    setSizes([...sizes, DEFAULT_SIZE]);
    const currentTypes = colorForm.getValues().types;
    colorForm.setValue('types', [...currentTypes, DEFAULT_SIZE]);
  }

  const removeSize = (index: number) => {
    if (sizes.length > 1) {
      const newSizes = sizes.filter((_, i) => i !== index);
      setSizes(newSizes);
      colorForm.setValue('types', newSizes);
    }
  }

  async function onSubmit(data: ColorAddFormValues | SizeAddFormValues | QuantityUpdateFormValues) {
    if (dialogContent.type === 'color') {
      const colorData = data as ColorAddFormValues;
      if (!colorData.types?.length) {
        toast.error("At least one size is required");
        return;
      }
    }
    setDialogOpen(true);
  }

  const handleConfirm = async () => {
    try {
      let response;
      if (dialogContent.type === 'color') {
        const colorData = colorForm.getValues()
        response = await addShoeColor(colorData.shoeId, {
          color: colorData.color,
          photo: colorData.photo,
          types: colorData.types.map(t => ({
            size: t.size,
            quantity: Number(t.quantity)
          }))
        })
      } else if (dialogContent.type === 'size') {
        const sizeData = sizeForm.getValues()
        response = await addShoeSize(
          sizeData.shoeId,
          sizeData.colorId,
          {
            size: sizeData.size,
            quantity: Number(sizeData.quantity)
          }
        )
      } else {
        const quantityData = quantityForm.getValues()
        response = await updateProductQuantity(
          'shoes',
          quantityData.shoeId,
          {
            colorId: quantityData.colorId,
            typeId: quantityData.sizeId,
            quantity: Number(quantityData.quantity)
          }
        )
      }

      if (response.success) {
        toast.success(`Shoe ${dialogContent.type} ${dialogContent.type === 'quantity' ? 'updated' : 'added'} successfully`)
        setDialogOpen(false)
        if (dialogContent.type === 'color') {
          colorForm.reset()
          setSizes([DEFAULT_SIZE])
        } else if (dialogContent.type === 'size') {
          sizeForm.reset()
        } else {
          quantityForm.reset()
        }
      } else {
        toast.error(response.error || `Failed to ${dialogContent.type === 'quantity' ? 'update' : 'add'} ${dialogContent.type}`)
      }
    } catch (error) {
      toast.error(`Error ${dialogContent.type === 'quantity' ? 'updating' : 'adding'} ${dialogContent.type}`)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="add-color" className="w-full" onValueChange={(value) => {
        if (value === "add-color") {
          setDialogContent({ title: "Add Color", type: "color" });
          sizeForm.reset();
          quantityForm.reset();
        } else if (value === "add-size") {
          setDialogContent({ title: "Add Size", type: "size" });
          colorForm.reset();
          quantityForm.reset();
          setSizes([DEFAULT_SIZE]);
        } else {
          setDialogContent({ title: "Update Quantity", type: "quantity" });
          colorForm.reset();
          sizeForm.reset();
          setSizes([DEFAULT_SIZE]);
        }
      }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add-color">Add Color</TabsTrigger>
          <TabsTrigger value="add-size">Add Size</TabsTrigger>
          <TabsTrigger value="update-quantity">Update Quantity</TabsTrigger>
        </TabsList>

        <TabsContent value="add-color">
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
        </TabsContent>

        <TabsContent value="add-size">
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
        </TabsContent>

        <TabsContent value="update-quantity">
          <Form {...quantityForm}>
            <form onSubmit={quantityForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={quantityForm.control}
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
                control={quantityForm.control}
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
                  control={quantityForm.control}
                  name="sizeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size ID</FormLabel>
                      <FormControl>
                        <Input placeholder="ID of the size" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={quantityForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">Update Quantity</Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <span>Are you sure you want to {dialogContent.type === 'quantity' ? 'update' : 'add'} this {dialogContent.type}?</span>

                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-1 gap-2">
                    {dialogContent.type === 'color' ? (
                      <>
                        <div><span className="font-medium">Shoe ID:</span> {colorForm.getValues().shoeId}</div>
                        <div><span className="font-medium">Color:</span> {colorForm.getValues().color}</div>
                        <div><span className="font-medium">Photo URL:</span> {colorForm.getValues().photo}</div>
                        {colorForm.getValues().types.map((type, index) => (
                          <div key={index} className="border-t pt-2 mt-2">
                            <div><span className="font-medium">Size {index + 1}:</span> {type.size}</div>
                            <div><span className="font-medium">Quantity:</span> {type.quantity}</div>
                          </div>
                        ))}
                      </>
                    ) : dialogContent.type === 'size' ? (
                      <>
                        <div><span className="font-medium">Shoe ID:</span> {sizeForm.getValues().shoeId}</div>
                        <div><span className="font-medium">Color ID:</span> {sizeForm.getValues().colorId}</div>
                        <div><span className="font-medium">Size:</span> {sizeForm.getValues().size}</div>
                        <div><span className="font-medium">Quantity:</span> {sizeForm.getValues().quantity}</div>
                      </>
                    ) : (
                      <>
                        <div><span className="font-medium">Shoe ID:</span> {quantityForm.getValues().shoeId}</div>
                        <div><span className="font-medium">Color ID:</span> {quantityForm.getValues().colorId}</div>
                        <div><span className="font-medium">Size ID:</span> {quantityForm.getValues().sizeId}</div>
                        <div><span className="font-medium">New Quantity:</span> {quantityForm.getValues().quantity}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {dialogContent.type === 'quantity' ? 'Update Quantity' : `Add ${dialogContent.type}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}