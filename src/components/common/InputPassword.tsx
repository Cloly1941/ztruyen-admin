// ** React
import { useState } from "react"

// ** React hook form
import type {ControllerFieldState, ControllerRenderProps, FieldValues, Path} from "react-hook-form";

// ** Shadcn ui
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

// ** Lucide icon
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface InputPasswordProps<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
> {
    field: ControllerRenderProps<TFieldValues, TName>
    fieldState: ControllerFieldState
    id?: string
    placeholder?: string
}

function InputPassword<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
      field,
      fieldState,
      id,
      placeholder = 'Mật khẩu của bạn',
  }: InputPasswordProps<TFieldValues, TName>) {
    const [show, setShow] = useState(false)

    return (
        <InputGroup>
            <InputGroupInput
                {...field}
                id={id}
                type={show ? 'text' : 'password'}
                aria-invalid={fieldState.invalid}
                placeholder={placeholder}
                autoComplete="current-password"
            />

            <InputGroupAddon
                align="inline-end"
                role="button"
                tabIndex={0}
                onClick={() => setShow(!show)}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
            >
                {show ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
            </InputGroupAddon>
        </InputGroup>
    )
}

export default InputPassword
