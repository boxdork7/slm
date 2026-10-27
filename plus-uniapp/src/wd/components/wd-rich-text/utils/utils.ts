// ========== 类型定义 ==========

/** 编辑器上下文接口 - 定义富文本编辑器的核心操作方法 */
interface EditorContext {
  /** 插入文本到当前光标位置 */
  insertText: (options: { text: string }) => void
  /**
   * 获取编辑器完整内容
   * @param options.success 成功回调，返回包含delta和html的结果对象
   */
  getContents: (options: { success: (res: any) => void }) => void
  /**
   * 设置编辑器内容
   * @param options.delta Delta格式的内容数据
   */
  setContents: (options: { delta: any }) => void
  /** 使编辑器失去焦点 */
  blur: () => void
}

/** 链接属性接口 - 定义超链接的样式和内容 */
interface LinkAttr {
  text: string // 链接显示文本
  href: string // 链接地址
  textDecoration?: string // 文本装饰（如下划线）
  color?: string // 链接颜色
}

/** Delta操作对象接口 - Quill编辑器的内容表示格式 */
interface DeltaOp {
  insert: string // 要插入的内容
  attributes?: Record<string, any> // 内容的格式属性
}

// ========== 常量定义 ==========

/**
 * 链接插入标识符
 *
 * 这个标识符用于在富文本编辑器中标记链接插入位置。
 * 工作流程：
 * 1. 先在编辑器中插入这个唯一标识符
 * 2. 获取编辑器的完整delta内容
 * 3. 找到标识符在delta中的位置
 * 4. 将标识符替换为实际的链接内容
 * 5. 重新设置编辑器内容
 *
 * 标识符必须足够独特，避免与用户正常输入的内容冲突
 */
export const linkFlag = '#-*=*-*=*-*=*@-link超链接标识link-@*=*-*=*-*=*-#'

// ========== 核心功能函数 ==========

/**
 * 在富文本编辑器中添加超链接
 *
 * 该函数通过以下步骤实现链接插入：
 * 1. 插入唯一标识符到当前光标位置
 * 2. 获取编辑器完整内容（delta格式）
 * 3. 查找标识符在内容中的位置
 * 4. 将包含标识符的文本块分割为三部分：前缀 + 链接 + 后缀
 * 5. 重新构建delta内容，将标识符替换为格式化的链接
 * 6. 更新编辑器内容并使其失焦
 *
 * @param editorCtx 编辑器上下文对象
 * @param attr 链接属性（文本、地址、样式等）
 * @param callback 可选的完成回调函数
 */
export const addLink = (editorCtx: EditorContext, attr: LinkAttr, callback?: () => void): void => {
  // 步骤1：先插入标识符文本
  editorCtx.insertText({
    text: linkFlag,
  })

  // 步骤2：获取编辑器完整内容
  editorCtx.getContents({
    success(res: any) {
      const options: DeltaOp[] = res.delta.ops

      // 步骤3：查找标识符在delta操作数组中的位置
      const findex = options.findIndex((item) => {
        return (
          item.insert && typeof item.insert !== 'object' && item.insert?.indexOf(linkFlag) !== -1
        )
      })

      // 步骤4：如果找到标识符，进行内容替换
      if (findex > -1) {
        const findOption = options[findex]
        const findAttributes = findOption.attributes

        // 步骤5：将包含标识符的文本分割为前缀和后缀
        const [prefix, suffix] = findOption.insert.split(linkFlag)
        const handleOps: DeltaOp[] = []

        // 构建前缀部分（如果存在）
        if (prefix) {
          const prefixOps: DeltaOp = findAttributes
            ? {
                insert: prefix,
                attributes: findAttributes,
              }
            : {
                insert: prefix,
              }
          handleOps.push(prefixOps)
        }

        // 构建链接部分
        const linkOps: DeltaOp = {
          insert: attr.text,
          attributes: {
            link: attr.href, // 链接地址
            textDecoration: attr.textDecoration || 'none', // 下划线样式
            color: attr.color || '#007aff', // 链接颜色
          },
        }
        handleOps.push(linkOps)

        // 构建后缀部分（如果存在）
        if (suffix) {
          const suffixOps: DeltaOp = findAttributes
            ? {
                insert: suffix,
                attributes: findAttributes,
              }
            : {
                insert: suffix,
              }
          handleOps.push(suffixOps)
        }

        // 步骤6：删除原有的包含标识符的操作，插入新的三个操作
        options.splice(findex, 1)
        options.splice(findex, 0, ...handleOps)

        // 步骤7：重新设置编辑器内容
        // 注意：此方法会导致光标重置到开始位置
        editorCtx.setContents({
          delta: {
            ops: options,
          },
        })

        // 步骤8：使编辑器失焦，避免光标位置问题
        // 建议让用户手动点击来重新聚焦光标
        editorCtx.blur()

        // 步骤9：执行完成回调
        if (callback) callback()
      }
    },
  })
}

