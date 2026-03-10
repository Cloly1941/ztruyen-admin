// ** Type
import type {TProvider} from "@/types/backend";

export const getProviderIcon = (provider: TProvider) => {
    const icons: Record<string, string> = {
        google: "/google-icon.png",
        facebook: "facebook-icon.png",
        local: "/logo.png",
    }

    return icons[provider] ?? provider
}