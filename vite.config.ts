import { build, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function initCanisterEnv() {
  let localCanisters:any, prodCanisters:any;
  try {
    localCanisters = require(path.resolve(
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");

  const canisterConfig = network === "local" ? localCanisters : prodCanisters;

  return Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    prev[`process.env.${canisterName.toUpperCase()}_CANISTER_ID`] =
      JSON.stringify(canisterDetails[network]);
    return prev;
  }, {});
}

const canisterEnvVariables = initCanisterEnv();
const isDevelopment = process.env.NODE_ENV !== "production";
const frontendDirectory = "dist";
const asset_entry = path.join(frontendDirectory, "index.html");
const DFX_PORT="8001"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  mode: isDevelopment ? "development" : "production",
  define: {
    ...canisterEnvVariables,
    "process.env.NODE_ENV": JSON.stringify(isDevelopment ? "development" : "production"),
  },
  build: {
    target: ["esnext"]
  },
  server: {
    fs: {
      allow: ["."],
    },
    proxy: {
      // This proxies all http requests made to /api to our running dfx instance
      "/api": {
        target: `http://localhost:${DFX_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      }
    }
  },
})