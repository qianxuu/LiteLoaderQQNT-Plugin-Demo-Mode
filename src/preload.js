const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('DemoMode', {
  getConfig: (dataPath) => ipcRenderer.invoke('DemoMode.getConfig', dataPath),
  setConfig: (dataPath, config) => ipcRenderer.invoke('DemoMode.setConfig', dataPath, config),
  onClick: () => ipcRenderer.send('DemoMode.onClick'),
  onChange: (callback) => ipcRenderer.on('DemoMode.onChange', (_, status) => callback(status)),
  getStatus: (status) => ipcRenderer.invoke('DemoMode.getStatus', status),
})
