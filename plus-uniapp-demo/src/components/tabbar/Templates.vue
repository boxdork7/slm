<!-- 模板库示例索引 -->
<template>
  <view class="min-h-screen bg-#f9f9f9">
    <wd-navbar title="模板库" />

    <!-- 搜索框 -->
    <view class="fixed z-10 w-100vw">
      <wd-search
        v-model="keyword"
        light
        placeholder="搜索模板"
        @change="handleSearch"
        @clear="handleClear"
      >
        <template #suffix>
          <view class="px-4 text-xs">共{{ filteredCount }}个模板</view>
        </template>
      </wd-search>
    </view>

    <!-- 模板分类列表 -->
    <view class="px-4 pb-8 pt-15">
      <!-- 电商类 -->
      <wd-cell-group v-if="filteredTemplates.ecommerce.length" title="电商类" custom-class="mb-4">
        <wd-cell
          v-for="template in filteredTemplates.ecommerce"
          :key="template.id"
          :title="`${template.name}-${template.description}`"
          is-link
          @click="navigateToTemplate(template.id, template.category)"
        />
      </wd-cell-group>

      <!-- 资讯新闻类 -->
      <wd-cell-group v-if="filteredTemplates.news.length" title="资讯新闻类" custom-class="mb-4">
        <wd-cell
          v-for="template in filteredTemplates.news"
          :key="template.id"
          :title="`${template.name}-${template.description}`"
          is-link
          @click="navigateToTemplate(template.id, template.category)"
        />
      </wd-cell-group>

      <!-- 社交社区类 -->
      <wd-cell-group v-if="filteredTemplates.social.length" title="社交社区类" custom-class="mb-4">
        <wd-cell
          v-for="template in filteredTemplates.social"
          :key="template.id"
          :title="`${template.name}-${template.description}`"
          is-link
          @click="navigateToTemplate(template.id, template.category)"
        />
      </wd-cell-group>

      <!-- 教育培训类 -->
      <wd-cell-group
        v-if="filteredTemplates.education.length"
        title="教育培训类"
        custom-class="mb-4"
      >
        <wd-cell
          v-for="template in filteredTemplates.education"
          :key="template.id"
          :title="`${template.name}-${template.description}`"
          is-link
          @click="navigateToTemplate(template.id, template.category)"
        />
      </wd-cell-group>

      <!-- 生活服务类 -->
      <wd-cell-group
        v-if="filteredTemplates.lifestyle.length"
        title="生活服务类"
        custom-class="mb-4"
      >
        <wd-cell
          v-for="template in filteredTemplates.lifestyle"
          :key="template.id"
          :title="`${template.name}-${template.description}`"
          is-link
          @click="navigateToTemplate(template.id, template.category)"
        />
      </wd-cell-group>

      <!-- 企业官网类 -->
      <wd-cell-group
        v-if="filteredTemplates.corporate.length"
        title="企业官网类"
        custom-class="mb-4"
      >
        <wd-cell
          v-for="template in filteredTemplates.corporate"
          :key="template.id"
          :title="`${template.name}-${template.description}`"
          is-link
          @click="navigateToTemplate(template.id, template.category)"
        />
      </wd-cell-group>

      <!-- 娱乐游戏类 -->
      <wd-cell-group
        v-if="filteredTemplates.entertainment.length"
        title="娱乐游戏类"
        custom-class="mb-4"
      >
        <wd-cell
          v-for="template in filteredTemplates.entertainment"
          :key="template.id"
          :title="`${template.name}-${template.description}`"
          is-link
          @click="navigateToTemplate(template.id, template.category)"
        />
      </wd-cell-group>

      <!-- 工具类 -->
      <wd-cell-group v-if="filteredTemplates.tools.length" title="工具类" custom-class="mb-4">
        <wd-cell
          v-for="template in filteredTemplates.tools"
          :key="template.id"
          :title="`${template.name}-${template.description}`"
          is-link
          @click="navigateToTemplate(template.id, template.category)"
        />
      </wd-cell-group>

      <!-- 金融理财类 -->
      <wd-cell-group v-if="filteredTemplates.finance.length" title="金融理财类" custom-class="mb-4">
        <wd-cell
          v-for="template in filteredTemplates.finance"
          :key="template.id"
          :title="`${template.name}-${template.description}`"
          is-link
          @click="navigateToTemplate(template.id, template.category)"
        />
      </wd-cell-group>

      <!-- 无搜索结果提示 -->
      <wd-status-tip v-if="isNoResults" image="search" tip="未找到相关模板" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 搜索关键词
const keyword = ref('')

