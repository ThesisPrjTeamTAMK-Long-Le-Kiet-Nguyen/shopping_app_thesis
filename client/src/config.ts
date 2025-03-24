/// <reference types="vite/client" />

interface Config {
    API_URL: string;
    STRIPE_PUBLISHABLE_KEY: string;
}

// Add type declaration for Vite's import.meta.env
declare global {
    interface ImportMetaEnv {
        VITE_API_URL: string;
        VITE_STRIPE_PUBLISHABLE_KEY: string;
    }
}

const config: Config = {
    API_URL: 'http://localhost:3000',
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
};

export const getConfig = (): Config => config;
export { config }; 