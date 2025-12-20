const { app, ipcMain } = require("electron");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

const { getConfig } = require("./config");

async function monitorRiotProcess(mainWindow, onClosed) {
  setInterval(async () => {
    try {
      const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq RiotClientServices.exe" /FO CSV');
      if (!stdout.includes("RiotClientServices.exe")) {
        if (onClosed) onClosed();
        if (mainWindow) mainWindow.webContents.send("riot-client-closed");
      }
    } catch (err) {
      // Ignore errors
    }
  }, 10000);
}

async function launchGame(gameId) {
  const config = getConfig();
  let clientPath = config.riotPath;
  
  // Ensure we use RiotClientServices.exe
  if (!clientPath.endsWith("RiotClientServices.exe")) {
    if (await fs.pathExists(clientPath) && (await fs.stat(clientPath)).isDirectory()) {
      clientPath = path.join(clientPath, "RiotClientServices.exe");
    } else {
      clientPath = path.join(path.dirname(clientPath), "RiotClientServices.exe");
    }
  }

  if (!(await fs.pathExists(clientPath))) {
    throw new Error("Executable Riot Client non trouvé à : " + clientPath);
  }

  // Petit délai pour laisser le temps au client de se stabiliser après le login
  await new Promise(resolve => setTimeout(resolve, 3000));

  let args = [];
  if (gameId === "valorant") {
    args = ["--launch-product=valorant", "--launch-patchline=live"];
  } else if (gameId === "league") {
    args = ["--launch-product=league_of_legends", "--launch-patchline=live"];
  }

  console.log(`Launching ${gameId} with: ${clientPath} ${args.join(" ")}`);
  spawn(clientPath, args, { detached: true, stdio: "ignore" }).unref();
}

function setAutoStart(enable) {
  const settings = { openAtLogin: enable };
  if (!app.isPackaged) {
    settings.path = process.execPath;
    settings.args = ["."];
  }
  app.setLoginItemSettings(settings);
}

function getAutoStartStatus() {
  const settings = app.getLoginItemSettings();
  return {
    enabled: settings.openAtLogin || false,
    wasOpenedAtLogin: settings.wasOpenedAtLogin || false,
  };
}

async function getStatus() {
  const config = getConfig();
  try {
    const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq RiotClientServices.exe" /FO CSV');
    const isRunning = stdout.includes("RiotClientServices.exe");
    
    if (isRunning && config.lastAccountId) {
      return { status: "Active", accountId: config.lastAccountId };
    }
    return { status: "Ready" };
  } catch (e) {
    return { status: "Ready" };
  }
}

module.exports = {
  monitorRiotProcess,
  launchGame,
  setAutoStart,
  getAutoStartStatus,
  getStatus,
};
