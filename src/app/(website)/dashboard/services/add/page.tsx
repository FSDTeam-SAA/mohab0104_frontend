"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { createService } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Upload, Save } from "lucide-react"
import Image from "next/image"

export default function AddServicePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    serviceTitle: "",
    serviceDescription: "",
    price: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const createMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ data, image }: { data: any; image?: File }) => createService(data, image),
    onSuccess: () => {
      toast.success("Service created successfully")
      router.push("/dashboard/services")
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || "Failed to create service")
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.serviceTitle || !formData.serviceDescription || !formData.price) {
      toast.error("Please fill in all required fields")
      return
    }

    const data = {
      serviceTitle: formData.serviceTitle,
      serviceDescription: formData.serviceDescription,
      price: Number.parseFloat(formData.price),
    }

    createMutation.mutate({ data, image: image || undefined })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <p className="text-gray-600 mt-1">Dashboard &gt; Categories &gt; Add Service</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="serviceTitle">Service Name</Label>
                <Input
                  id="serviceTitle"
                  name="serviceTitle"
                  placeholder="Type Service name here..."
                  value={formData.serviceTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter price..."
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="serviceDescription">Description</Label>
                <Textarea
                  id="serviceDescription"
                  name="serviceDescription"
                  placeholder="Type Service description here..."
                  rows={6}
                  value={formData.serviceDescription}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setImage(null)
                        setImagePreview(null)
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-blue-500 mx-auto" />
                    <div>
                      <p className="text-gray-600">Drag and drop image here, or click add image</p>
                      <Button
                        type="button"
                        className="mt-2 bg-blue-500 hover:bg-blue-600"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        Add Image
                      </Button>
                    </div>
                  </div>
                )}
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={createMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {createMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  )
}
