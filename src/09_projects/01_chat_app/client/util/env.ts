// to load envs in the browser
const loadWebEnvs = async () => {
    const PREFIX = "BUN_PUBLIC_";
    const entries = Object.entries(process.env).filter(([key]) => key.startsWith(PREFIX));
    const obj = Object.fromEntries(entries);
    
    const data = `window.__RUNTIME_CONFIG__ = ${JSON.stringify(obj)}`
    const filePath = "./src/assets/env.js"
    Bun.write(filePath, data);
  }
  
  await loadWebEnvs();