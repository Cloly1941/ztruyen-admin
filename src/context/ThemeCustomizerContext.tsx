import {createContext, useContext, useEffect, useState, type ReactNode} from "react"

export type ColorMode = "light" | "dark"
export type Scale = "none" | "xs" | "lg"
export type Radius = "none" | "sm" | "md" | "lg" | "xl"
export type SidebarMode = "default" | "icon"
export type ThemePreset = "default" | "lake-view" | "sunset-glow" | "forest-whisper" | "ocean-breeze" | "lavender-dream"

interface TThemeCustomizerContext {
    themePreset: ThemePreset
    colorMode: ColorMode
    scale: Scale
    radius: Radius
    sidebarMode: SidebarMode
    setThemePreset: (v: ThemePreset) => void
    setColorMode: (v: ColorMode) => void
    setScale: (v: Scale) => void
    setRadius: (v: Radius) => void
    setSidebarMode: (v: SidebarMode) => void
    resetAll: () => void
}

const defaultValues = {
    themePreset: "default" as ThemePreset,
    colorMode: "light" as ColorMode,
    scale: "none" as Scale,
    radius: "md" as Radius,
    sidebarMode: "default" as SidebarMode,
}

const STORAGE_KEY = "theme-customizer"

const ThemeCustomizerContext = createContext<TThemeCustomizerContext | null>(null)

export const ThemeCustomizerProvider = ({children}: {children: ReactNode}) => {

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")

    const [themePreset, setThemePresetState] = useState<ThemePreset>(saved.themePreset ?? defaultValues.themePreset)
    const [colorMode, setColorModeState] = useState<ColorMode>(saved.colorMode ?? defaultValues.colorMode)
    const [scale, setScaleState] = useState<Scale>(saved.scale ?? defaultValues.scale)
    const [radius, setRadiusState] = useState<Radius>(saved.radius ?? defaultValues.radius)
    const [sidebarMode, setSidebarModeState] = useState<SidebarMode>(saved.sidebarMode ?? defaultValues.sidebarMode)

    const persist = (data: object) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            themePreset, colorMode, scale, radius, sidebarMode, ...data
        }))
    }

    // Apply theme preset
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", themePreset)
    }, [themePreset])

    // Apply color mode
    useEffect(() => {
        const root = document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(colorMode)
    }, [colorMode])

    // Apply scale
    useEffect(() => {
        const scaleMap: Record<Scale, string> = {
            none: "1rem",
            xs: "0.875rem",
            lg: "1.125rem",
        }
        document.documentElement.style.setProperty("--font-size-base", scaleMap[scale])
    }, [scale])

    // Apply radius
    useEffect(() => {
        const radiusMap: Record<Radius, string> = {
            none: "0rem",
            sm: "0.25rem",
            md: "0.5rem",
            lg: "0.75rem",
            xl: "1rem",
        }
        document.documentElement.style.setProperty("--radius", radiusMap[radius])
    }, [radius])

    const setThemePreset = (v: ThemePreset) => { setThemePresetState(v); persist({themePreset: v}) }
    const setColorMode = (v: ColorMode) => { setColorModeState(v); persist({colorMode: v}) }
    const setScale = (v: Scale) => { setScaleState(v); persist({scale: v}) }
    const setRadius = (v: Radius) => { setRadiusState(v); persist({radius: v}) }
    const setSidebarMode = (v: SidebarMode) => { setSidebarModeState(v); persist({sidebarMode: v}) }

    const resetAll = () => {
        setThemePresetState(defaultValues.themePreset)
        setColorModeState(defaultValues.colorMode)
        setScaleState(defaultValues.scale)
        setRadiusState(defaultValues.radius)
        setSidebarModeState(defaultValues.sidebarMode)
        localStorage.removeItem(STORAGE_KEY)
    }

    return (
        <ThemeCustomizerContext.Provider value={{
            themePreset, colorMode, scale, radius, sidebarMode,
            setThemePreset, setColorMode, setScale, setRadius, setSidebarMode,
            resetAll
        }}>
            {children}
        </ThemeCustomizerContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeCustomizer = () => {
    const ctx = useContext(ThemeCustomizerContext)
    if (!ctx) throw new Error("useThemeCustomizer must be used within ThemeCustomizerProvider")
    return ctx
}