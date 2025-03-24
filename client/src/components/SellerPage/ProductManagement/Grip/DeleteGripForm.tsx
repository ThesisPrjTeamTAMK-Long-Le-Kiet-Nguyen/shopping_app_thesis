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
  id: z.string().min(2, {
    message: "Grip ID is required.",
  }),
  colorId: z.string().optional(),
})

type DeleteFormValues = z.infer<typeof deleteFormSchema>

export default function DeleteGripForm() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<DeleteFormValues | null>(null)
  const [deleteType, setDeleteType] = useState<'full' | 'color'>('full')

  const form = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      id: "",
      colorId: "",
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
          response = await deleteProduct('grips', formData.id)
          break
        case 'color':
          if (!formData.colorId) {
            toast.error("Color ID is required for color deletion")
            return
          }
          response = await deleteProductColor('grips', formData.id, formData.colorId)
          break
      }

      if (response.success) {
        toast.success(`Grip ${deleteType} deleted successfully`)
        setDialogOpen(false)
        form.reset()
      } else {
        toast.error(`Failed to delete grip ${deleteType}`)
      }
    } catch (error) {
      toast.error(`Error deleting grip ${deleteType}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Button
          variant={deleteType === 'full' ? "default" : "outline"}
          onClick={() => setDeleteType('full')}
        >
          Delete Grip
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
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grip ID</FormLabel>
                <FormControl>
                  <Input placeholder="ID of the grip" {...field} />
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
                    <Input placeholder="color-id" {...field} />
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
                <span>Are you sure you want to delete this {deleteType === 'full' ? 'grip' : 'color'}?
                  This action cannot be undone.</span>

                {formData && (
                  <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-1 gap-2">
                      <div><span className="font-medium">Grip ID:</span> {formData.id}</div>
                      {formData.colorId && (
                        <div><span className="font-medium">Color ID:</span> {formData.colorId}</div>
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