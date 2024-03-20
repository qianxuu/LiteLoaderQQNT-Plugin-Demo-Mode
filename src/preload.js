const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('DemoMode', {
  getConfig: (dataPath) => ipcRenderer.invoke('DemoMode.getConfig', dataPath),
  setConfig: (dataPath, config) => ipcRenderer.invoke('DemoMode.setConfig', dataPath, config),
})
