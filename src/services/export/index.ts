// ** Services
import axios from "@/services/axios-customize"

export const ExportService = {
    export: async (apiUrl: string, fileName: string) => {
        try {
            const res = await axios.get(apiUrl, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    }
};
