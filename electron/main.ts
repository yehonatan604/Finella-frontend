import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = async () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // This must match your build output location!
        },
    });

    win.setMenuBarVisibility(false);
    win.removeMenu();
    win.setMenu(null);

    await win.loadURL("http://localhost:5173");
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
