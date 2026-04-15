const COUNTRY_FLAG: Record<string, string> = {
    trung: "https://flagcdn.com/w40/cn.png",
    nhat: "https://flagcdn.com/w40/jp.png",
    han: "https://flagcdn.com/w40/kr.png",
};

const normalizeCountry = (c: string) => {
    const text = c.toLowerCase();

    if (text.includes("trung")) return "trung";
    if (text.includes("nhat") || text.includes("nhật")) return "nhat";
    if (text.includes("han") || text.includes("hàn")) return "han";

    return "";
};

export const renderCountryImg = (countryRaw?: string) => {
    if (!countryRaw) return null;

    const key = normalizeCountry(countryRaw);
    const flag = COUNTRY_FLAG[key];

    return (
        <div className="flex items-center gap-2">
            {flag && (
                <img
                    src={flag}
                    alt={countryRaw}
                    width={20}
                    height={14}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                />
            )}
        </div>
    );
};
