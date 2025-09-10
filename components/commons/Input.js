import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'

export default function CustomInput({
  form,
  name,
  title,
  placeholder,
  className,
  type,
  variant = 'input', // 'input', 'select', or 'textarea'
  options = [], // array of options for select: [{ value: '', label: '' }]
  rows = 3, // number of rows for textarea
  labelCls
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === 'password'

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn("primaryText text-black", labelCls)}>{title}</FormLabel>
          <FormControl>
            {variant === 'select' ? (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn("h-10", className)}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : variant === 'textarea' ? (
              <Textarea
                placeholder={placeholder}
                className={cn("resize-none", className)}
                rows={rows}
                {...field}
              />
            ) : (
              <div className="relative">
                <Input
                  placeholder={placeholder}
                  type={isPasswordType ? (showPassword ? 'text' : 'password') : type}
                  className={cn("h-10", className)}
                  {...field}
                />
                {isPasswordType && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="lg:h-8 h-6  2xl:w-8 w-6  text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="lg:h-8 h-6  2xl:w-8 w-6 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                )}
              </div>
            )}
          </FormControl>
          <FormMessage className="text-text-foreground subtitleText" />
        </FormItem>
      )}
    />
  )
}
