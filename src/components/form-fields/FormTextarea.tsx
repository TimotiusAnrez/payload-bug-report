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
import { Textarea } from '@/components/ui/textarea'

export interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  name: string
  label?: string
  description?: string
  placeholder?: string
  className?: string
  textareaClassName?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    { name, label, description, placeholder, className, textareaClassName, onChange, ...props },
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
              <Textarea
                {...field}
                placeholder={placeholder}
                className={textareaClassName}
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

FormTextarea.displayName = 'FormTextarea'
