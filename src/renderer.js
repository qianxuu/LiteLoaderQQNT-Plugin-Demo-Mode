const { getConfig, setConfig, onClick, onChange, getStatus } = window.DemoMode
const { plugin: pluginPath, data: dataPath } = LiteLoader.plugins.DemoMode.path

const DEMO_MODE_BTN_HTML = `<div id="demoModeBtn" style="app-region: no-drag; display: flex; justify-content: center; margin-bottom: 16px">
  <i style="color: var(--icon_primary)">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
      <path
        d="m630.196-422.109-51.892-51.652q24.805-64.543-23.532-106.282-48.337-41.739-102.446-19.696l-50.217-50.457q16.521-10.282 36.804-15.043Q459.196-670 480-670q71 0 120.5 49.5T650-500q0 20.565-5.141 41.706-5.142 21.142-14.663 36.185Zm133.543 134.022-43.587-43.826q47.805-35.761 83.348-79.663 35.543-43.902 53.261-88.424-50.478-110.761-150.12-175.38Q607-740 490-740q-42 0-85.043 7.761-43.044 7.761-66.609 18.282L287.565-765.5q35-16 90.218-28Q433-805.5 485-805.5q143.957 0 264.011 82.337Q869.065-640.826 925.5-500q-25.761 64.478-67.119 118.076-41.359 53.598-94.642 93.837Zm50.109 226.24L649.196-223.74q-35 14-79.239 21.62Q525.717-194.5 480-194.5q-147.196 0-267.75-82.456Q91.696-359.413 34.5-500q19.522-51.761 55.38-101.859 35.859-50.098 86.381-95.815L50.978-822.478l43.913-45.152 759.87 759.869-40.913 45.913Zm-592.522-590.24q-36.761 27.478-70.185 70.402T102.478-500q51.239 111 153.381 175.5Q358-260 488-260q31.565 0 62.728-3.761t47.163-11.761l-64-64q-10.282 4.761-25.445 7.142Q493.283-330 480-330q-70 0-120-49t-50-121q0-14.043 2.261-28.326 2.261-14.283 6.782-25.565l-97.717-98.196ZM530.63-513.435Zm-121.021 60.631Z"
        fill="currentColor"
      />
    </svg>
  </i>
</div>`

// 添加演示模式样式
const addDemoModeStyle = () => {
  // 获取配置
  getConfig(dataPath).then((config) => {
    const { checkbox, style } = config
    const { blur } = style.filter
    let selectors = []

    // 遍历配置文件
    for (const key in checkbox) {
      // 遍历配置子项
      for (const subKey in checkbox[key]) {
        // 如果配置为 true，则插入样式
        if (checkbox[key][subKey].checked) {
          const { selector } = checkbox[key][subKey]
          selectors.push(selector)
        }
      }
    }

    // 转为字符串
    const selectorsStr = selectors.join(',')
    document.head.insertAdjacentHTML(
      'beforeend',
      `<style id="demoModeStyle">${selectorsStr}{filter:blur(${blur}px)!important}</style>`
    )
  })
}

// 添加演示模式按钮
const addDemoModeBtn = () => {
  // 获取功能菜单
  const funcMenu = document.querySelector('.func-menu')

  // 插入演示模式按钮
  funcMenu.insertAdjacentHTML('afterbegin', DEMO_MODE_BTN_HTML)
  document.head.insertAdjacentHTML(
    'beforeend',
    '<style>#demoModeBtn i:hover{color:var(--brand_standard)!important}</style>'
  )

  // 监听演示模式按钮点击
  const demoModeBtn = document.querySelector('#demoModeBtn')
  demoModeBtn.addEventListener('click', () => {
    // 向主进程发送点击按钮消息
    onClick()
  })
}

// 响应演示模式状态变化
onChange((status) => {
  // 判断当前是否为目标页面
  const isTargetPage = ['#/main', '#/chat', '#/forward'].some((hash) => location.hash.includes(hash))
  if (isTargetPage) {
    const demoModeStyle = document.querySelector('#demoModeStyle')
    if (status && !demoModeStyle) {
      addDemoModeStyle()
    } else if (demoModeStyle) {
      demoModeStyle.remove()
    }
  }
})

