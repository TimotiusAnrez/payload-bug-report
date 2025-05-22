import { ChangeEvent, forwardRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string
  label?: string
  description?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  className?: string
  inputClassName?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      name,
      label,
      description,
      type = 'text',
      placeholder,
      className,
      inputClassName,
      onChange,
      ...props
    },
    ref,
  ) => {
    const { control } = useFormContext()

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={cn('w-full', className)}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                className={inputClassName}
                onChange={(e) => {
                  field.onChange(e)
                  onChange?.(e)
                }}
                ref={ref}
                {...props}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  },
)

FormInput.displayName = 'FormInput'