/**
 * 将含有特殊图片形式视频的富文本转换成正常视频的富文本
 *
 * 在某些富文本编辑器中，由于不支持直接插入video标签，
 * 会使用img标签的alt属性来存储视频链接。
 * 这个函数将这种特殊格式转换为标准的video标签。
 *
 * 转换逻辑：
 * - 查找所有带有alt属性的img标签
 * - 将alt属性中的链接作为视频源
 * - 替换为标准的video标签，包含controls控制器
 *
 * @param html 要进行处理的富文本字符串
 * @returns 处理后的富文本字符串
 *
 * @example
 * // 输入：<img src="placeholder.jpg" alt="http://example.com/video.mp4" />
 * // 输出：<video width="80%" controls><source src="http://example.com/video.mp4" type="video/mp4"></video>
 */
export const handleHtmlWithVideo = (html: string): string => {
  // 正则表达式匹配：img标签 + src属性 + alt属性（视频链接）
  const regex = /<img\s+src="[^"]*"\s+alt="([^"]*)"[^>]*>/g

  // 使用replace方法和回调函数进行替换
  return html.replace(regex, (match: string, videoUrl: string) => {
    // 将匹配到的img标签替换为video标签
    // 添加controls属性以便用户可以控制播放
    return `<video width="80%" controls><source src="${videoUrl}" type="video/mp4"></video>`
  })
}

/**
 * 将img标签中内联style属性中的宽高样式提取出标签width与height属性
 *
 * 某些富文本编辑器会将图片的尺寸信息存储在style属性中，
 * 但在某些渲染环境中，直接使用width和height属性更加兼容。
 * 这个函数将style中的width和height提取出来作为标签属性。
 *
 * 处理步骤：
 * 1. 匹配所有img标签及其属性
 * 2. 解析style属性中的样式规则
 * 3. 提取width和height值
 * 4. 重新构建img标签，添加width和height属性
 * 5. 保持原有的style属性和其他属性
 *
 * @param html 要处理的富文本字符串
 * @returns 处理后的富文本字符串
 *
 * @example
 * // 输入：<img src="image.jpg" style="width: 200px; height: 100px;" />
 * // 输出：<img width="200px" height="100px" style="width: 200px; height: 100px;" src="image.jpg" />
 */
export const convertImgStylesToAttributes = (html: string): string => {
  // 正则表达式匹配img标签及其所有属性
  // 注意：使用了复杂的正则来处理各种属性格式
  // eslint-disable-next-line regexp/no-super-linear-backtracking,regexp/optimal-quantifier-concatenation
  return html.replace(/<img\s+([^>]+)\s*>/g, (match: string, attributes: string) => {
    // 步骤1：将属性字符串分割为属性数组
    const attrs = attributes.split(/\s+/)

    // 步骤2：查找style属性的位置
    const styleIndex = attrs.findIndex((attr) => attr.startsWith('style='))
    if (styleIndex === -1) return match // 如果没有style属性，返回原标签

    // 步骤3：提取并移除style属性
    const styleAttr = attrs.splice(styleIndex, 1)[0]
    const styleMatch = styleAttr.match(/"([^"]*)"/)
    if (!styleMatch) return match // 如果style属性格式不正确，返回原标签

    const style = styleMatch[1]

    // 步骤4：解析style属性中的样式规则
    const styleObj: Record<string, string> = {}
    style.split(';').forEach((part: string) => {
      if (part) {
        const [name, value] = part.split(':')
        if (name && value) {
          styleObj[name.trim()] = value.trim()
        }
      }
    })

    // 步骤5：构建新的img标签
    let newTag = '<img'

    // 添加提取的width属性
    if (styleObj.width) {
      newTag += ` width="${styleObj.width}"`
    }

    // 添加提取的height属性
    if (styleObj.height) {
      newTag += ` height="${styleObj.height}"`
    }

    // 步骤6：重新添加原有的属性（包括修改过的style属性）
    newTag += ` ${styleAttr} ${attrs.join(' ')}`

    // 步骤7：关闭img标签
    newTag += '>'

    return newTag
  })
}
