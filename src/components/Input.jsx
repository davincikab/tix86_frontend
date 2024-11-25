/* eslint-disable react/prop-types */
import cn from 'classnames'
import { findInputError, isFormInvalid } from './utils'
import { useFormContext, Controller } from 'react-hook-form';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { AnimatePresence, motion } from 'framer-motion'
import { MdError } from 'react-icons/md'

export const Input = ({
  name,
  label,
  type,
  id,
  placeholder,
  validation,
  multiline,
  classname,
  inputClassname,
  options
}) => {
  const {
    register, control,
    formState: { errors },
  } = useFormContext()

  const getInputField = (id, type, input_tailwind, placeholder, name, validation, options=[]) => {
    if(type == "select") {
        return (<select id={id}
            type={type}
            className={cn(input_tailwind, classname)}
            placeholder={placeholder}
            {...register(name, validation)}
        >
            <option value="">Select Type</option>
            {options.map(option => <option value={option} key={option}>{option}</option>)}
        </select>
        )
    }

    return (
        <input
            id={id}
            type={type}
            className={cn(input_tailwind, classname)}
            placeholder={placeholder}
            {...register(name, validation)}
        />
    )
  }
  const inputErrors = findInputError(errors, name)
  const isInvalid = isFormInvalid(inputErrors)

  const input_tailwind = `${inputClassname} p-2 font-medium w-full placeholder:opacity-60 rounded-[10px] h-12 px-3 focus:outline-none border-gray-200 border text-black`;

  return (
    <div className={cn('flex flex-col w-full gap-2')}>
      <div className="flex justify-between">
        <label htmlFor={id} className="font-semibold capitalize">
          {label}
        </label>
        <AnimatePresence mode="wait" initial={false}>
          {isInvalid && (
            <InputError
              message={inputErrors.error.message}
              key={inputErrors.error.message}
            />
          )}
        </AnimatePresence>
      </div>
      {multiline ? (
        <textarea
          id={id}
          className={cn(input_tailwind, 'min-h-[10rem] max-h-[20rem] resize-y', classname)}
          placeholder={placeholder}
          {...register(name, validation)}
        ></textarea>
      ) : (
        !name.includes("phone") ? getInputField(id, type, input_tailwind, placeholder, name, validation, options) : <Controller
        name={name}
        control={control}
        rules={{
            required:validation.required,
            validate: value => {
                if(!validation.required && !value) {
                    return;
                }
                return value ? isValidPhoneNumber(value) || 'Invalid phone number' : 'Invalid phone number'
            }
        }}
        render={({ field }) => (
          <PhoneInput
            international
            classsname={cn(input_tailwind)}
            defaultCountry="US"
            {...field}
            placeholder="Enter phone number"
          />
        )}
      />
      )}
    </div>
  )
}

const InputError = ({ message }) => {
  return (
    <motion.p
      className="flex items-center gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md"
      {...framer_error}
    >
      <MdError />
      {message}
    </motion.p>
  )
}

const framer_error = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.2 },
}