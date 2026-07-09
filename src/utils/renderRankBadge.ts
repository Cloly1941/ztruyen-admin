export const getRankBadgeClass = (rank: number) => {
    switch (rank) {
        case 1:
            return "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold";
        case 2:
            return "bg-slate-500/15 text-slate-600 dark:text-slate-400 font-bold";
        case 3:
            return "bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold";
        default:
            return "bg-muted text-muted-foreground font-medium";
    }
};
