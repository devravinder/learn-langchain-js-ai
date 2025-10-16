
declare global {
  interface Window {
    __RUNTIME_CONFIG__:{
        BUN_PUBLIC_APP_URL: string,
        BUN_PUBLIC_API_URL: string,
        BUN_PUBLIC_FAKE_API: string
    }
  }
}

export {};