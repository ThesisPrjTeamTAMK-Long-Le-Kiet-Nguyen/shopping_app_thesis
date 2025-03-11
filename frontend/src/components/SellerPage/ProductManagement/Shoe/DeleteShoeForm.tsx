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
import { deleteProduct, deleteProductType, deleteProductColor } from "@/services/adminService"
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

const deleteFormSchema = z.object({
  id: z.string().min(2, {
    message: "Shoe ID is required.",
  }),
  colorId: z.string().optional(),
  sizeId: z.string().optional(),
})

type DeleteFormValues = z.infer<typeof deleteFormSchema>

export default function DeleteShoeForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<DeleteFormValues | null>(null)
  const [deleteType, setDeleteType] = useState<'full' | 'color' | 'size'>('full')

  const form = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      id: "",
      colorId: "",
      sizeId: "",
    }
  })

  function onSubmit(data: DeleteFormValues) {
    setFormData(data)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      if (!formData) return

      let response;
      switch (deleteType) {
        case 'full':
          response = await deleteProduct('shoes', formData.id)
          break
        case 'color':
          if (!formData.colorId) {
            toast.error("Color ID is required for color deletion")
            return
          }
          response = await deleteProductColor('shoes', formData.id, formData.colorId)
          break
        case 'size':
          if (!formData.colorId || !formData.sizeId) {
            toast.error("Color ID and Size ID are required for size deletion")
            return
          }
          response = await deleteProductType('shoes', formData.id, formData.colorId, formData.sizeId)
          break
      }

      if (response.success) {
        toast.success(`Shoe ${deleteType} deleted successfully`)
        setDialogOpen(false)
        form.reset()
      } else {
        toast.error(`Failed to delete shoe ${deleteType}`)
      }
    } catch (error) {
      toast.error(`Error deleting shoe ${deleteType}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Button
          variant={deleteType === 'full' ? "default" : "outline"}
          onClick={() => setDeleteType('full')}
        >
          Delete Shoe
        </Button>
        <Button
          variant={deleteType === 'color' ? "default" : "outline"}
          onClick={() => setDeleteType('color')}
        >
          Delete Color
        </Button>
        <Button
          variant={deleteType === 'size' ? "default" : "outline"}
          onClick={() => setDeleteType('size')}
        >
          Delete Size
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          {(deleteType === 'color' || deleteType === 'size') && (
            <FormField
              control={form.control}
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
          )}

          {deleteType === 'size' && (
            <FormField
              control={form.control}
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
          )}

          <Button
            type="submit"
            variant="destructive"
            className="w-full"
          >
            Delete
          </Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <span>Are you sure you want to delete this {deleteType === 'full' ? 'shoe' :
                  deleteType === 'color' ? 'color' : 'size'}?
                  This action cannot be undone.</span>

                {formData && (
                  <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-1 gap-2">
                      <div><span className="font-medium">Shoe ID:</span> {formData.id}</div>
                      {formData.colorId && (
                        <div><span className="font-medium">Color ID:</span> {formData.colorId}</div>
                      )}
                      {formData.sizeId && (
                        <div><span className="font-medium">Size ID:</span> {formData.sizeId}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}