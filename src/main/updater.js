const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
const { app, Notification } = require("electron");
const path = require("path");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
autoUpdater.autoDownload = false; // Disable auto-download

// Configuration des notifications système en français
autoUpdater.fullChangelog = true;
// On ne peut pas facilement traduire les notifications natives de electron-updater sans changer le code source de la lib,
// donc on va utiliser nos propres notifications via Electron pour avoir un contrôle total sur la langue.

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
const DEV_UPDATE_NOTIF_DELAY_MS = 1500;
const DEV_SIMULATED_UPDATE_DELAY = 2000;

function setupUpdater(mainWindow) {
  autoUpdater.on("checking-for-update", () => {
    if (mainWindow) mainWindow.webContents.send("update-status", { status: "checking" });
  });

  autoUpdater.on("update-available", (info) => {
    if (mainWindow) {
      mainWindow.webContents.send("update-status", {
        status: "available",
        version: info.version,
        releaseNotes: info.releaseNotes,
      });
    }

    // Notification système personnalisée en français
    const notification = new Notification({
      title: "Mise à jour disponible",
      body: `Une nouvelle version (${info.version}) de SwitchMaster est disponible !`,
      icon: path.join(__dirname, "..", "..", "assets", "logo.png"),
    });
    notification.show();
    notification.on("click", () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  });

  autoUpdater.on("update-not-available", () => {
    if (mainWindow) mainWindow.webContents.send("update-status", { status: "not-available" });
  });

  autoUpdater.on("error", (err) => {
    if (mainWindow) {
      let errorMessage = "Erreur lors de la mise à jour";
      if (err.message.includes("GitHub")) {
        errorMessage = "Erreur de connexion à GitHub. Vérifiez votre connexion internet.";
      }
      mainWindow.webContents.send("update-status", {
        status: "error",
        error: errorMessage,
        details: err.message,
      });
    }
  });

  autoUpdater.on("download-progress", (progressObj) => {
    if (mainWindow) {
      mainWindow.webContents.send("update-progress", {
        percent: Math.round(progressObj.percent),
        transferred: progressObj.transferred,
        total: progressObj.total,
      });
    }
  });

  autoUpdater.on("update-downloaded", (info) => {
    if (mainWindow) mainWindow.webContents.send("update-downloaded");

    // Notification système personnalisée en français
    const notification = new Notification({
      title: "Mise à jour prête",
      body: `La version ${info.version} a été téléchargée et est prête à être installée.`,
      icon: path.join(__dirname, "..", "..", "assets", "logo.png"),
    });
    notification.show();
    notification.on("click", () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  });
}

async function handleUpdateCheck(mainWindow) {
  if (isDev) {
    setTimeout(() => {
      if (mainWindow) {
        mainWindow.webContents.send("update-status", {
          status: "error",
          error: "Mise à jour impossible en mode développement.",
        });
      }
    }, DEV_UPDATE_NOTIF_DELAY_MS);
    return { status: "dev" };
  } else {
    try {
      // On utilise checkForUpdates() au lieu de checkForUpdatesAndNotify() 
      // pour éviter les notifications natives en anglais de electron-updater
      return await autoUpdater.checkForUpdates();
    } catch (err) {
      console.error("Initial update check failed:", err);
      throw err;
    }
  }
}

async function simulateUpdateCheck(mainWindow) {
  mainWindow.webContents.send("update-status", { status: "checking" });
  await new Promise((resolve) => setTimeout(resolve, DEV_SIMULATED_UPDATE_DELAY));

  const updateAvailable = Math.random() > 0.5;
  if (updateAvailable) {
    mainWindow.webContents.send("update-status", {
      status: "available",
      version: "9.9.9",
      releaseNotes: "Ceci est une mise à jour simulée pour le mode dev.",
    });
  } else {
    mainWindow.webContents.send("update-status", { status: "not-available" });
  }
}

module.exports = {
  setupUpdater,
  handleUpdateCheck,
  simulateUpdateCheck,
};
