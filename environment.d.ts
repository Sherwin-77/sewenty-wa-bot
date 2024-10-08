declare global {
    namespace NodeJS {
        interface ProcessEnv {
            OWNER_NUMBER: string;
        }
    }
}

export {}