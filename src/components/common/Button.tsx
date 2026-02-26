// ** React
import type {ComponentProps} from "react";

// ** Components
import { Button as ShadcnButton } from '@/components/ui/button'

interface ButtonProps
    extends ComponentProps<typeof ShadcnButton> {
    isLoading?: boolean
}

const Button = ({
                    isLoading,
                    children,
                    disabled,
                    ...props
                }: ButtonProps) => {
    return (
        <ShadcnButton
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? "Đợi xíu nhe~" : children}
        </ShadcnButton>
    )
}

export default Button