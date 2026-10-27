<!-- 主页签组件 -->
<!--
  标签页视图组件
  提供多标签页的管理和展示功能，支持标签页的增删改查、右键菜单操作等
  主要功能：
  1. 标签页的显示和切换
  2. 标签页的关闭操作（支持关闭当前、其他、左侧、右侧、全部）
  3. 右键上下文菜单（标签上右键针对该标签，空白处右键针对当前标签）
  4. 标签页自动滚动定位
  5. 溢出处理：两端浮动步进箭头 + 边缘渐变遮罩 + 全量标签下拉总览
  6. 深色模式支持
  7. 国际化支持

  视觉说明：
  - 非激活标签不填底色、仅留一层淡边框，避免多标签时形成「小方框墙」；
    激活标签用「主题色浅底 + 主题色描边 + 主题色文字」三重信号，一眼可辨当前页
  - 步进箭头浮在滚动区两端而非集中在右侧：左箭头控制的是左侧被遮挡的内容，
    放在右端会让鼠标横跨整条栏，与空间直觉相悖
-->
<template>
  <!-- 空白处右键同样弹出菜单（作用于当前激活标签），避免落到浏览器原生菜单 -->
  <div id="tags-view-container" class="tags-view-container" ref="containerRef" @contextmenu.prevent="openContainerMenu">
    <!-- 标签滚动区：溢出时两端浮出步进箭头 + 渐变遮罩，提示内容被裁切 -->
    <div class="tags-view-main" :class="{ 'is-overflow-left': canScrollLeft, 'is-overflow-right': canScrollRight }">
      <!-- 向左滚动：浮在滚动区左端，与它要展示的左侧内容同侧，不必让鼠标横跨整条栏 -->
      <!-- 用原生 title 而非 el-tooltip：箭头此时压在页签上方，tooltip 浮层会盖住相邻页签，
           与「看清左边还有什么」的目的相悖 -->
      <button
        type="button"
        class="edge-btn edge-btn--left"
        :title="t('tagsView.scrollLeft')"
        :aria-label="t('tagsView.scrollLeft')"
        @click="scrollPaneRef?.scrollByStep('left')"
      >
        <Icon code="left" size="sm" />
      </button>

      <!-- 标签页滚动容器 -->
      <ScrollPane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
        <!-- 遍历所有访问过的视图标签 -->
        <router-link
          v-for="tag in visitedViews"
          :key="tag.path"
          :data-path="tag.path"
          :class="['tags-view-item', { 'active': isActive(tag), 'context-target': isContextTarget(tag) }]"
          :to="{ path: tag.path ? tag.path : '', query: tag.query }"
          @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @contextmenu.prevent.stop="openMenu(tag, $event)"
        >
          <!-- 标签图标 -->
          <div class="tag-icon">
            <Icon :code="tag.meta?.icon || 'nested'" size="sm" />
          </div>

          <!-- 标签文本内容 -->
          <div class="tag-text">
            {{ getTagTitle(tag) }}
          </div>

          <!-- 关闭按钮 - 仅非固定标签显示 -->
          <span v-if="!isAffix(tag)" class="close-btn" @click.prevent.stop="closeSelectedTag(tag)">
            <svg class="close-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </span>
        </router-link>
      </ScrollPane>

      <!-- 向右滚动：同理浮在滚动区右端 -->
      <button
        type="button"
        class="edge-btn edge-btn--right"
        :title="t('tagsView.scrollRight')"
        :aria-label="t('tagsView.scrollRight')"
        @click="scrollPaneRef?.scrollByStep('right')"
      >
        <Icon code="right2" size="sm" />
      </button>
    </div>

    <!-- ==================== 右侧固定操作区 ==================== -->
    <!-- 只保留「总览」「更多」两个常驻入口；步进箭头已移到滚动区两端，
         右侧宽度由约 130px 收窄到约 60px，省下的空间全部还给页签 -->
    <div class="tags-view-actions">
      <!-- 已打开页签总览：溢出时也能一眼看全并直达 -->
      <!-- 此处用原生 title 而非 el-tooltip：el-dropdown 自身即基于 popper，
           再套一层 tooltip 作为 trigger 会争抢事件导致下拉点不开 -->
      <el-dropdown trigger="click" placement="bottom-end" popper-class="tags-view-overview-popper" @command="handleOverviewCommand">
        <button type="button" class="action-btn" :title="t('tagsView.openedTabs')" :aria-label="t('tagsView.openedTabs')">
          <Icon code="down" size="sm" />
          <span class="tag-count">{{ visitedViews.length }}</span>
        </button>

        <template #dropdown>
          <el-scrollbar max-height="400px">
            <el-dropdown-menu>
              <el-dropdown-item v-for="tag in visitedViews" :key="tag.path" :command="tag" :class="['overview-item', { 'is-active': isActive(tag) }]">
                <div class="overview-icon">
                  <Icon :code="tag.meta?.icon || 'nested'" size="sm" />
                </div>
                <span class="overview-title">{{ getTagTitle(tag) }}</span>
                <!-- 固定标签不可关闭，用占位保持各行右侧对齐 -->
                <span v-if="!isAffix(tag)" class="overview-close" @click.stop="closeSelectedTag(tag)">
                  <Icon code="close" size="xs" />
                </span>
                <span v-else class="overview-close is-placeholder"></span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-scrollbar>
        </template>
      </el-dropdown>

      <!-- 全局操作：把右键菜单的能力用左键也暴露一份 -->
      <el-dropdown trigger="click" placement="bottom-end" @command="handleActionCommand">
        <!-- 用 more2 而非 more：more 带一圈外框，小尺寸下会被误认成消息气泡，
             且与左右箭头等无外框线性图标风格不统一 -->
        <button type="button" class="action-btn" :title="t('tagsView.moreActions')" :aria-label="t('tagsView.moreActions')">
          <Icon code="more2" size="sm" />
        </button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refresh">
              <Icon code="refresh" size="sm" class="mr-2" />
              {{ t('tagsView.refresh') }}
            </el-dropdown-item>
            <el-dropdown-item command="closeOthers">
              <Icon code="table-remove" size="sm" class="mr-2" />
              {{ t('tagsView.closeOthers') }}
            </el-dropdown-item>
            <el-dropdown-item command="closeLeft">
              <Icon code="left" size="sm" class="mr-2" />
              {{ t('tagsView.closeLeft') }}
            </el-dropdown-item>
            <el-dropdown-item command="closeRight">
              <Icon code="right2" size="sm" class="mr-2" />
              {{ t('tagsView.closeRight') }}
            </el-dropdown-item>
            <el-dropdown-item command="closeAll" divided>
              <Icon code="clear" size="sm" class="mr-2" />
              {{ t('tagsView.closeAll') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 右键上下文菜单 -->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <!-- 刷新当前标签页 -->
      <li @click="refreshSelectedTag(selectedTag)" class="menu-item">
        <div class="menu-icon">
          <Icon code="refresh" size="sm" />
        </div>
        <span>{{ t('tagsView.refresh') }}</span>
      </li>

      <!-- 关闭当前标签页 - 仅非固定标签显示 -->
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)" class="menu-item">
        <div class="menu-icon">
          <Icon code="close" size="sm" />
        </div>
        <span>{{ t('tagsView.closeCurrent') }}</span>
      </li>

      <!-- 关闭其他标签页 -->
      <li @click="closeOthersTags" class="menu-item">
        <div class="menu-icon">
          <Icon code="table-remove" size="sm" />
        </div>
        <span>{{ t('tagsView.closeOthers') }}</span>
      </li>

      <!-- 关闭左侧标签页 - 非第一个标签时显示 -->
      <li v-if="!isFirstView()" @click="closeLeftTags" class="menu-item">
        <div class="menu-icon">
          <Icon code="left" size="sm" />
        </div>
        <span>{{ t('tagsView.closeLeft') }}</span>
      </li>

      <!-- 关闭右侧标签页 - 非最后一个标签时显示 -->
      <li v-if="!isLastView()" @click="closeRightTags" class="menu-item">
        <div class="menu-icon">
          <Icon code="right2" size="sm" />
        </div>
        <span>{{ t('tagsView.closeRight') }}</span>
      </li>

      <!-- 关闭所有标签页 -->
      <li @click="closeAllTags(selectedTag)" class="menu-item">
        <div class="menu-icon">
          <Icon code="clear" size="sm" />
        </div>
        <span>{{ t('tagsView.closeAll') }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts" name="TagsView">
import ScrollPane from './ScrollPane.vue'
import { useRoute, useRouter, type RouteRecordRaw, type RouteLocationNormalized } from 'vue-router'
import { normalizePath } from '@/utils/string'
import { closeAllPage, closeLeftPage, closeOtherPage, closePage, closeRightPage, refreshPage } from '@/utils/tab'

// ==================== 基础工具初始化 ====================
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// 获取布局状态管理
const layout = useLayout()

// ==================== DOM 引用 ====================
const scrollPaneRef = ref<InstanceType<typeof ScrollPane>>()
const containerRef = ref<HTMLElement | null>(null)

// ==================== 右键菜单状态 ====================
const visible = ref(false) // 右键菜单显示状态
const top = ref(0) // 右键菜单垂直位置
const left = ref(0) // 右键菜单水平位置
const selectedTag = ref<RouteLocationNormalized>() // 当前选中的标签

// ==================== 标签数据状态 ====================
const affixTags = ref<RouteLocationNormalized[]>([]) // 固定标签列表

// ==================== 计算属性 ====================
/** 获取访问过的视图列表 */
const visitedViews = layout.visitedViews as any

/** 获取路由配置 */
const routes = computed(() => usePermissionStore().getRoutes())

/** 左侧是否还有被遮挡的标签（控制左箭头可用态与左侧渐变遮罩） */
const canScrollLeft = computed(() => scrollPaneRef.value?.canScrollLeft ?? false)

/** 右侧是否还有被遮挡的标签（控制右箭头可用态与右侧渐变遮罩） */
const canScrollRight = computed(() => scrollPaneRef.value?.canScrollRight ?? false)

// ==================== 标签状态判断方法 ====================
/**
 * 检查指定标签是否为当前激活状态
 */
const isActive = (r: RouteLocationNormalized): boolean => {
  return r.path === route.path
}

/**
 * 检查指定标签是否为右键菜单当前的作用目标
 *
 * 必须带上 visible 判断：closeMenu 只关菜单、不清 selectedTag
 * （菜单项点击后仍要靠它取作用对象），单看 selectedTag 会让标识在菜单关掉后残留。
 */
const isContextTarget = (r: RouteLocationNormalized): boolean => {
  return visible.value && selectedTag.value?.path === r.path
}

/**
 * 检查标签是否为固定标签（不可关闭）
 */
const isAffix = (tag: RouteLocationNormalized) => {
  return tag?.meta && tag?.meta?.affix
}

/**
 * 检查当前选中标签是否为第一个可操作的视图
 */
const isFirstView = () => {
  try {
    return selectedTag.value?.fullPath === '/index' || selectedTag.value?.fullPath === visitedViews.value[1].fullPath
  } catch (err) {
    return false
  }
}

/**
 * 检查当前选中标签是否为最后一个视图
 */
const isLastView = () => {
  try {
    return selectedTag.value?.fullPath === visitedViews.value[visitedViews.value.length - 1].fullPath
  } catch (err) {
    return false
  }
}

// ==================== 标签显示相关方法 ====================
/**
 * 将name转换为英文标题
 * @param name 路由name属性
 * @returns 转换后的英文标题
 */
const nameToTitle = (name: string) => {
  if (!name) return ''
  // 去掉末尾的数字，保留英文部分
  const cleanName = name.replace(/\d+$/, '')
  // 首字母大写
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
}

/**
 * 获取标签页标题
 * 支持国际化处理和动态参数，添加兜底方案
 */
const getTagTitle = (tag: RouteLocationNormalized) => {
  const meta = tag?.meta
  const name = tag?.name

  // 优先使用国际化键进行翻译
  if (meta?.i18nKey) {
    const i18nTitle = t(meta.i18nKey)
    // 如果翻译成功（返回值不等于键名），使用翻译结果
    if (i18nTitle !== meta.i18nKey) {
      return i18nTitle
    }
  }

  // 处理包含动态参数的标题模板
  if (meta?.title?.includes('{')) {
    try {
      return t(meta.title, meta.titleParams || {})
    } catch {
      // 解析失败时返回原始标题
      return meta.title
    }
  }

  // 降级处理：使用使用名称转换的标题或者原始标题
  return t(nameToTitle(name.toString()), meta?.title)
}

// ==================== 固定标签处理方法 ====================
/**
 * 递归筛选出所有固定标签
 */
const filterAffixTags = (routes: RouteRecordRaw[], basePath = '') => {
  let tags: RouteLocationNormalized[] = []

  routes.forEach((route) => {
    // 检查当前路由是否为固定标签
    if (route.meta && route.meta.affix) {
      const tagPath = normalizePath(basePath + '/' + route.path)
      tags.push({
        hash: '',
        matched: [],
        params: undefined,
        query: undefined,
        redirectedFrom: undefined,
        fullPath: tagPath,
        path: tagPath,
        name: route.name as string,
        meta: { ...route.meta }
      })
    }

    // 递归处理子路由
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })

  return tags
}

/**
 * 初始化固定标签
 * 在组件加载时执行，将所有固定标签添加到标签栏
 */
const initTags = () => {
  const res = filterAffixTags(routes.value)
  affixTags.value = res

  // 将固定标签添加到访问视图列表
  for (const tag of res) {
    if (tag.name) {
      layout.addVisitedView(tag)
    }
  }
}

// ==================== 标签操作核心方法 ====================
/**
 * 添加当前路由为新标签
 * 根据路由信息创建新的标签页
 */
const addTags = () => {
  const { name } = route

  // 如果查询参数中包含标题，更新路由元信息
  if (route.query.title) {
    route.meta.title = route.query.title as string
  }

  // 有效路由名称时添加到视图存储
  if (name) {
    layout.addView(route as any)
  }
}

/**
 * 滚动到当前激活的标签位置
 * 确保当前标签在可视区域内
 */
const moveToCurrentTag = async () => {
  await nextTick()
  for (const r of visitedViews.value) {
    if (r.path === route.path) {
      // 滚动到目标标签
      scrollPaneRef.value?.moveToTarget(r)
      // 如果完整路径不同则更新视图信息
      if (r.fullPath !== route.fullPath) {
        layout.updateVisitedView(route)
      }
    }
  }
}

/**
 * 跳转到最后一个可用的视图
 */
const toLastView = (visitedViews: RouteLocationNormalized[], view?: RouteLocationNormalized) => {
  const latestView = visitedViews.slice(-1)[0]

  if (latestView) {
    // 跳转到最后一个标签
    router.push(latestView.fullPath as string)
  } else {
    // 没有可用标签时的默认处理
    if (view?.name === 'Dashboard') {
      // 重载首页
      router.replace({ path: '/redirect' + view?.fullPath })
    } else {
      // 跳转到根路径
      router.push('/')
    }
  }
}

// ==================== 单个标签操作方法 ====================
/**
 * 刷新指定标签页
 */
const refreshSelectedTag = (view: RouteLocationNormalized) => {
  refreshPage(view)
  // 如果是外部链接，清除iframe视图缓存
  if (route.meta.link) {
    layout.delIframeView(route)
  }
}

/**
 * 关闭指定标签页
 */
const closeSelectedTag = (view: RouteLocationNormalized) => {
  closePage(view).then(({ visitedViews }: any) => {
    // 如果关闭的是当前激活标签，跳转到最后一个标签
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}

// ==================== 批量标签操作方法 ====================
/**
 * 关闭选中标签右侧的所有标签
 */
const closeRightTags = () => {
  closeRightPage(selectedTag.value).then((visitedViews: RouteLocationNormalized[]) => {
    // 如果当前路由被关闭，跳转到最后一个可用标签
    if (!visitedViews.find((i: RouteLocationNormalized) => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}

/**
 * 关闭选中标签左侧的所有标签
 */
const closeLeftTags = () => {
  closeLeftPage(selectedTag.value).then((visitedViews: RouteLocationNormalized[]) => {
    // 如果当前路由被关闭，跳转到最后一个可用标签
    if (!visitedViews.find((i: RouteLocationNormalized) => i.fullPath === route.fullPath)) {
      toLastView(visitedViews)
    }
  })
}

/**
 * 关闭除选中标签外的其他所有标签
 */
const closeOthersTags = () => {
  // 先跳转到选中的标签
  if (selectedTag.value) {
    router
      .push({
        path: selectedTag.value.path,
        query: selectedTag.value.query
      })
      .catch(() => {})
  }

  // 执行关闭其他标签操作
  closeOtherPage(selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}

/**
 * 关闭所有标签（保留固定标签）
 */
const closeAllTags = (view: RouteLocationNormalized) => {
  closeAllPage().then(({ visitedViews }) => {
    // 如果当前路由是固定标签，则不进行跳转
    if (affixTags.value.some((tag) => tag.path === route.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}

// ==================== 右键菜单相关方法 ====================
/**
 * 打开右键上下文菜单
 */
const openMenu = (tag: RouteLocationNormalized, e: MouseEvent) => {
  const menuMinWidth = 105 // 菜单最小宽度
  const container = containerRef.value
  if (!container) return

  // 计算菜单位置
  const offsetLeft = container.getBoundingClientRect().left
  const offsetWidth = container.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth // 左边界限制
  const l = e.clientX - offsetLeft + 15 // 15px 右边距

  // 防止菜单超出容器边界
  if (l > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = l
  }

  // 设置菜单位置和状态
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

/**
 * 在标签栏空白处右键时打开菜单
 * 此处没有具体标签，统一作用于当前激活的标签
 */
const openContainerMenu = (e: MouseEvent) => {
  const currentTag = visitedViews.value.find((tag: RouteLocationNormalized) => tag.path === route.path)
  if (!currentTag) return
  openMenu(currentTag, e)
}

/**
 * 关闭右键上下文菜单
 */
const closeMenu = () => {
  visible.value = false
}

// ==================== 右侧操作区处理方法 ====================
/**
 * 页签总览下拉：点击某一项时跳转到对应页面
 *
 * @param tag - 被点击的标签
 */
const handleOverviewCommand = (tag: RouteLocationNormalized) => {
  if (isActive(tag)) return
  router.push({ path: tag.path, query: tag.query }).catch(() => {})
}

/**
 * 全局操作下拉：作用对象统一为当前激活标签
 * 与右键菜单共用底层方法，避免两套实现产生行为差异
 *
 * @param command - 操作类型
 */
const handleActionCommand = (command: string) => {
  const currentTag = visitedViews.value.find((tag: RouteLocationNormalized) => tag.path === route.path)
  if (!currentTag) return

  selectedTag.value = currentTag

  switch (command) {
    case 'refresh':
      refreshSelectedTag(currentTag)
      break
    case 'closeOthers':
      closeOthersTags()
      break
    case 'closeLeft':
      closeLeftTags()
      break
    case 'closeRight':
      closeRightTags()
      break
    case 'closeAll':
      closeAllTags(currentTag)
      break
  }
}

/**
 * 处理滚动事件
 * 滚动时自动关闭右键菜单
 */
const handleScroll = () => {
  closeMenu()
}

// ==================== 监听器设置 ====================
// 监听路由变化，自动添加和定位到当前标签
watch(route, () => {
  addTags()
  moveToCurrentTag()
})

// 监听右键菜单显示状态，动态绑定/解绑全局点击事件
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

// ==================== 生命周期钩子 ====================
// 组件挂载时的初始化操作
onMounted(() => {
  initTags() // 初始化固定标签
  addTags() // 添加当前路由标签
})
</script>

<style lang="scss" scoped>
/* ==================== 页签视图容器 ==================== */
.tags-view-container {
  height: 40px;
  width: 100%;
  background-color: var(--header-bg);
  transition: all var(--duration-normal) ease;
  padding: 0 16px; /* 与 AppMain 的 p-4 (16px) 保持一致 */

  /* 左侧滚动区自适应、右侧操作区固定 */
  display: flex;
  align-items: center;

  /* ==================== 标签滚动区（含溢出遮罩） ==================== */
  .tags-view-main {
    flex: 1;
    min-width: 0; /* 允许被压缩，否则 flex 子项会被内容撑开导致右侧操作区被挤出 */
    height: 100%;
    position: relative;

    /* 两侧渐变遮罩：用视觉虚化告诉用户内容被裁切了，还有更多标签。
       宽度取 48px 而非 24px —— 要容得下 22px 的浮动箭头，并在箭头外侧留一段渐变。

       渐变前 55%（约 26px，正好盖住箭头所在区域）保持栏底纯色、之后才过渡到透明：
       箭头是不透明圆形，若它下方的标签仍清晰可见，会读成"标签被切了一刀"；
       让标签在进入箭头区域前就淡尽，视觉上才是"内容向外渐隐、箭头浮在空处" */
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 48px;
      pointer-events: none; /* 不能挡住标签的点击 */
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 1;
    }

    &::before {
      left: 0;
      background: linear-gradient(to right, var(--header-bg) 55%, transparent);
    }

    &::after {
      right: 0;
      background: linear-gradient(to left, var(--header-bg) 55%, transparent);
    }

    &.is-overflow-left::before,
    &.is-overflow-right::after {
      opacity: 1;
    }

    /* ==================== 两端浮动步进箭头 ==================== */
    /* 绝对定位、不占布局宽度，因此可以安全地随溢出状态淡入淡出：
       旧版箭头在布局流内，隐藏会改变右侧操作区宽度 → 改变滚动区宽度 →
       再次触发 ResizeObserver，临界宽度下会无限震荡，只能常驻显示禁用态。
       浮层结构从根本上不存在这个回环，于是「没内容可滚就不显示箭头」得以成立 */
    .edge-btn {
      position: absolute;
      top: 50%;
      z-index: 2; /* 压在渐变遮罩(z-index:1)之上 */
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: var(--el-bg-color-overlay);
      color: var(--el-text-color-regular);
      box-shadow: 0 1px 4px rgb(0 0 0 / 12%);
      cursor: pointer;
      outline: none;
      opacity: 0;
      pointer-events: none; /* 隐藏时不可点，避免误触到看不见的按钮 */
      transform: translateY(-50%);
      transition:
        opacity 0.2s ease,
        background 0.2s ease,
        color 0.2s ease;

      &:hover {
        background: var(--el-color-primary);
        color: #fff;
      }

      /* transform 已被 translateY 占用，按下反馈需连同位移一起写 */
      &:active {
        transform: translateY(-50%) scale(0.94);
      }

      &--left {
        left: 0;
      }

      &--right {
        right: 0;
      }
    }

    /* 仅在该方向确有内容被遮挡时才浮出对应箭头 */
    &.is-overflow-left .edge-btn--left,
    &.is-overflow-right .edge-btn--right {
      opacity: 1;
      pointer-events: auto;
    }
  }

  /* ==================== 右侧固定操作区 ==================== */
  .tags-view-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0; /* 永不被压缩，保证操作入口始终可见 */
    padding-left: 8px;
    margin-left: 4px;
    border-left: 1px solid var(--el-border-color-lighter);

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      height: 26px;
      min-width: 26px;
      padding: 0 5px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--el-text-color-regular);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;

      &:hover:not(:disabled) {
        background: var(--el-fill-color-light);
        color: var(--el-color-primary);
      }

      &:active:not(:disabled) {
        transform: scale(0.94);
      }

      /* 禁用态保留占位，仅降低存在感，避免节点增删导致布局抖动 */
      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      /* 已打开数量角标 */
      .tag-count {
        font-size: 12px;
        font-weight: 500;
        line-height: 1;
      }
    }
  }

  /* ==================== 标签包装器 ==================== */
  .tags-view-wrapper {
    .tags-view-item {
      vertical-align: middle; /* 居中对齐 */
      display: inline-flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      height: 30px;
      line-height: 30px;
      /* 不填底色：栏底(--header-bg)与标签白底几乎同色，逐个填白只会让边框成为唯一可见信息 */
      background-color: transparent;
      color: var(--el-text-color-regular);
      padding: 0 10px;
      font-size: 13px;
      margin-left: 6px;
      flex-shrink: 0; /* 滚动容器已改为 flex，禁止标签被压缩变形 */
      border-radius: 6px;
      /* 边框降到最浅一档：多标签并排时只留轮廓感，不形成一排刺眼的「小方框墙」 */
      border: 1px solid var(--el-border-color-lighter);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      font-weight: 450;

      /* ==================== 激活状态 ==================== */
      /* 浅底 + 主题色描边 + 主题色文字三重信号叠加。
         旧版仅靠文字变色与 1px 上浮，标签一多就分不出当前页；
         这里不再使用 translateY —— 密排时逐个上浮会让整排基线看着发抖 */
      &.active {
        background-color: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
        font-weight: 500;

        /* 激活状态下的图标和关闭按钮也使用主题色 */
        .tag-icon {
          color: var(--el-color-primary);
          opacity: 1;
        }

        .close-btn {
          color: var(--el-color-primary);
          opacity: 0.7;
        }

        /* 激活状态下的关闭按钮悬停效果 */
        .close-btn:hover {
          background: var(--el-fill-color); /* 淡色背景圈 */
        }
      }

      /* ==================== 标签图标 ==================== */
      .tag-icon {
        display: flex;
        align-items: center;
        margin-right: 6px;
        flex-shrink: 0;
        opacity: 0.8;
        transition: opacity 0.2s ease;

        .icon-svg {
          width: 14px;
          height: 14px;
        }
      }

      /* ==================== 标签文本 ==================== */
      .tag-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 140px; /* 更宽的文本区域 */
      }

      /* ==================== 关闭按钮 ==================== */
      /* 默认透明、hover 或激活时才显形：常驻的话每个标签右侧都挂一个 ×，
         与图标、文字挤在一起会明显加重杂乱感。
         注意只切 opacity 不切 display —— 宽度必须恒定，否则显隐会改变标签宽度，
         进而改变滚动区内容宽度并触发 ResizeObserver 重算 */
      .close-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 6px;
        margin-right: -3px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: transparent; /* 默认无背景 */
        opacity: 0;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        flex-shrink: 0;
        color: currentColor;

        .close-icon {
          width: 12px;
          height: 12px;
        }
      }

      /* ==================== 悬停效果 ==================== */
      &:hover {
        background-color: var(--el-fill-color-light);
        border-color: var(--el-border-color);
        color: var(--el-color-primary);

        .tag-icon {
          opacity: 1;
          color: var(--el-color-primary);
        }

        .close-btn {
          opacity: 0.55;
        }

        /* 激活状态悬停时保持激活配色，不被普通悬停样式覆盖 */
        &.active {
          background-color: var(--el-color-primary-light-9);
          border-color: var(--el-color-primary);
          color: var(--el-color-primary);

          .tag-icon {
            color: var(--el-color-primary);
          }

          .close-btn {
            opacity: 1;
          }
        }
      }

      /* ==================== 右键作用目标 ==================== */
      /*
        菜单一弹出鼠标就移到菜单上，hover 随即消失；若被右键的标签不是当前页，
        它会失去全部视觉标识，而「关闭当前 / 关闭左侧 / 关闭右侧」全以它为基准 —— 等于盲操作。

        用【虚线描边】标目标：线型变化比颜色深浅更容易一眼识别，
        与 .active 的实线描边形成明确对比，两者重合时也能分辨（浅底 + 虚线）。

        刻意【不设背景色、不加字重】：这两样都是 .active 的专属信号，
        右键目标占用了就分不清「当前页」和「右键目标」——
        目标只需被"标出来"，不需要像当前页那样被"强调"。

        虚线只换 border-style，宽度仍是 1px，标签宽度恒定；
        这一点必须守住 —— 宽度一变就会改变滚动区内容宽度并触发 ResizeObserver 重算
        （同 .close-btn 处「只切 opacity 不切 display」的约束）。

        放在 :hover 之后：两者特异度相同，靠后定义才能保证悬停在目标上时标识不被 hover 覆盖。
      */
      &.context-target {
        border-style: dashed;
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);

        .tag-icon {
          color: var(--el-color-primary);
          opacity: 1;
        }

        .close-btn {
          opacity: 0.7;
        }
      }

      /* 关闭按钮悬停 */
      .close-btn:hover {
        opacity: 1 !important;
        background: var(--el-fill-color); /* 淡色背景圈 */
        transform: scale(1.1); /* 轻微放大 */
      }

      /* ==================== 边距优化 ==================== */
      &:first-of-type {
        margin-left: 0; /* 第一个标签无左边距 */
      }

      &:last-of-type {
        margin-right: 12px;
      }
    }
  }

  /* ==================== 右键上下文菜单 ==================== */
  .contextmenu {
    margin: 0;
    background: var(--el-bg-color-overlay);
    z-index: 1000;
    position: absolute;
    list-style-type: none;
    padding: 8px 6px; /* art-design-pro 风格的内边距 */
    border-radius: 8px; /* 更大的圆角 */
    font-size: 13px;
    font-weight: 400;
    border: 1px solid var(--el-border-color-light);
    box-shadow:
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05); /* art-design-pro 特色阴影 */
    backdrop-filter: blur(12px); /* 毛玻璃效果 */
    min-width: 140px;

    /* ==================== 菜单项 ==================== */
    .menu-item {
      margin: 2px 0;
      padding: 0 12px; /* 移除上下内边距，使用固定高度 */
      height: 32px; /* 与页签高度保持一致 */
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      color: var(--el-text-color-regular);
      border-radius: 6px;
      background: transparent;

      /* ==================== 菜单图标 ==================== */
      .menu-icon {
        margin-right: 10px;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        color: currentColor;
        opacity: 0.75;
        transition: opacity 0.2s ease;
      }

      /* ==================== 悬停效果 ==================== */
      &:hover {
        background: var(--el-fill-color-light);
        color: var(--el-color-primary);
        transform: translateX(2px);

        .menu-icon {
          opacity: 1;
          color: var(--el-color-primary);
        }
      }

      /* ==================== 激活效果 ==================== */
      &:active {
        transform: scale(0.98);
      }
    }
  }
}

/* ==================== 深色模式优化 ==================== */
/*
  本项目深色模式由 html.dark 类驱动（见 assets/styles/themes/_dark.scss），
  prefers-color-scheme 只跟随系统、跟不上站内手动切换，因此这里以 :global(html.dark) 为准。
  scoped 样式下 html 不带组件 hash，必须用 :global 包住才能命中。
*/
:global(html.dark) {
  .tags-view-container {
    .tags-view-main {
      /* 浮动箭头在深色底上要更重的投影才浮得起来，同时补一圈描边与栏底分离 */
      .edge-btn {
        background: var(--el-bg-color-overlay);
        border: 1px solid var(--el-border-color-lighter);
        box-shadow: 0 2px 6px rgb(0 0 0 / 45%);

        &:hover {
          background: var(--el-color-primary);
          border-color: var(--el-color-primary);
          color: #fff;
        }
      }
    }

    .tags-view-wrapper {
      .tags-view-item {
        /*
          element-plus 暗色下 --el-color-primary-light-9 仍是接近白的浅蓝，
          直接用作激活底色会在深色栏上形成刺眼亮块。
          改用主题色 16% 透明度叠在栏底上：既保留"有底色"的识别信号，又与深色背景融合。
        */
        &.active {
          background-color: rgb(59 130 246 / 16%);
        }

        &:hover.active {
          background-color: rgb(59 130 246 / 24%);
        }
      }
    }

    .contextmenu {
      background: var(--el-bg-color-overlay);
      box-shadow:
        0 6px 16px 0 rgba(0, 0, 0, 0.3),
        0 3px 6px -4px rgba(0, 0, 0, 0.4),
        0 9px 28px 8px rgba(0, 0, 0, 0.2);
    }
  }
}

/* ==================== 移动端响应式 ==================== */
@media (max-width: 768px) {
  .tags-view-container {
    height: 36px;
    padding: 0 16px; /* 移动端也保持 16px */

    .tags-view-actions {
      padding-left: 4px;
      margin-left: 2px;
    }

    /* 触屏可直接滑动滚动，浮动箭头既无必要又会遮挡本就狭窄的页签区，窄屏一律不显示。
       箭头是绝对定位浮层，隐藏不影响布局宽度，可以放心用 display:none */
    .tags-view-main {
      .edge-btn {
        display: none;
      }

      /* 箭头隐藏后遮罩不必再为它留位，收回到纯提示宽度，并还原为柔和渐变 */
      &::before {
        width: 24px;
        background: linear-gradient(to right, var(--header-bg), transparent);
      }

      &::after {
        width: 24px;
        background: linear-gradient(to left, var(--header-bg), transparent);
      }
    }

    .tags-view-wrapper {
      .tags-view-item {
        height: 28px;
        line-height: 28px;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 4px;

        .tag-text {
          max-width: 80px;
        }

        /* 触屏没有 hover，关闭按钮必须常驻，否则无法关闭页签 */
        .close-btn {
          width: 16px;
          height: 16px;
          opacity: 0.55;

          .close-icon {
            width: 10px;
            height: 10px;
          }
        }
      }
    }

    .contextmenu {
      min-width: 120px;
      padding: 6px 4px;

      .menu-item {
        padding: 0 10px; /* 移除上下内边距 */
        height: 28px; /* 与移动端页签高度保持一致 */
        font-size: 12px;
      }
    }
  }
}

/* ==================== 平板响应式 ==================== */
@media (min-width: 769px) and (max-width: 1024px) {
  .tags-view-container {
    .tags-view-wrapper {
      .tags-view-item {
        .tag-text {
          max-width: 100px;
        }
      }
    }
  }
}

/* ==================== 无悬停能力设备（触屏） ==================== */
/*
  上面的移动端断点按「屏幕宽度」判断，覆盖不到宽屏触屏设备（平板横屏、触屏笔记本）。
  这类设备同样没有 hover：关闭按钮若维持 opacity:0 就永远点不到，页签只能靠右键菜单关闭。
  这里按「输入能力」而非屏幕宽度兜底，让关闭按钮常驻可见。
*/
@media (hover: none) {
  .tags-view-container {
    .tags-view-wrapper {
      .tags-view-item {
        .close-btn {
          opacity: 0.55;
        }

        &.active .close-btn {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>

<!--
  页签总览下拉面板样式
  el-dropdown 的浮层通过 teleport 挂到 body 上，不在组件作用域内，
  因此必须写在非 scoped 的样式块中，靠 popper-class 限定范围
-->
<style lang="scss">
.tags-view-overview-popper {
  .el-dropdown-menu {
    padding: 4px;
  }

  .overview-item {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 220px;
    padding: 0 8px;
    height: 34px;
    border-radius: 6px;
    font-size: 13px;

    /* 当前所在页高亮，便于在长列表中定位自己 */
    &.is-active {
      color: var(--el-color-primary);
      font-weight: 500;
      background: var(--el-color-primary-light-9);
    }

    .overview-icon {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      opacity: 0.8;
    }

    .overview-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 220px;
    }

    .overview-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      border-radius: 50%;
      opacity: 0.5;
      transition: all 0.2s ease;

      &:hover {
        opacity: 1;
        background: var(--el-fill-color);
        color: var(--el-color-danger);
      }

      /* 固定标签不可关闭，用等宽占位保持右侧对齐 */
      &.is-placeholder {
        pointer-events: none;
      }
    }
  }
}
</style>
