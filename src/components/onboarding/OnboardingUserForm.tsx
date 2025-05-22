'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FormInput, FormSelect, FormDatePicker, FormTextarea } from '@/components/form-fields'
import { User } from '@/payload-types'
import { toast } from 'sonner'
import { UpdateUserFromOnboarding } from '@/actions/users/update.action'
import { redirect } from 'next/navigation'
import { NavigationLink } from '@/types/globals.enum'
import { useState } from 'react'

const userSchema = z.object({
  firstName: z.string().min(3, 'First Name Must Be At Least 3 Characters Long'),
  lastName: z.string().min(3, 'Last Name Must Be At Least 3 Characters Long'),
  gender: z.enum(['male', 'female']),
  DOB: z.date({
    required_error: 'Date of Birth Is Required',
    invalid_type_error: 'Date of Birth Must Be A Valid Date',
  }),
  documentType: z.enum(['KTP', 'PASSPORT']),
  documentID: z.string().min(8, 'Document ID Must Be At Least 8 Characters Long'),
  isVerified: z.boolean(),
  email: z.string().email('Invalid Email Address'),
  phoneNumber: z
    .string()
    .min(10, 'Phone Number Must Be At Least 10 Characters Long')
    .max(12, 'Phone Number Cannot be More than 12 Characters Long'),
})

export type OnboardingFormValues = z.infer<typeof userSchema>

export default function OnboardingUserForm({ user }: { user: User }) {
  const [submit, setSubmit] = useState(false)
  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'male',
      DOB: new Date(),
      documentType: 'KTP',
      documentID: '',
      isVerified: false,
      email: user.userContact.email,
      phoneNumber: '',
    },
  })

  const onSubmit = (data: OnboardingFormValues) => {
    UpdateUserFromOnboarding(data, user.id, user.clerkID).then((res) => {
      if (res.status === 200) {
        redirect(NavigationLink.PROFILE)
      } else if (res.status === 401) {
        redirect(NavigationLink.SIGN_IN)
      } else {
        toast.error(res.message)
        methods.reset(methods.getValues())
      }
    })
  }

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]

  const documentTypeOptions = [
    { label: 'KTP', value: 'KTP' },
    { label: 'Passport', value: 'PASSPORT' },
  ]

  return (
    <div className="onboarding-page w-full h-full">
      {submit && (
        <div className="loading-screen w-screen h-screen absolute z-50 bg-blue-200/20">
          <div className="loading-spinner w-96 h-96"></div>
          <p>Loading...</p>
        </div>
      )}
      <div className="form-container max-w-3xl h-full space-y-6">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormInput name="firstName" label="First Name" />
            <FormInput name="lastName" label="Last Name" />
            <FormSelect name="gender" label="Gender" options={genderOptions} />
            <FormDatePicker name="DOB" label="Date of Birth" />
            <FormSelect name="documentType" label="Document Type" options={documentTypeOptions} />
            <FormInput name="documentID" label="Document ID" />
            <FormInput name="email" label="Email" disabled={true} />
            <FormInput name="phoneNumber" label="Phone Number" type="number" />
            <Button type="submit" onKeyUp={() => setSubmit(true)} disabled={submit}>
              Submit
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
