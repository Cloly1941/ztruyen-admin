// ** Icons
import {Moon, Sun} from "lucide-react"

// ** Shadcn ui
import {Button} from "@/components/ui/button"

// ** Theme
import {useThemeCustomizer} from "@/context/ThemeCustomizerContext.tsx";

export function ModeToggle() {
    const {colorMode, setColorMode} = useThemeCustomizer()

    const toggleTheme = () => {
        setColorMode(colorMode === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button variant="ghost" size='icon-sm' onClick={toggleTheme}>
            <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-white" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}