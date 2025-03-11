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
import { deleteProduct, deleteProductColor } from "@/services/adminService"
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
  bagId: z.string().min(2, { message: "Bag ID is required" }),
  colorId: z.string().optional(),
})

type DeleteFormValues = z.infer<typeof deleteFormSchema>

export default function DeleteBagForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [deleteType, setDeleteType] = useState<'full' | 'color'>('full')

  const form = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      bagId: '',
      colorId: '',
    }
  })

  function onSubmit(_data: DeleteFormValues) {
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      const formData = form.getValues()
      let response;

      if (deleteType === 'full') {
        response = await deleteProduct('bags', formData.bagId)
      } else {
        if (!formData.colorId) {
          toast.error("Color ID is required for color deletion")
          return
        }
        response = await deleteProductColor('bags', formData.bagId, formData.colorId)
      }

      if (response.success) {
        toast.success(`Bag ${deleteType === 'full' ? '' : 'color '}deleted successfully`)
        setDialogOpen(false)
        form.reset()
      } else {
        toast.error(`Failed to delete bag ${deleteType === 'full' ? '' : 'color'}`)
      }
    } catch (error) {
      toast.error(`Error deleting bag ${deleteType === 'full' ? '' : 'color'}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Button
          variant={deleteType === 'full' ? "default" : "outline"}
          onClick={() => setDeleteType('full')}
        >
          Delete Full Bag
        </Button>
        <Button
          variant={deleteType === 'color' ? "default" : "outline"}
          onClick={() => setDeleteType('color')}
        >
          Delete Color
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="bagId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bag ID</FormLabel>
                <FormControl>
                  <Input placeholder="ID of the bag" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {deleteType === 'color' && (
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

          <Button type="submit" variant="destructive" className="w-full">
            Delete {deleteType === 'full' ? 'Bag' : 'Color'}
          </Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteType === 'full' ? 'bag' : 'color'}?
              This action cannot be undone.

              <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                <p><span className="font-medium">Bag ID:</span> {form.getValues().bagId}</p>
                {deleteType === 'color' && (
                  <p><span className="font-medium">Color ID:</span> {form.getValues().colorId}</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Delete {deleteType === 'full' ? 'Bag' : 'Color'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 