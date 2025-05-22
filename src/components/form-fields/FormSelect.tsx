import { forwardRef } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SelectOption {
  label: string
  value: string
}

export interface FormSelectProps {
  name: string
  label?: string
  description?: string
  placeholder?: string
  options: SelectOption[]
  className?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      name,
      label,
      description,
      placeholder = 'Select an option',
      options,
      className,
      disabled,
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
            <Select
              disabled={disabled}
              onValueChange={(value) => {
                field.onChange(value)
                onChange?.(value)
              }}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger ref={ref} {...props}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  },
)

FormSelect.displayName = 'FormSelect'
