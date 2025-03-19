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
import { addRacketColor, addRacketType, updateProductQuantity } from "@/services/adminService"
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

// Schema for updating quantity
const quantityUpdateSchema = z.object({
  racketId: z.string().min(2, { message: "Racket ID is required" }),
  colorId: z.string().min(1, { message: "Color ID is required" }),
  typeId: z.string().min(1, { message: "Type ID is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" })
})

type TypeAddFormValues = z.infer<typeof typeAddSchema>
type ColorAddFormValues = z.infer<typeof colorAddSchema>
type QuantityUpdateFormValues = z.infer<typeof quantityUpdateSchema>

type ModifyType = 'color' | 'type' | 'quantity'

export default function ModifyRacketForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [modifyType, setModifyType] = useState<ModifyType>('color')
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

  const quantityForm = useForm<QuantityUpdateFormValues>({
    resolver: zodResolver(quantityUpdateSchema),
    defaultValues: {
      racketId: '',
      colorId: '',
      typeId: '',
      quantity: ''
    }
  })

  const addType = () => {
    setTypes([...types, { type: '', quantity: '', maxTension: '' }])
  }

  const removeType = (index: number) => {
    setTypes(types.filter((_, i) => i !== index))
  }

  function onSubmit(_data: ColorAddFormValues | TypeAddFormValues | QuantityUpdateFormValues) {
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
      } else if (modifyType === 'type') {
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
      } else {
        const quantityData = quantityForm.getValues()
        response = await updateProductQuantity(
          "rackets",
          quantityData.racketId,
          {
            colorId: quantityData.colorId,
            typeId: quantityData.typeId,
            quantity: Number(quantityData.quantity)
          }
        )
      }

      if (response.success) {
        toast.success(`Racket ${modifyType} ${modifyType === 'quantity' ? 'updated' : 'added'} successfully`)
        setDialogOpen(false)
        if (modifyType === 'color') colorForm.reset()
        else if (modifyType === 'type') typeForm.reset()
        else quantityForm.reset()
      } else {
        toast.error(`Failed to ${modifyType === 'quantity' ? 'update' : 'add'} ${modifyType}`)
      }
    } catch (error) {
      toast.error(`Error ${modifyType === 'quantity' ? 'updating' : 'adding'} ${modifyType}`)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="add-color" className="w-full" onValueChange={(value) => setModifyType(value as ModifyType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="color">Add New Color</TabsTrigger>
          <TabsTrigger value="type">Add New Type</TabsTrigger>
          <TabsTrigger value="quantity">Update Quantity</TabsTrigger>
        </TabsList>

        <TabsContent value="color">
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
        </TabsContent>

        <TabsContent value="type">
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
        </TabsContent>

        <TabsContent value="quantity">
          <Form {...quantityForm}>
            <form onSubmit={quantityForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={quantityForm.control}
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

                <FormField
                  control={quantityForm.control}
                  name="typeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type ID</FormLabel>
                      <FormControl>
                        <Input placeholder="ID of the type" {...field} />
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
            <AlertDialogTitle>Confirm {modifyType === 'quantity' ? 'Update' : 'Addition'}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <span>Are you sure you want to {modifyType === 'quantity' ? 'update this quantity' : `add this new ${modifyType}`}?</span>

                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-1 gap-2">
                    {modifyType === 'color' ? (
                      <>
                        <div><span className="font-medium">Racket ID:</span> {colorForm.getValues().racketId}</div>
                        <div><span className="font-medium">Color:</span> {colorForm.getValues().color}</div>
                        <div><span className="font-medium">Photo URL:</span> {colorForm.getValues().photo}</div>
                        {colorForm.getValues().types.map((type, index) => (
                          <div key={index} className="border-t pt-2 mt-2">
                            <div><span className="font-medium">Type {index + 1}:</span> {type.type}</div>
                            <div><span className="font-medium">Quantity:</span> {type.quantity}</div>
                            <div><span className="font-medium">Max Tension:</span> {type.maxTension}</div>
                          </div>
                        ))}
                      </>
                    ) : modifyType === 'type' ? (
                      <>
                        <div><span className="font-medium">Racket ID:</span> {typeForm.getValues().racketId}</div>
                        <div><span className="font-medium">Color ID:</span> {typeForm.getValues().colorId}</div>
                        <div><span className="font-medium">Type:</span> {typeForm.getValues().type}</div>
                        <div><span className="font-medium">Quantity:</span> {typeForm.getValues().quantity}</div>
                        <div><span className="font-medium">Max Tension:</span> {typeForm.getValues().maxTension}</div>
                      </>
                    ) : (
                      <>
                        <div><span className="font-medium">Racket ID:</span> {quantityForm.getValues().racketId}</div>
                        <div><span className="font-medium">Color ID:</span> {quantityForm.getValues().colorId}</div>
                        <div><span className="font-medium">Type ID:</span> {quantityForm.getValues().typeId}</div>
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
              {modifyType === 'quantity' ? 'Update Quantity' : `Add ${modifyType}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}