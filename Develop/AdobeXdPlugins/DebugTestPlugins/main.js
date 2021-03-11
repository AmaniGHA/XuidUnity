// XD拡張APIのクラスをインポート
const {
  Artboard,
  Text,
  Color,
  ImageFill,
  Line,
  Rectangle,
  GraphicNode,
  selection,
} = require('scenegraph')
const application = require('application')
const commands = require('commands')
const fs = require('uxp').storage.localFileSystem

/**
 * Shorthand for creating Elements.
 * @param {*} tag The tag name of the element.
 * @param {*} [props] Optional props.
 * @param {*} children Child elements or strings
 */
function h(tag, props, ...children) {
  let element = document.createElement(tag)
  if (props) {
    if (props.nodeType || typeof props !== 'object') {
      children.unshift(props)
    } else {
      for (let name in props) {
        let value = props[name]
        if (name === 'style') {
          Object.assign(element.style, value)
        } else {
          element.setAttribute(name, value)
          element[name] = value
        }
      }
    }
  }
  for (let child of children) {
    element.appendChild(
      typeof child === 'object' ? child : document.createTextNode(child),
    )
  }
  return element
}

/**
 * alertの表示
 * @param {string} message
 */
async function alert(message, title) {
  if (title == null) {
    title = 'XD Baum2 Export'
  }
  let dialog = h(
    'dialog',
    h(
      'form',
      {
        method: 'dialog',
        style: {
          width: 400,
        },
      },
      h('h1', title),
      h('hr'),
      h('span', message),
      h(
        'footer',
        h(
          'button',
          {
            uxpVariant: 'primary',
            onclick(e) {
              dialog.close()
            },
          },
          'Close',
        ),
      ),
    ),
  )
  document.body.appendChild(dialog)
  return await dialog.showModal()
}

/**
 * @param {SceneNodeClass} node
 * @param {Bounds} newGlobalBounds
 * @constructor
 */
function SetGlobalBounds(node, newGlobalBounds) {
  const globalBounds = node.globalBounds
  //現在の座標から動かす差分を取得
  const deltaX = newGlobalBounds.x - globalBounds.x
  const deltaY = newGlobalBounds.y - globalBounds.y
  node.moveInParentCoordinates(deltaX, deltaY)
  node.resize(newGlobalBounds.width, newGlobalBounds.height)
}

/**
 * Stretch変形できるものへ変換コピーする
 * @param {SceneNodeClass} item
 */
function duplicateStretchable(item) {
  let fill = item.fill
  if (fill != null && item.constructor.name === 'Rectangle') {
    // ImageFillをもったRectangleのコピー
    let rect = new Rectangle()
    rect.name = item.name + '-stretch'
    SetGlobalBounds(rect, item.globalBounds) // 同じ場所に作成
    // 新規に作成することで、元のイメージがCCライブラリのイメージでもSTRETCH変形ができる
    let cloneFill = fill.clone()
    cloneFill.scaleBehavior = ImageFill.SCALE_STRETCH
    rect.fill = cloneFill
    selection.insertionParent.addChild(rect)
    return rect
  }
  // それ以外の場合は普通にコピー
  const selectionItems = [].concat(selection.items)
  selection.items = [item]
  commands.duplicate()
  const node = selection.items[0]
  //node.removeFromParent()
  selection.items = selectionItems
  return node
}

function pluginDuplicateStretch(slection, root) {
  selection.items.forEach(item => {
    var rect = duplicateStretchable(item)
    //selection.insertionParent.addChild(rect)
    SetGlobalBounds(rect, item.globalBounds)
    selection.items = [rect]
  })
}

/**
 * 選択したグループの子供を画像出力する
 * @param selection
 * @param root
 * @returns {Promise<void>}
 */
