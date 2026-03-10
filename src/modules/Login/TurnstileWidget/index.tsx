// ** Theme
import {useTheme} from "@/theme/ThemeProvider.tsx";

// ** React turnstile
import Turnstile from "react-turnstile";

interface Props {
    onVerify: (token: string) => void;
}

export default function TurnstileWidget({ onVerify }: Props) {

    const {theme} = useTheme()

    const turnstileTheme =
        theme === 'dark' ? 'dark' : 'light';

    return (
        <Turnstile
            sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            theme={turnstileTheme}
            size="flexible"
            onSuccess={onVerify}
        />
    );
}
