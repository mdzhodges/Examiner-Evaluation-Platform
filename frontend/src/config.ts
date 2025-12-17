type AppConfig = {
    API_BASE_URL?: string;
};

const runtimeConfig = (typeof window !== "undefined"
    ? ((window as any).__APP_CONFIG__ as AppConfig | undefined)
    : undefined) ?? {};

const rawBaseUrl =
    runtimeConfig.API_BASE_URL ??
    process.env.REACT_APP_API_BASE_URL ??
    "";

export const API_BASE_URL = String(rawBaseUrl).replace(/\/$/, "");

export function apiUrl(path: string): string {
    const cleanedPath = String(path).replace(/^\/+/, "");
    if (!API_BASE_URL) {
        return cleanedPath;
    }
    return `${API_BASE_URL}/${cleanedPath}`;
}
