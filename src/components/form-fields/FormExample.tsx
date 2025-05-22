'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FormInput, FormSelect, FormDatePicker, FormTextarea } from '@/components/form-fields'

// Define a Zod schema for the form
const formSchema = z.object({
  // Text input with validation
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),

  // Email input with validation
  email: z.string().email({ message: 'Please enter a valid email address' }),

  // Select with validation
  role: z.string({ required_error: 'Please select a role' }),

  // Date with validation
  birthDate: z.date({
    required_error: 'Please select a date',
    invalid_type_error: "That's not a date!",
  }),

  // Textarea with validation
  bio: z
    .string()
    .min(10, { message: 'Bio must be at least 10 characters' })
    .max(500, { message: 'Bio must not exceed 500 characters' }),
})

// Type for the form values inferred from the schema
type FormValues = z.infer<typeof formSchema>

export function FormExample() {
  // Initialize the form
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      bio: '',
    },
  })

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted with data:', data)
    // Here you would typically submit the data to your backend
  }

  // Role options for select field
  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'User', value: 'user' },
  ]

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold">Registration Form</h2>

        {/* Text input */}
        <FormInput
          name="name"
          label="Name"
          placeholder="Enter your name"
          description="Your full name as it appears on official documents"
        />

        {/* Email input */}
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          description="We'll never share your email with anyone else"
        />

        {/* Select input */}
        <FormSelect
          name="role"
          label="Role"
          options={roleOptions}
          placeholder="Select your role"
          description="Your permissions will be based on your role"
        />

        {/* Date picker */}
        <FormDatePicker
          name="birthDate"
          label="Date of Birth"
          description="Must be over 18 years old"
          fromDate={new Date(1900, 0, 1)} // Minimum date (January 1, 1900)
          toDate={new Date()} // Maximum date (today)
        />

        {/* Textarea */}
        <FormTextarea
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself"
          description="A brief introduction about yourself (10-500 characters)"
          rows={4}
        />

        {/* Submit button */}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </FormProvider>
  )
}
