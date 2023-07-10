const { getConfig, setConfig } = window.demoMode
const { plugin: pluginPath, data: dataPath } = LiteLoader.plugins['demo-mode'].path

const demoModeBtnIconBlack =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABlUlEQVR4nN2VySvEYRjHP0QO9iZTE8pBJOXg6sLdTY6cLHFw5Mhf4oxkLSfmLGmSJVsRyo0JWVKW3uk7ent735mhJvGt39KzvN/3Wd7nhf+I0nwuPgUcArF87XwP+NA3KnkFMAOcA4/AC3AFrAL9QNl3SKIBkh7gVXL3eQAmgOJcSdqANw9JTFGaHbcAA8C6RZQA6rItXg8cy+HdQ+JDJ3Aq2wugKWRYCZzIcBNoDaSrA5gGai3fKiAuW0MW8RHMy2AHKM+hJtcOSak2ZmyX3MW7rYI1OLo5K88uiYnEhqlBUrZGn0Khet8IxzyR3Up3HEiXi1HZHWnt1CvtPOJxuJeuPZAuFyMugUGvhElPqy1ItyYSXyRpNPpSlMaK1UH2PGoGbgKHzCYpALYlX/SFFrH6Oa7WS6NOxb4T2SywHyj8AVBNAOaQXFr93BUyzNDCJRl8vnabsNKwAQxqPJRr+JlDOAxsBdKVFUXAuNVBmR6TtrOfkKBi9wHLmjPPwJP+jWxII8ZNV14urRpgF5jkr163/Ao+AfVmmByHiVedAAAAAElFTkSuQmCC'
const demoModeBtnIconBlue =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB/ElEQVR4nN2Vy2sUQRDGP0Xx4NugEFQQBEUED1696NmbetWTD+LBox7XfyGoO127GsGTDwgGwZPmHESCqBhjQAmCNw0qPhD0J93bmZ2d6d0khyVowews1dX1VX39VY/0/9kt1vYvuXFZxpSMwf5UbryQQXjX2Rb8w2yQcVvGOxnfZPyU470cD5RxSldZt3gQnzQFknFCxq/oLz9f5bgkY/XiQJockPG7AmIMhi59xU32yTgt41EBaFINdvROfo2dckyHDY4/FZCUZRyWYybGzqrBnnSgsVHGmxg4oQb7u9B1SMaIMrbne2+yScZ4LGxGVxhIAdyLyZ7pOut7nonjmIwPHSAtkUzE2Pvl5EfzA8vYVVq7W+C5DDLSEevPwDEXY4+3nDVWyvEqOi8kOvsUW59O0lWNPx/jpkLu8GO8js6hygbHl7h2MElXFWCoE6Ctc1/lXEVqjtG49jCApDppJ9+dU+QpLCUayxVUvI/q7JXjY5cha4PACjmexuSj1daabCnoeTxIb958V63D/hzAHHfkeJmceH+edTYraX5I/LDM69k4kg7sIeFh1nTdU6h2MqfB8VgNzoTrwc+Hv/xaQ3hOjidJuha0GqtkXCwoqNfjaXu7dJD2dJ6MApiV44eM7/H/mBxnwxVTpqsvH60bbJXxXI6a/s3PrZbJ/gKdWSZNOHRxOgAAAABJRU5ErkJggg=='
const demoModeBtnHTML = `
<div
  id="demoModeBtn"
  style="app-region: no-drag; display: flex; height: 24px; justify-content: center; margin-bottom: 16px"
>
  <div role="button" tabindex="-1" aria-label="演示模式" style="--hover-color: var(--brand_standard); line-height: 0">
    <img
      id="demoModeBtnImg"
      src="${demoModeBtnIconBlack}"
    />
  </div>
</div>
`

function onLoad() {
  const findFuncMenuInterval = setInterval(() => {
    // 插入演示模式按钮
    const funcMenu = document.querySelector('.func-menu')
    if (funcMenu) {
      clearInterval(findFuncMenuInterval)
      // 插入演示模式按钮
      funcMenu.insertAdjacentHTML('afterbegin', demoModeBtnHTML)
      // 添加演示模式按钮鼠标悬停效果
      const demoModeBtnImg = document.querySelector('#demoModeBtnImg')
      demoModeBtnImg.addEventListener('mouseenter', () => {
        demoModeBtnImg.src = demoModeBtnIconBlue
      })
      demoModeBtnImg.addEventListener('mouseleave', () => {
        demoModeBtnImg.src = demoModeBtnIconBlack
      })
      // 添加演示模式按钮点击事件
      const demoModeBtn = document.querySelector('#demoModeBtn')
      demoModeBtn.addEventListener('click', () => {
        // 获取演示模式样式
        const demoModeStyle = document.querySelectorAll('.demoModeStyle')
        // 开关
        if (demoModeStyle.length !== 0) {
          demoModeStyle.forEach((item) => item.remove())
        } else {
          // 获取配置
          getConfig(dataPath).then((config) => {
            const { checkbox, style } = config
            const { blur } = style.filter
            // 遍历配置文件中的配置
            for (const key in checkbox) {
              // 遍历配置子项
              for (const subKey in checkbox[key]) {
                // 如果配置为 true，则插入样式
                if (checkbox[key][subKey].checked) {
                  const { selector } = checkbox[key][subKey]
                  document.head.insertAdjacentHTML(
                    'beforeend',
                    `
                    <style class="demoModeStyle">
                      ${selector} {
                        filter: blur(${blur}px);
                      }
                    </style>
                    `
                  )
                }
              }
            }
          })
        }
      })
    }
  }, 100)
}

async function onConfigView(view) {
  // 获取设置页文件路径
  const htmlFilePath = `file:///${pluginPath}/src/setting/setting.html`
  const cssFilePath = `file:///${pluginPath}/src/setting/setting.css`
  // 插入设置页
  const htmlText = await (await fetch(htmlFilePath)).text()
  view.insertAdjacentHTML('afterbegin', htmlText)
  // 插入设置页样式
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssFilePath
  document.head.appendChild(link)

  // 获取配置
  getConfig(dataPath).then((config) => {
    // 获取设置页所有复选框
    const checkboxes = view.querySelectorAll('input[type="checkbox"]')
    // 遍历复选框
    checkboxes.forEach((checkbox) => {
      // 从配置中获取复选框状态
      const { checked } = config.checkbox[checkbox.parentNode.parentNode.id][checkbox.name]
      // 设置复选框状态
      if (checked) {
        checkbox.checked = true
      }
      // 添加复选框点击事件
      checkbox.addEventListener('click', () => {
        // 修改配置
        config.checkbox[checkbox.parentNode.parentNode.id][checkbox.name].checked = checkbox.checked
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

    // 添加模糊度 range 输入框事件
    blurRadiusRange.addEventListener('input', () => {
      // 将值同步到 number 输入框
      blurRadiusNumber.value = blurRadiusRange.value
      // 修改配置
      config.style.filter.blur = blurRadiusRange.value
      setConfig(dataPath, config)
    })
    // 添加模糊度 number 输入框事件
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
      // 修改配置
      config.style.filter.blur = blurRadiusNumber.value
      setConfig(dataPath, config)
    })
  })
}

export { onLoad, onConfigView }
