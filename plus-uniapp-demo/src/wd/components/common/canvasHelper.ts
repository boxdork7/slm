/**
 * Canvas 2D 上下文适配器工具
 * 将标准的 Canvas 2D API 适配为 UniApp 的 CanvasContext 接口
 * 用于在不同平台间提供统一的 Canvas 操作接口
 */

/**
 * 适配 Canvas 2D 上下文为 UniApp CanvasContext
 * 通过添加 UniApp 特有的方法来扩展标准 Canvas 2D 上下文
 *
 * @param ctx 标准的 Canvas 2D 渲染上下文
 * @returns 适配后的 UniApp CanvasContext 对象
 *
 * @example
 * ```typescript
 * // 获取标准 Canvas 2D 上下文
 * const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
 * const ctx = canvas.getContext('2d')!
 *
 * // 适配为 UniApp CanvasContext
 * const uniCtx = canvas2dAdapter(ctx)
 *
 * // 使用 UniApp 风格的 API
 * uniCtx.setFillStyle('#ff0000')
 * uniCtx.fillText('Hello', 10, 10)
 * uniCtx.draw()
 * ```
 */
export const canvas2dAdapter = (ctx: CanvasRenderingContext2D): UniApp.CanvasContext => {
  return Object.assign(ctx, {
    /**
     * 设置填充颜色或渐变
     * @param color 填充样式
     */
    setFillStyle: (color: string | CanvasGradient): void => {
      ctx.fillStyle = color
    },

    /**
     * 设置描边颜色或渐变
     * @param color 描边样式
     */
    setStrokeStyle: (color: string | CanvasGradient | CanvasPattern): void => {
      ctx.strokeStyle = color
    },

    /**
     * 设置线条宽度
     * @param lineWidth 线条宽度值
     */
    setLineWidth: (lineWidth: number): void => {
      ctx.lineWidth = lineWidth
    },

    /**
     * 设置线条端点样式
     * @param lineCap 线条端点样式
     */
    setLineCap: (lineCap: 'butt' | 'round' | 'square'): void => {
      ctx.lineCap = lineCap
    },

    /**
     * 设置字体大小
     * @param font 字体设置字符串
     */
    setFontSize: (font: string): void => {
      ctx.font = font
    },

    /**
     * 设置全局透明度
     * @param alpha 透明度值 (0-1)
     */
    setGlobalAlpha: (alpha: number): void => {
      ctx.globalAlpha = alpha
    },

    /**
     * 设置线条连接样式
     * @param lineJoin 线条连接样式
     */
    setLineJoin: (lineJoin: 'bevel' | 'round' | 'miter'): void => {
      ctx.lineJoin = lineJoin
    },

    /**
     * 设置文本对齐方式
     * @param align 文本对齐方式
     */
    setTextAlign: (align: 'left' | 'center' | 'right'): void => {
      ctx.textAlign = align
    },

    /**
     * 设置斜接限制值
     * @param miterLimit 斜接限制值
     */
    setMiterLimit: (miterLimit: number): void => {
      ctx.miterLimit = miterLimit
    },

    /**
     * 设置阴影效果
     * @param offsetX 阴影水平偏移
     * @param offsetY 阴影垂直偏移
     * @param blur 阴影模糊程度
     * @param color 阴影颜色
     */
    setShadow: (offsetX: number, offsetY: number, blur: number, color: string): void => {
      ctx.shadowOffsetX = offsetX
      ctx.shadowOffsetY = offsetY
      ctx.shadowBlur = blur
      ctx.shadowColor = color
    },

    /**
     * 设置文本基线
     * @param textBaseline 文本基线位置
     */
    setTextBaseline: (textBaseline: 'top' | 'bottom' | 'middle'): void => {
      ctx.textBaseline = textBaseline
    },

    /**
     * 创建圆形渐变（UniApp 特有方法，此处为兼容性占位）
     * @deprecated 在标准 Canvas 2D 中不支持，建议使用 createRadialGradient
     */
    createCircularGradient: (): void => {
      // UniApp 特有方法的占位实现
      console.warn('createCircularGradient is not supported in standard Canvas 2D context')
    },

    /**
     * 绘制画布内容（UniApp 特有方法，此处为兼容性占位）
     * 在标准 Canvas 2D 中，绘制是实时的，不需要调用此方法
     */
    draw: (): void => {
      // 在标准 Canvas 2D 中，绘制是实时的，此处为兼容性占位
    },

    /**
     * 添加颜色停止点（UniApp 特有方法，此处为兼容性占位）
     * @deprecated 在标准 Canvas 2D 中，应使用渐变对象的 addColorStop 方法
     */
    addColorStop: (): void => {
      // UniApp 特有方法的占位实现
      console.warn(
        'addColorStop should be called on gradient objects in standard Canvas 2D context',
      )
    },
  }) as unknown as UniApp.CanvasContext
}