async function pluginRenditionChildren(selection, root) {
  const outputFolder = await fs.getFolder()

  if (!outputFolder) return console.log('User canceled folder picker.')

  let renditionOptions = []
  const length = selection.items[0].children.length
  for (let i = 0; i < length; i++) {
    const item = selection.items[0].children.at(i)
    const fileName = item.name + '.png'
    const file = await outputFolder.createFile(fileName, {
      overwrite: true,
    })
    renditionOptions.push({
      // fileName: fileName,
      node: item,
      outputFile: file,
      type: application.RenditionType.PNG,
      scale: 1,
    })
  }

  const results = await application
    .createRenditions(renditionOptions)
    .then(results => {
      // [2]
      console.log(
        `PNG rendition has been saved at ${results[0].outputFile.nativePath}`,
      )
    })
    .catch(error => {
      console.log('error:' + error)
      // https://forums.adobexdplatform.com/t/details-for-io-failed/1185/14
      // https://helpx.adobe.com/xd/kb/import-export-issues.html
      console.log(
        '1)access denied (disk permission)\n2)readonly folder\n3)not enough disk space\n4)maximum path\n5)image size 0px',
      )
    })
  console.log('done.')
}

async function resizeArtboard(selection, root) {
  let node = selection.items[0]
  const bounds = node.globalBounds
  node.resize(bounds.width + 100, bounds.height + 100)
  node.children.forEach(child => {
    const bounds = child.globalBounds
    const drawBounds = child.globalDrawBounds
    console.log(`${child.name}: ${bounds.height} ${drawBounds.height}`)
  })
}

/**
 * 全てのInteractionと、選択にあるTriggeredInteractionsを取得する プラグイン
 * manifest.json uiEntryPointsに以下を追加する
 * {
 *     "type": "menu",
 *     "label": "get interactions",
 *     "commandId": "getInteractionsCommand"
 * }
 * @param {Selection} selection
 * @param {RootNode} root
 * @return {Promise<void>}
 */
async function pluginGetInteractions(selection, root) {
  console.log("## all interactions")
  let allInteractions = require('interactions').allInteractions
  console.log(allInteractions)

  console.log("## selected layer interactions")
  let node = selection.items[0]
  if (node) {
    // Print all the interactions triggered by a node
    console.log(node.triggeredInteractions)
    node.triggeredInteractions.forEach(interaction => {
      console.log(interaction)
      console.log(
        'Trigger: ' +
          interaction.trigger.type +
          ' -> Action: ' +
          interaction.action.type,
      )
    })
  }
  console.log('done.')
}

/**
 * 選択したノードを画像出力する
 * 画像出力のテスト用
 * @param {Selection} selection
 * @param {RootNode} root
 */
async function testRendition(selection, root) {
  const folder = await fs.getFolder()
  if (!folder) return console.log('User canceled folder picker.')
  const file = await folder.createFile('rendition.png')
  let node = selection.items[0]
  console.log(node.name)
  let renditionSettings = [
    {
      node: node, // [1]
      outputFile: file, // [2]
      type: application.RenditionType.PNG, // [3]
      scale: 2, // [4]
    },
  ]
  application
    .createRenditions(renditionSettings) // [1]
    .then(results => {
      // [2]
      console.log(
        `PNG rendition has been saved at ${results[0].outputFile.nativePath}`,
      )
    })
    .catch(error => {
      // [3]
      console.log(error)
    })
}

/**
 * 選択した複数のグループのDrawBoundsのサイズをそろえるため､ダミーの描画オブジェクトを作成する
 * 現在は､同一Artboardであることを求める
 * @param {Selection} selection
 * @param {RootNode} root
 */
