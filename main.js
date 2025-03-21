const { app, BrowserWindow, ipcMain } = require("electron/main");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");

let mainWindow;
// console.log("Hello from Electron 👋");
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadURL("https://github.com");
  const contents = mainWindow.webContents;
  //   console.log(contents);
  mainWindow.loadFile("index.html");
};
app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong");
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", { version: app.getVersion() });
});
autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
});

autoUpdater.once("ready-to-show", () => {
  autoUpdater.checkForUpdatesAndNotify();
});
autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
});
ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
