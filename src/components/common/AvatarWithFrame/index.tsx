// ** Component
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ** Lib
import { cn } from "@/lib/utils";

type TAvatarWithFrameProps = {
    avatarUrl?: string;
    avatarName?: string;
    frameUrl?: string;
    frameName?: string;
    className?: string;
    classAvatar?: string;
};

const AvatarWithFrame = ({
                             avatarUrl,
                             avatarName,
                             frameName,
                             frameUrl,
                             className,
                             classAvatar,
                         }: TAvatarWithFrameProps) => {

    if (!frameUrl) {
        return (
            <div className="relative">
                <Avatar className={classAvatar}>
                    <AvatarImage src={avatarUrl} alt={avatarName} />
                    <AvatarFallback>
                        {avatarName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        )
    }

    return (
        <div className={cn("relative size-10", className)}>
            <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="w-[60%] h-[60%]">
                    <AvatarImage src={avatarUrl} alt={avatarName} />
                    <AvatarFallback className="text-xs">
                        {avatarName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>

            <img
                src={frameUrl}
                alt={frameName || ''}
                className="relative z-10 w-full h-full object-contain pointer-events-none"
            />
        </div>
    )
}

export default AvatarWithFrame;