async function pluginAddImageSizeFix(selection, root) {
  const sizeFixerName = '#SIZE-FIXER'
  let artboard
  let groups = []
  // 選択されたものの検証　グループのものかどうかを探す
  selection.items.forEach(item => {
    if (!item.isContainer) {
      throw error('failed')
    }

    // すでにあるSizeFixerを削除する
    let sizeFixers = item.children.filter(child => {
      return child.name === sizeFixerName
    })
    sizeFixers.forEach(item => {
      item.removeFromParent()
    })

    if (artboard == null) {
      // 最初のアートボード登録
      artboard = getArtboard(item)
    } else {
      const myArtboard = getArtboard(item)
      // 同じアートボードであるか
      if (artboard !== myArtboard) {
        throw error('failed')
      }
    }
    groups.push(item)
  })

  // 選択されたグループの描画範囲を取得する
  let calcFixBounds = new CalcBounds()
  groups.forEach(group => {
    calcFixBounds.addBounds(group.globalDrawBounds)
  })

  // サイズ固定のためのダミー透明描画オブジェクトを作成する
  const fixBounds = calcFixBounds.bounds
  groups.forEach(group => {
    let fixerGraphic = new Rectangle()
    fixerGraphic.name = sizeFixerName
    fixerGraphic.width = fixBounds.width
    fixerGraphic.height = fixBounds.height
    fixerGraphic.fillEnabled = false
    fixerGraphic.strokeEnabled = false
    // まずは追加し
    group.addChild(fixerGraphic)
    // ズレを計算､移動する
    const lineBounds = fixerGraphic.globalBounds
    fixerGraphic.moveInParentCoordinates(
      fixBounds.x - lineBounds.x,
      fixBounds.y - lineBounds.y,
    )
  })
  await alert('done', 'Size Fixer')
}

/**
 * 選択したグループの子供を画像出力する
 * @param selection
 * @param root
 * @returns {Promise<void>}
 */
async function pluginRenditionChildren(selection, root) {
  const outputFolder = await fs.getFolder()

  if (!outputFolder) return console.log('User canceled folder picker.')

  let renditionOptions = []
  const length = selection.items[0].children.length
  for (let i = 0; i < length; i++) {
    const item = selection.items[0].children.at(i)
    const fileName = item.name + '.png'
    const file = await outputFolder.createFile(fileName, {
      overwrite: true,
    })
    renditionOptions.push({
      // fileName: fileName,
      node: item,
      outputFile: file,
      type: application.RenditionType.PNG,
      scale: 1,
    })
  }

  const results = await application
    .createRenditions(renditionOptions)
    .then(results => {
      // [2]
      console.log(
        `PNG rendition has been saved at ${results[0].outputFile.nativePath}`,
      )
    })
    .catch(error => {
      console.log('error:' + error)
      // https://forums.adobexdplatform.com/t/details-for-io-failed/1185/14
      // https://helpx.adobe.com/xd/kb/import-export-issues.html
      console.log(
        '1)access denied (disk permission)\n2)readonly folder\n3)not enough disk space\n4)maximum path\n5)image size 0px',
      )
    })
  console.log('done.')
}

/**
 * オブジェクトのもつ全てのプロパティを表示する
 * レスポンシブデザイン用プロパティが無いか調べるときに使用
 * @param {*} obj
 */
function printAllProperties(obj) {
  let propNames = []
  let o = obj
  while (o) {
    propNames = propNames.concat(Object.getOwnPropertyNames(o))
    o = Object.getPrototypeOf(o)
  }
  console.log(propNames)
}

function pluginPrintAllProperties(selection, root) {
  const node = selection.items[0]
  printAllProperties(node)
}

function pluginPrintCheckProperties(selection, root) {
  const node = selection.items[0]
  console.log("scrollingType:",node.scrollingType)
  console.log("viewport:",node.viewport)
  console.log("dynamicLayout:",node.dynamicLayout)

  console.log("horizontalConstraints:",node.horizontalConstraints)
  console.log("verticalConstraints:",node.verticalConstraints)
}

module.exports = {
  // コマンドIDとファンクションの紐付け
  commands: {
    pluginDuplicateStretch,
    pluginRenditionChildren,
    resizeArtboard,
    pluginPrintAllProperties,
    pluginPrintCheckProperties,
    pluginGetInteractions,
  },
}
