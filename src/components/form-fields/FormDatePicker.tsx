import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

// Enum for managing different calendar views
enum CalendarView {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export interface FormDatePickerProps {
  name: string
  label?: string
  description?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  onChange?: (date: Date | undefined) => void
  fromDate?: Date
  toDate?: Date
}

export const FormDatePicker = forwardRef<HTMLButtonElement, FormDatePickerProps>(
  (
    {
      name,
      label,
      description,
      placeholder = 'Select a date',
      className,
      disabled,
      onChange,
      fromDate,
      toDate,
      ...props
    },
    ref,
  ) => {
    const { control } = useFormContext()

    // Default to current date for the calendar navigation
    const today = new Date()
    const [calendarDate, setCalendarDate] = useState<Date>(today)
    // State to track the current view (day, month, year)
    const [view, setView] = useState<CalendarView>(CalendarView.DAY)

    // Generate a range of years for the year selector
    const currentYear = today.getFullYear()
    const startYear = currentYear - 80 // 80 years in the past
    const endYear = currentYear + 20 // 20 years in the future
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

    // Month names for the month selector
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    // Handler for month selection
    const handleSelectMonth = (monthIndex: number) => {
      const newDate = new Date(calendarDate)
      newDate.setMonth(monthIndex)
      setCalendarDate(newDate)
      setView(CalendarView.DAY)
    }

    // Handler for year selection
    const handleSelectYear = (year: number) => {
      const newDate = new Date(calendarDate)
      newDate.setFullYear(year)
      setCalendarDate(newDate)
      setView(CalendarView.MONTH)
    }

    // Navigate to previous/next based on current view
    const navigatePrevious = () => {
      const newDate = new Date(calendarDate)
      if (view === CalendarView.DAY) {
        newDate.setMonth(newDate.getMonth() - 1)
      } else if (view === CalendarView.MONTH) {
        newDate.setFullYear(newDate.getFullYear() - 1)
      } else if (view === CalendarView.YEAR) {
        newDate.setFullYear(newDate.getFullYear() - 10)
      }
      setCalendarDate(newDate)
    }

    // Navigate to next based on current view
    const navigateNext = () => {
      const newDate = new Date(calendarDate)
      if (view === CalendarView.DAY) {
        newDate.setMonth(newDate.getMonth() + 1)
      } else if (view === CalendarView.MONTH) {
        newDate.setFullYear(newDate.getFullYear() + 1)
      } else if (view === CalendarView.YEAR) {
        newDate.setFullYear(newDate.getFullYear() + 10)
      }
      setCalendarDate(newDate)
    }

    // Render calendar header based on current view
    const renderCalendarHeader = () => {
      return (
        <div className="flex justify-between items-center p-3 border-b">
          <Button
            variant="ghost"
            onClick={navigatePrevious}
            className="h-7 w-7 p-0"
            disabled={disabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1">
            {view !== CalendarView.YEAR && (
              <Button
                variant="ghost"
                onClick={() => setView(CalendarView.MONTH)}
                className={cn('text-sm font-medium', view === CalendarView.MONTH && 'bg-muted')}
              >
                {months[calendarDate.getMonth()]}
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => setView(CalendarView.YEAR)}
              className={cn('text-sm font-medium', view === CalendarView.YEAR && 'bg-muted')}
            >
              {calendarDate.getFullYear()}
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={navigateNext}
            className="h-7 w-7 p-0"
            disabled={disabled}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    // Render month selection grid
    const renderMonthView = () => {
      return (
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                variant="ghost"
                onClick={() => handleSelectMonth(index)}
                className={cn('h-9 text-xs', calendarDate.getMonth() === index && 'bg-muted')}
              >
                {month.substring(0, 3)}
              </Button>
            ))}
          </div>
        </div>
      )
    }

    // Render year selection with ScrollArea
    const renderYearView = () => {
      return (
        <ScrollArea className="h-[220px] p-3">
          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => (
              <Button
                key={year}
                variant="ghost"
                onClick={() => handleSelectYear(year)}
                className={cn('h-9 text-xs', calendarDate.getFullYear() === year && 'bg-muted')}
              >
                {year}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )
    }

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          // Render the appropriate view based on the current state
          // Moved inside render prop to have access to field
          const renderCalendarView = () => {
            switch (view) {
              case CalendarView.MONTH:
                return renderMonthView()
              case CalendarView.YEAR:
                return renderYearView()
              default:
                return (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date)
                      onChange?.(date)
                    }}
                    disabled={(date) => {
                      const isBeforeFromDate = fromDate && date < fromDate
                      const isAfterToDate = toDate && date > toDate
                      return disabled || !!isBeforeFromDate || !!isAfterToDate
                    }}
                    initialFocus
                    month={calendarDate}
                    onMonthChange={setCalendarDate}
                    showOutsideDays={false}
                  />
                )
            }
          }

          return (
            <FormItem className={cn('w-full', className)}>
              {label && <FormLabel>{label}</FormLabel>}
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      ref={ref}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                      disabled={disabled}
                      {...props}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>{placeholder}</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {renderCalendarHeader()}
                  {renderCalendarView()}
                </PopoverContent>
              </Popover>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )
        }}
      />
    )
  },
)

FormDatePicker.displayName = 'FormDatePicker'
