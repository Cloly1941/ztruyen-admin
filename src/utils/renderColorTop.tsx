export const renderColorTop = (rank: number) => {
    if (rank === 1) return "text-red-600";
    if (rank === 2) return "text-orange-500";
    if (rank === 3) return "text-yellow-500";

    if (rank <= 10) return "text-blue-500";   // top 10
    if (rank <= 20) return "text-green-500";  // top 20
    if (rank <= 50) return "text-gray-700";   // top 50

    return "text-gray-400";
};