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
import { Checkbox } from "@/components/ui/checkbox"
import { addRacket } from "@/services/adminService"
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

// Update the form schema to include colors and types
const racketFormSchema = z.object({
  id: z.string().min(2, {
    message: "ID must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  brand: z.string().min(1, {
    message: "Brand is required.",
  }),
  series: z.string().min(1, {
    message: "Series is required.",
  }),
  racketType: z.string().min(1, {
    message: "Racket type is required.",
  }),
  flexibility: z.string().min(1, {
    message: "Flexibility is required.",
  }),
  material: z.string().min(1, {
    message: "Material is required.",
  }),
  balancePoint: z.string().min(1, {
    message: "Balance point is required.",
  }),
  cover: z.boolean(),
  // Add color fields
  color: z.string().min(1, {
    message: "Color is required.",
  }),
  photo: z.string().url({
    message: "Please enter a valid URL for the photo.",
  }),
  // Add type fields
  racketTypeVariant: z.string().min(1, {
    message: "Type variant is required.",
  }),
  quantity: z.string().min(1, {
    message: "Quantity is required.",
  }),
  maxTension: z.string().min(1, {
    message: "Max tension is required.",
  }),
})

type RacketFormValues = z.infer<typeof racketFormSchema>

export default function RacketManagement() {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<RacketFormValues | null>(null)

  const form = useForm<RacketFormValues>({
    resolver: zodResolver(racketFormSchema),
    defaultValues: {
      id: "",
      name: "",
      price: "",
      brand: "",
      series: "",
      racketType: "",
      flexibility: "",
      material: "",
      balancePoint: "",
      cover: false,
      // Add new default values
      color: "",
      photo: "",
      racketTypeVariant: "",
      quantity: "",
      maxTension: "",
    }
  })

  // Add console.log to debug form submission
  async function onSubmit(data: RacketFormValues) {
    console.log("Form submitted with data:", data)
    setFormData(data)
    setDialogOpen(true)
  }

  const handleConfirm = async () => {
    try {
      if (!formData) return

      // Structure the data properly for the API
      const racketData = {
        ...formData,
        price: Number(formData.price),
        balancePoint: Number(formData.balancePoint),
        colors: [{
          color: formData.color,
          photo: formData.photo,
          types: [{
            type: formData.racketTypeVariant,
            quantity: Number(formData.quantity),
            maxTension: formData.maxTension
          }]
        }]
      }

      console.log("Sending data to API:", racketData)

      const response = await addRacket(racketData)
      if (response.success) {
        toast.success("Racket added successfully")
        setDialogOpen(false)
        form.reset()
      } else {
        toast.error("Failed to add racket")
      }
    } catch (error) {
      console.error("Error adding racket:", error)
      toast.error("Error adding racket")
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Racket</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Racket ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ax2106" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the racket
                    </FormDescription>
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
                      <Input placeholder="Astrox 77" {...field} />
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
                      <Input placeholder="195" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Yonex" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="series"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Series</FormLabel>
                    <FormControl>
                      <Input placeholder="Astrox" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="racketType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Racket Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Head Heavy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="flexibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flexibility</FormLabel>
                    <FormControl>
                      <Input placeholder="Stiff" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input placeholder="HM Graphite, Namd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="balancePoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance Point (mm)</FormLabel>
                    <FormControl>
                      <Input placeholder="302" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Includes Cover
                      </FormLabel>
                      <FormDescription>
                        Check if the racket comes with a cover
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Add Color Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Color Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Green" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/photo.jpg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the URL for the racket photo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Add Type Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Type Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="racketTypeVariant"
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
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxTension"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tension</FormLabel>
                    <FormControl>
                      <Input placeholder="27 LBS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Racket
          </Button>
        </form>
      </Form>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm New Racket</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add this racket? Please verify the information:
              {formData && (
                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
                  <p><span className="font-medium">ID:</span> {formData.id}</p>
                  <p><span className="font-medium">Name:</span> {formData.name}</p>
                  <p><span className="font-medium">Price:</span> ${formData.price}</p>
                  <p><span className="font-medium">Brand:</span> {formData.brand}</p>
                  <p><span className="font-medium">Series:</span> {formData.series}</p>
                  <p><span className="font-medium">Type:</span> {formData.racketType}</p>
                  <p><span className="font-medium">Flexibility:</span> {formData.flexibility}</p>
                  <p><span className="font-medium">Material:</span> {formData.material}</p>
                  <p><span className="font-medium">Balance Point:</span> {formData.balancePoint}mm</p>
                  <p><span className="font-medium">Includes Cover:</span> {formData.cover ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Color:</span> {formData.color}</p>
                  <p><span className="font-medium">Photo URL:</span> {formData.photo}</p>
                  <p><span className="font-medium">Type Variant:</span> {formData.racketTypeVariant}</p>
                  <p><span className="font-medium">Quantity:</span> {formData.quantity}</p>
                  <p><span className="font-medium">Max Tension:</span> {formData.maxTension}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Add Racket</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
