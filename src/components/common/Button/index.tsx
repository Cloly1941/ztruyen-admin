// ** React
import type {ComponentProps} from "react";

// ** Components
import { Button as ShadcnButton } from '@/components/ui/button'

interface ButtonProps
    extends ComponentProps<typeof ShadcnButton> {
    isLoading?: boolean
    isTable?: boolean
}

const Button = ({
                    isLoading,
                    children,
                    disabled,
                    isTable = false,
                    ...props
                }: ButtonProps) => {
    return (
        <ShadcnButton
            disabled={isLoading || disabled}
            className={isTable ? '-mx-3' : undefined}
            {...props}
        >
            {isLoading ? "Đợi xíu nhe~" : children}
        </ShadcnButton>
    )
}

export default Button