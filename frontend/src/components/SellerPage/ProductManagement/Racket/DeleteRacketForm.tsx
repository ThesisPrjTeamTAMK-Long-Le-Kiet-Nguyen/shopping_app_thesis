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
    message: "Racket ID is required.",
  }),
  colorId: z.string().optional(),
  typeId: z.string().optional(),
})

type DeleteFormValues = z.infer<typeof deleteFormSchema>

export default function DeleteRacketForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<DeleteFormValues | null>(null)
  const [deleteType, setDeleteType] = useState<'full' | 'color' | 'type'>('full')

  const form = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      id: "",
      colorId: "",
      typeId: "",
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
          response = await deleteProduct('rackets', formData.id)
          break
        case 'color':
          if (!formData.colorId) {
            toast.error("Color ID is required for color deletion")
            return
          }
          response = await deleteProductColor('rackets', formData.id, formData.colorId)
          break
        case 'type':
          if (!formData.colorId || !formData.typeId) {
            toast.error("Color ID and Type ID are required for type deletion")
            return
          }
          response = await deleteProductType('rackets', formData.id, formData.colorId, formData.typeId)
          break
      }

      if (response.success) {
        toast.success(`Racket ${deleteType} deleted successfully`)
        setDialogOpen(false)
        form.reset()
      } else {
        toast.error(`Failed to delete racket ${deleteType}`)
      }
    } catch (error) {
      toast.error(`Error deleting racket ${deleteType}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Button
          variant={deleteType === 'full' ? "default" : "outline"}
          onClick={() => setDeleteType('full')}
        >
          Delete Racket
        </Button>
        <Button
          variant={deleteType === 'color' ? "default" : "outline"}
          onClick={() => setDeleteType('color')}
        >
          Delete Color
        </Button>
        <Button
          variant={deleteType === 'type' ? "default" : "outline"}
          onClick={() => setDeleteType('type')}
        >
          Delete Type
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Racket ID</FormLabel>
                <FormControl>
                  <Input placeholder="ID of the Racket" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the ID of the racket to delete
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {(deleteType === 'color' || deleteType === 'type') && (
            <FormField
              control={form.control}
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
          )}

          {deleteType === 'type' && (
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type ID</FormLabel>
                  <FormControl>
                    <Input placeholder="type-id" {...field} />
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
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteType === 'full' ? 'racket' :
                deleteType === 'color' ? 'color' : 'type'}?
              This action cannot be undone.

              {formData && (
                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <p><span className="font-medium">Racket ID:</span> {formData.id}</p>
                  {formData.colorId && (
                    <p><span className="font-medium">Color ID:</span> {formData.colorId}</p>
                  )}
                  {formData.typeId && (
                    <p><span className="font-medium">Type ID:</span> {formData.typeId}</p>
                  )}
                </div>
              )}
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