// 主页添加演示模式按钮定时器
const addDemoModeBtnInterval = setInterval(() => {
  // 判断当前是否为目标页面
  if (location.hash.includes('#/main')) {
    clearInterval(addDemoModeBtnInterval)

    addDemoModeBtn()
  }
}, 500)

// 页面添加演示模式样式定时器
const addDemoModeStyleInterval = setInterval(() => {
  // 判断当前是否为目标页面
  const isTargetPage = ['#/main', '#/chat', '#/forward'].some((hash) => location.hash.includes(hash))
  if (isTargetPage) {
    clearInterval(addDemoModeStyleInterval)

    getStatus().then((status) => {
      // 判断当前是否为目标页面
      if (status) {
        addDemoModeStyle()
      }
    })
  }
}, 500)

// 超时清除定时器
setTimeout(() => {
  clearInterval(addDemoModeBtnInterval)
  clearInterval(addDemoModeStyleInterval)
}, 10000)

/**
 * 切换开关状态
 * @param {HTMLElement} el
 */
const toggleSwitch = (el) => el.toggleAttribute('is-active')

/**
 * 判断开关状态
 * @param {HTMLElement} el
 */
const isSwitchChecked = (el) => el.hasAttribute('is-active')

export const onSettingWindowCreated = async (view) => {
  // 获取设置页文件路径
  const htmlFilePath = `local:///${pluginPath}/src/setting/setting.html`
  const cssFilePath = `local:///${pluginPath}/src/setting/setting.css`
  // 插入设置页
  const htmlText = await (await fetch(htmlFilePath)).text()
  view.insertAdjacentHTML('afterbegin', htmlText)
  // 插入设置页样式
  document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${cssFilePath}" />`)
  // 获取配置
  getConfig(dataPath).then((config) => {
    // 获取设置页所有复选框
    const checkboxes = view.querySelectorAll('setting-switch')
    // 遍历复选框
    checkboxes.forEach((checkbox) => {
      // 从配置中获取复选框状态
      const { checked } = config.checkbox[checkbox.parentNode.parentNode.id][checkbox.dataset.name]
      // 设置复选框状态
      if (checked) toggleSwitch(checkbox)
      // 监听复选框点击
      checkbox.addEventListener('click', () => {
        // 切换状态
        toggleSwitch(checkbox)

        // 写入配置文件
        config.checkbox[checkbox.parentNode.parentNode.id][checkbox.dataset.name].checked = isSwitchChecked(checkbox)
        setConfig(dataPath, config)
      })
    })

    // 从配置中获取模糊度
    const { blur } = config.style.filter
    // 获取模糊度输入框
    const blurRadiusRange = view.querySelector('#blurRadiusRange')
    const blurRadiusNumber = view.querySelector('#blurRadiusNumber')
    // 设置模糊度输入框值
    blurRadiusRange.value = blur
    blurRadiusNumber.value = blur

    // 监听模糊度 range 输入框变化
    blurRadiusRange.addEventListener('input', () => {
      // 将值同步到 number 输入框
      blurRadiusNumber.value = blurRadiusRange.value

      // 写入配置文件
      config.style.filter.blur = blurRadiusRange.value
      setConfig(dataPath, config)
    })

    // 监听模糊度 number 输入框变化
    blurRadiusNumber.addEventListener('input', () => {
      // 如果值在 1-50 之外，则将值重置
      if (blurRadiusNumber.value < 1 || blurRadiusNumber.value > 50) {
        if (blurRadiusNumber.value < 1) {
          blurRadiusNumber.value = 1
        } else {
          blurRadiusNumber.value = 50
        }
      }

      // 将值同步到 range 输入框
      blurRadiusRange.value = blurRadiusNumber.value

      // 写入配置文件
      config.style.filter.blur = blurRadiusNumber.value
      setConfig(dataPath, config)
    })
  })
}
