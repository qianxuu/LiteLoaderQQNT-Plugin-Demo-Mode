const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('demoMode', {
  getConfig: (dataPath) => ipcRenderer.invoke('demoMode.getConfig', dataPath),
  setConfig: (dataPath, config) => ipcRenderer.invoke('demoMode.setConfig', dataPath, config),
})
