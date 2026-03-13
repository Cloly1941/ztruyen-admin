// ** Component
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// ** Lib
import {cn} from "@/lib/utils.ts";

type TAvatarWithFrameProps = {
    avatarUrl?: string;
    avatarName?: string;
    frameUrl?: string;
    frameName?: string;
    className?: string;
    classAvatar?: string;
};


const AvatarWithFrame = ({avatarUrl, avatarName, frameName, frameUrl, className, classAvatar}: TAvatarWithFrameProps) => {

    if (!frameUrl) {
        return (
           <div className='relative'>
               <Avatar className={classAvatar}>
                   <AvatarImage
                       src={avatarUrl}
                       alt={avatarName}
                   />
                   <AvatarFallback className='absolute'>
                       {avatarName?.charAt(0).toUpperCase()}
                   </AvatarFallback>
               </Avatar>
           </div>
        )
    }

    return (
        <div className={cn("relative size-8", className)}>
            {/* Avatar */}
            <Avatar className="absolute size-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <AvatarImage
                    src={avatarUrl}
                    alt={avatarName}
                />
                <AvatarFallback>
                    {avatarName?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            {/* Frame */}
            <div
                className="absolute -top-[38.33%] -left-[38.33%] size-[176.48%] overflow-hidden pointer-events-none">
                <img
                    src={frameUrl}
                    alt={frameName}
                    className="min-w-full h-full"
                />
            </div>
        </div>
    );
}

export default AvatarWithFrame;