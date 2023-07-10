const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

function onLoad() {
  // 获取配置
  ipcMain.handle('demoMode.getConfig', (_, dataPath) => {
    // 配置文件路径
    const configPath = path.join(dataPath, 'config.json')
    // 配置文件不存在则创建
    if (!fs.existsSync(configPath)) {
      // 配置文件目录不存在则创建
      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true })
      }
      // 从 default-config.json 中读取默认配置, 并设置默认值
      const defaultConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'default-config.json'), 'utf-8'))
      const { checkbox } = defaultConfig
      for (const key in checkbox) {
        for (const subKey in checkbox[key]) {
          checkbox[key][subKey].checked = true
        }
      }
      defaultConfig.style.filter.blur = 10
      // 写入默认配置
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig))
    }
    // 读取配置
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    return config
  })

  // 修改配置
  ipcMain.handle('demoMode.setConfig', (_, dataPath, config) => {
    // 配置文件路径
    const configPath = path.join(dataPath, 'config.json')
    // 写入配置
    fs.writeFileSync(configPath, JSON.stringify(config))
  })
}

module.exports = { onLoad }
