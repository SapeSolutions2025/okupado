'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { validateAddress } from '@/lib/google-maps'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import Image from 'next/image'

const formSchema = z.object({
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  postalCode: z.string().min(3, {
    message: 'Postal code is required.',
  }),
  city: z.string().min(2, {
    message: 'City is required.',
  }),
  floor: z.string().optional(),
  notes: z.string().optional(),
  photo: z.any().optional(),
})

export default function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [addressValidated, setAddressValidated] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      postalCode: '',
      city: '',
      floor: '',
      notes: '',
    },
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue('photo', file)
    }
  }

  const validateAddressField = async () => {
    const address = form.getValues('address')
    const city = form.getValues('city')
    const postalCode = form.getValues('postalCode')

    if (!address || !city || !postalCode) {
      toast.error(
        'Please fill in address, city, and postal code before validating.',
      )
      return
    }

    setIsSubmitting(true)
    try {
      const fullAddress = `${address}, ${postalCode} ${city}`
      const isValid = await validateAddress(fullAddress)

      if (isValid) {
        setAddressValidated(true)
        toast.success('The address has been successfully validated.')
      } else {
        toast.error(
          'The address could not be validated. Please check and try again.',
        )
      }
    } catch (error) {
      toast.error('There was an error validating the address.')
      console.error('Error validating address:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!addressValidated) {
      toast.error('Please validate the address before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        form.reset()
        setPhotoPreview(null)
        setAddressValidated(false)
        toast.success('Your report has been successfully submitted.')
      } else {
        throw new Error('Failed to submit report')
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('There was an error submitting your report.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building Address*</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code*</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City*</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={validateAddressField}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Validate Address
          </Button>
        </div>

        <FormField
          control={form.control}
          name="floor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apartment Floor (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3rd floor, Apartment 4B" {...field} />
              </FormControl>
              <FormDescription>
                Specify the floor or apartment number if known
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide any additional details about the situation"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Building Entrance Photo (Optional)</FormLabel>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Photo
            </Button>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {photoPreview && (
              <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                <Image
                  src={photoPreview || '/placeholder.svg'}
                  alt="Building entrance preview"
                  className="h-full w-full object-cover"
                  layout="fill"
                  objectFit='cover'
                />
              </div>
            )}
          </div>
          <FormDescription>
            Upload a photo of the building entrance to help identify the
            location
          </FormDescription>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !addressValidated}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Report
        </Button>
      </form>
    </Form>
  )
}