// 完整的模板列表
const allTemplates = [
  // 电商类模板
  { id: 'mallBasic', name: '基础商城', description: '商品展示购买', category: 'ecommerce' },
  { id: 'mallFresh', name: '生鲜商城', description: '生鲜配送', category: 'ecommerce' },

  // 资讯新闻类模板
  { id: 'newsBasic', name: '新闻资讯', description: '新闻浏览', category: 'news' },
  { id: 'newsTech', name: '科技资讯', description: '科技新闻', category: 'news' },

  // 社交社区类模板
  { id: 'socialForum', name: '论坛社区', description: '话题讨论', category: 'social' },
  { id: 'socialBlog', name: '个人博客', description: '文章发布', category: 'social' },

  // 教育培训类模板
  { id: 'eduOnline', name: '在线教育', description: '课程学习', category: 'education' },
  { id: 'eduExam', name: '考试题库', description: '模拟考试', category: 'education' },

  // 生活服务类模板
  { id: 'lifeDelivery', name: '外卖配送', description: '餐厅点餐', category: 'lifestyle' },
  { id: 'lifeMedical', name: '医疗健康', description: '在线问诊', category: 'lifestyle' },

  // 企业官网类模板
  { id: 'corpBasic', name: '企业官网', description: '公司展示', category: 'corporate' },

  // 娱乐游戏类模板
  { id: 'gamePuzzle', name: '休闲游戏', description: '益智闯关', category: 'entertainment' },
  { id: 'gameVideo', name: '短视频', description: '视频分享', category: 'entertainment' },

  // 工具类模板
  { id: 'toolWeather', name: '天气查询', description: '天气预报', category: 'tools' },
  { id: 'toolCalculator', name: '计算器', description: '科学计算', category: 'tools' },

  // 金融理财类模板
  { id: 'financeBudget', name: '记账理财', description: '收支记录', category: 'finance' },
]

// 定义分类映射表，方便搜索时匹配
const categoryMap = {
  ecommerce: '电商类',
  news: '资讯新闻类',
  social: '社交社区类',
  education: '教育培训类',
  lifestyle: '生活服务类',
  corporate: '企业官网类',
  entertainment: '娱乐游戏类',
  tools: '工具类',
  finance: '金融理财类',
}

// 按分类过滤后的模板列表
const filteredTemplates = computed(() => {
  const filtered = keyword.value
    ? allTemplates.filter((template) => {
        const searchTerm = keyword.value.toLowerCase()
        const categoryName = categoryMap[template.category] || ''
        const categoryKey = template.category.toLowerCase()

        return (
          template.name.toLowerCase().includes(searchTerm) ||
          template.description.toLowerCase().includes(searchTerm) ||
          template.id.toLowerCase().includes(searchTerm) ||
          categoryName.includes(keyword.value) || // 支持中文分类名搜索
          categoryKey.includes(searchTerm) // 支持英文分类名模糊搜索
        )
      })
    : allTemplates

  return {
    ecommerce: filtered.filter((t) => t.category === 'ecommerce'),
    news: filtered.filter((t) => t.category === 'news'),
    social: filtered.filter((t) => t.category === 'social'),
    education: filtered.filter((t) => t.category === 'education'),
    lifestyle: filtered.filter((t) => t.category === 'lifestyle'),
    corporate: filtered.filter((t) => t.category === 'corporate'),
    entertainment: filtered.filter((t) => t.category === 'entertainment'),
    tools: filtered.filter((t) => t.category === 'tools'),
    finance: filtered.filter((t) => t.category === 'finance'),
  }
})

// 筛选后的模板总数
const filteredCount = computed(() => {
  const filtered = filteredTemplates.value
  return (
    filtered.ecommerce.length +
    filtered.news.length +
    filtered.social.length +
    filtered.education.length +
    filtered.lifestyle.length +
    filtered.corporate.length +
    filtered.entertainment.length +
    filtered.tools.length +
    filtered.finance.length
  )
})

// 是否无搜索结果
const isNoResults = computed(() => {
  return keyword.value && filteredCount.value === 0
})

/**
 * 处理搜索
 */
const handleSearch = () => {
  // 搜索逻辑由 computed 自动处理
}

/**
 * 处理清空搜索
 */
const handleClear = () => {
  keyword.value = ''
}

/**
 * 导航到模板详情页面
 * @param templateId 模板ID
 * @param category 模板分类
 */
const navigateToTemplate = (templateId: string, category: string) => {
  uni.navigateTo({
    url: `/pages-sub/templates/${category}/${templateId}`,
  })
}

const { resetScrollTop, updateScrollTop } = useScroll()

onShow(() => {
  resetScrollTop() // 页面显示时重置，避免页面切换时状态错误
})

onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style scoped lang="scss">
:deep(.wd-cell__left) {
  flex: 2;
}
</style>
