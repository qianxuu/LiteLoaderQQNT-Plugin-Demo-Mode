const fs = require('fs')
const path = require('path')
const { ipcMain, BrowserWindow } = require('electron')

let demoModeStatus = false // 演示模式状态

// 响应渲染进程获取插件配置
ipcMain.handle('DemoMode.getConfig', (_, dataPath) => {
  const configPath = path.join(dataPath, 'config.json') // 配置文件路径

  // 配置文件不存在则创建
  if (!fs.existsSync(configPath)) {
    // 配置文件目录不存在则创建
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true })
    }

    fs.writeFileSync(configPath, '{}')
  }

  // 读取配置文件
  const defaultConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'default-config.json'), 'utf-8'))
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

  // 如果配置版本号不一致则重置配置文件
  if (config.version !== defaultConfig.version) {
    // 设置默认值
    const { checkbox } = defaultConfig
    for (const key in checkbox) {
      for (const subKey in checkbox[key]) {
        checkbox[key][subKey].checked = true
      }
    }
    checkbox.messageList.content.checked = false
    defaultConfig.style.filter.blur = 10

    // 写入配置文件
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig))

    return defaultConfig
  }

  return config
})

// 响应渲染进程设置插件配置
ipcMain.handle('DemoMode.setConfig', (_, dataPath, config) => {
  const configPath = path.join(dataPath, 'config.json') // 配置文件路径

  // 写入配置文件
  fs.writeFileSync(configPath, JSON.stringify(config))
})

// 响应渲染进程点击按钮事件
ipcMain.on('DemoMode.onClick', () => {
  // 获取所有窗口
  const allWindows = BrowserWindow.getAllWindows()

  // 修改演示模式状态
  demoModeStatus = !demoModeStatus

  // 向所有窗口发送演示模式状态变化
  allWindows.forEach((window) => {
    window.webContents.send('DemoMode.onChange', demoModeStatus)
  })
})

// 响应渲染进程获取演示模式状态
ipcMain.handle('DemoMode.getStatus', () => demoModeStatus)
