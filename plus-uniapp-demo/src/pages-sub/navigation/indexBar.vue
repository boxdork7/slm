<!-- IndexBar 索引栏 http://127.0.0.1:100/#/pages-sub/demo/wd/index-bar -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="IndexBar 索引栏" show-back />

    <!-- 基本用法示例 -->
    <DemoSection title="基本用法" desc="用于列表的索引分类显示和快速定位">
      <!-- 示例效果展示 -->
      <view class="demo-wrapper">
        <wd-index-bar>
          <view v-for="item in basicList" :key="item.index">
            <wd-index-anchor :index="item.index" />
            <wd-cell
              v-for="city in item.data"
              :key="city"
              clickable
              border
              :title="city"
              @click="handleBasicClick(item.index, city)"
            />
          </view>
        </wd-index-bar>
      </view>

      <!-- 代码展示 -->
      <template #codes>
        <DemoCode title="模板 - 基本用法" :code="codes.basic.template" />
        <DemoCode title="脚本 - 基本用法" :code="codes.basic.script" />
      </template>
    </DemoSection>

    <!-- 吸顶模式示例 -->
    <DemoSection title="吸顶模式" desc="开启sticky属性，索引标题支持吸顶效果">
      <!-- 示例效果展示 -->
      <view class="demo-wrapper">
        <wd-index-bar sticky>
          <view v-for="item in stickyList" :key="item.index">
            <wd-index-anchor :index="item.index" />
            <wd-cell
              v-for="city in item.data"
              :key="city"
              clickable
              border
              :title="city"
              @click="handleStickyClick(city)"
            />
          </view>
        </wd-index-bar>
      </view>

      <template #codes>
        <DemoCode title="模板 - 吸顶模式" :code="codes.sticky.template" />
        <DemoCode title="脚本 - 吸顶模式" :code="codes.sticky.script" />
      </template>
    </DemoSection>

    <!-- 自定义内容示例 -->
    <DemoSection title="自定义内容" desc="可以在索引锚点中自定义内容">
      <!-- 示例效果展示 -->
      <view class="demo-wrapper">
        <wd-index-bar>
          <view v-for="item in customList" :key="item.index">
            <wd-index-anchor :index="item.index">
              <view class="custom-anchor">
                <wd-icon :name="item.icon" size="20" color="#4D80F0" />
                <text class="custom-anchor-text">{{ item.title }}</text>
              </view>
            </wd-index-anchor>
            <wd-cell
              v-for="contact in item.data"
              :key="contact.name"
              clickable
              border
              :title="contact.name"
              :label="contact.phone"
              @click="handleCustomClick(contact)"
            />
          </view>
        </wd-index-bar>
      </view>

      <template #codes>
        <DemoCode title="模板 - 自定义内容" :code="codes.custom.template" />
        <DemoCode title="脚本 - 自定义内容" :code="codes.custom.script" />
      </template>
    </DemoSection>

    <!-- 搜索联动示例 -->
    <DemoSection title="搜索联动" desc="结合搜索组件实现过滤功能">
      <!-- 示例效果展示 -->
      <view class="search-demo-wrapper">
        <!-- 搜索框 -->
        <view class="search-section">
          <wd-search
            v-model="searchKeyword"
            hide-cancel
            placeholder="搜索城市名称"
            @search="handleSearchSubmit"
            @clear="handleSearchClear"
            @input="handleSearchInput"
          />
        </view>

        <!-- 索引栏 -->
        <view class="search-result-wrapper">
          <wd-index-bar v-if="filteredCityList.length" sticky>
            <view v-for="item in filteredCityList" :key="item.index">
              <wd-index-anchor :index="item.index" />
              <wd-cell
                v-for="city in item.data"
                :key="city"
                clickable
                border
                :title="city"
                @click="handleSearchClick(item.index, city)"
              />
            </view>
          </wd-index-bar>
          <view v-else class="no-result">
            <wd-icon name="inbox" size="60" color="#ddd" />
            <view class="no-result-text">暂无匹配的城市</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 搜索联动" :code="codes.search.template" />
        <DemoCode title="脚本 - 搜索联动" :code="codes.search.script" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景示例">
      <!-- 通讯录场景 -->
      <view class="space-y-4">
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">通讯录管理</view>
          <view class="demo-wrapper">
            <wd-index-bar sticky>
              <view v-for="group in contactList" :key="group.index">
                <wd-index-anchor :index="group.index" />
                <wd-cell
                  v-for="contact in group.data"
                  :key="contact.id"
                  clickable
                  border
                  :title="contact.name"
                  :label="contact.department"
                  @click="handleContactClick(contact)"
                >
                  <template #icon>
                    <view class="contact-avatar">
                      {{ contact.name.charAt(0) }}
                    </view>
                  </template>
                  <template #right-icon>
                    <wd-icon name="phone" size="20" color="#999" />
                  </template>
                </wd-cell>
              </view>
            </wd-index-bar>
          </view>
        </view>

        <!-- 城市选择场景 -->
        <view>
          <view class="mb-3 px-4 text-sm text-gray-700 font-medium">城市选择器</view>
          <view class="demo-wrapper">
            <wd-index-bar>
              <view v-for="region in regionList" :key="region.index">
                <wd-index-anchor :index="region.index">
                  <view class="region-anchor">
                    <text class="region-text">{{ region.name }}</text>
                    <text class="region-count">({{ region.data.length }})</text>
                  </view>
                </wd-index-anchor>
                <wd-cell
                  v-for="city in region.data"
                  :key="city.code"
                  clickable
                  border
                  :title="city.name"
                  :label="`区号：${city.code}`"
                  @click="handleCitySelect(city)"
                />
              </view>
            </wd-index-bar>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 通讯录管理" :code="codes.scenarios.contactTemplate" />
        <DemoCode title="脚本 - 通讯录管理" :code="codes.scenarios.contactScript" />
        <DemoCode title="模板 - 城市选择器" :code="codes.scenarios.cityTemplate" />
        <DemoCode title="脚本 - 城市选择器" :code="codes.scenarios.cityScript" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi
      title="IndexBar"
      :props="indexBarProps"
      :methods="indexBarMethods"
      :events="indexBarEvents"
    />

    <DemoApi
      title="IndexAnchor"
      :props="indexAnchorProps"
      :methods="indexAnchorMethods"
      :events="indexAnchorEvents"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// ===== 组件状态管理 =====

// 搜索关键词
const searchKeyword = ref<string>('')

// 基本用法数据
const basicList = ref([
  {
    index: 'A',
    data: ['阿坝', '阿拉善', '阿里', '安康', '安庆'],
  },
  {
    index: 'B',
    data: ['北京', '白银', '保定', '宝鸡', '保山'],
  },
  {
    index: 'C',
    data: ['重庆', '成都', '长沙', '长春', '沧州'],
  },
])

// 吸顶模式数据
const stickyList = ref([
  {
    index: '热门',
    data: ['北京', '上海', '广州', '深圳', '杭州'],
  },
  {
    index: 'A',
    data: ['阿坝', '阿拉善', '阿里', '安康', '安庆', '安山', '安顺', '安阳', '澳门'],
  },
  {
    index: 'B',
    data: ['北京', '白银', '保定', '宝鸡', '保山', '包头', '巴中', '北海', '蚌埠', '本溪'],
  },
  {
    index: 'C',
    data: ['重庆', '成都', '长沙', '长春', '沧州', '常德', '昌都', '长治', '常州', '巢湖'],
  },
])

// 自定义内容数据
const customList = ref([
  {
    index: 'F',
    icon: 'star-on',
    title: '收藏联系人',
    data: [
      { name: '张三', phone: '138****1234' },
      { name: '李四', phone: '139****5678' },
    ],
  },
  {
    index: 'R',
    icon: 'clock',
    title: '最近联系',
    data: [
      { name: '王五', phone: '136****9012' },
      { name: '赵六', phone: '137****3456' },
    ],
  },
])

// 完整城市列表数据
const fullCityList = ref([
  {
    index: '热门',
    data: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '苏州', '天津'],
  },
  {
    index: 'A',
    data: ['阿坝', '阿拉善', '阿里', '安康', '安庆', '安山', '安顺', '安阳', '澳门'],
  },
  {
    index: 'B',
    data: [
      '北京',
      '白银',
      '保定',
      '宝鸡',
      '保山',
      '包头',
      '巴中',
      '北海',
      '蚌埠',
      '本溪',
      '毕节',
      '滨州',
      '百色',
      '亳州',
    ],
  },
  {
    index: 'C',
    data: [
      '重庆',
      '成都',
      '长沙',
      '长春',
      '沧州',
      '常德',
      '昌都',
      '长治',
      '常州',
      '巢湖',
      '潮州',
      '承德',
      '郴州',
      '赤峰',
      '池州',
      '崇左',
      '楚雄',
      '滁州',
      '朝阳',
    ],
  },
  {
    index: 'D',
    data: [
      '大连',
      '东莞',
      '大理',
      '丹东',
      '大庆',
      '大同',
      '大兴安岭',
      '德宏',
      '德阳',
      '德州',
      '定西',
      '迪庆',
      '东营',
    ],
  },
  {
    index: 'F',
    data: ['福州', '防城港', '佛山', '抚顺', '抚州', '阜新', '阜阳'],
  },
  {
    index: 'G',
    data: ['广州', '桂林', '贵阳', '赣南', '赣州', '甘孜', '广安', '广元', '贵港', '果洛'],
  },
  {
    index: 'H',
    data: [
      '杭州',
      '哈尔滨',
      '合肥',
      '海口',
      '呼和浩特',
      '海北',
      '海东',
      '海南',
      '海西',
      '邯郸',
      '汉中',
    ],
  },
])

// 通讯录数据
const contactList = ref([
  {
    index: 'A',
    data: [
      { id: 1, name: '安小明', department: '技术部', phone: '138****1234' },
      { id: 2, name: '安小红', department: '市场部', phone: '139****5678' },
    ],
  },
  {
    index: 'B',
    data: [
      { id: 3, name: '白小华', department: '人事部', phone: '136****9012' },
      { id: 4, name: '包小丽', department: '财务部', phone: '137****3456' },
    ],
  },
  {
    index: 'C',
    data: [
      { id: 5, name: '陈小强', department: '技术部', phone: '135****7890' },
      { id: 6, name: '崔小芳', department: '运营部', phone: '134****2345' },
    ],
  },
])

// 地区数据
const regionList = ref([
  {
    index: '华北',
    name: '华北地区',
    data: [
      { name: '北京', code: '010' },
      { name: '天津', code: '022' },
      { name: '石家庄', code: '0311' },
    ],
  },
  {
    index: '华东',
    name: '华东地区',
    data: [
      { name: '上海', code: '021' },
      { name: '杭州', code: '0571' },
      { name: '南京', code: '025' },
    ],
  },
  {
    index: '华南',
    name: '华南地区',
    data: [
      { name: '广州', code: '020' },
      { name: '深圳', code: '0755' },
      { name: '佛山', code: '0757' },
    ],
  },
])

// 搜索过滤后的城市列表
const filteredCityList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return fullCityList.value
  }

  return fullCityList.value
    .map((group) => ({
      ...group,
      data: group.data.filter((city) =>
        city.toLowerCase().includes(searchKeyword.value.toLowerCase()),
      ),
    }))
    .filter((group) => group.data.length > 0)
})

// ===== 代码片段定义 =====

const codes = {
  // 基本用法代码
  basic: {
    template: `<wd-index-bar>
  <view v-for="item in basicList" :key="item.index">
    <wd-index-anchor :index="item.index" />
    <wd-cell
      v-for="city in item.data"
      :key="city"
      clickable
      border
      :title="city"
      @click="handleBasicClick(item.index, city)"
    />
  </view>
</wd-index-bar>`,

    script: `import { ref } from 'vue'

const basicList = ref([
  {
    index: 'A',
    data: ['阿坝', '阿拉善', '阿里', '安康', '安庆']
  },
  {
    index: 'B',
    data: ['北京', '白银', '保定', '宝鸡', '保山']
  },
  {
    index: 'C',
    data: ['重庆', '成都', '长沙', '长春', '沧州']
  }
])

const handleBasicClick = (index, city) => {
  console.log('选择了：', index, city)
}`,
  },

  // 吸顶模式代码
  sticky: {
    template: `<wd-index-bar sticky>
  <view v-for="item in stickyList" :key="item.index">
    <wd-index-anchor :index="item.index" />
    <wd-cell
      v-for="city in item.data"
      :key="city"
      clickable
      border
      :title="city"
      @click="handleStickyClick(city)"
    />
  </view>
</wd-index-bar>`,

    script: `const stickyList = ref([
  {
    index: '热门',
    data: ['北京', '上海', '广州', '深圳', '杭州']
  },
  {
    index: 'A',
    data: ['阿坝', '阿拉善', '阿里', '安康', '安庆']
  }
])

const handleStickyClick = (city) => {
  console.log('选择城市：', city)
}`,
  },

  // 自定义内容代码
  custom: {
    template: `<wd-index-bar>
  <view v-for="item in customList" :key="item.index">
    <wd-index-anchor :index="item.index">
      <view class="custom-anchor">
        <wd-icon :name="item.icon" size="20" color="#4D80F0" />
        <text class="custom-anchor-text">{{ item.title }}</text>
      </view>
    </wd-index-anchor>
    <wd-cell
      v-for="contact in item.data"
      :key="contact.name"
      clickable
      border
      :title="contact.name"
      :label="contact.phone"
      @click="handleCustomClick(contact)"
    />
  </view>
</wd-index-bar>`,

    script: `const customList = ref([
  {
    index: 'F',
    icon: 'star-on',
    title: '收藏联系人',
    data: [
      { name: '张三', phone: '138****1234' },
      { name: '李四', phone: '139****5678' }
    ]
  }
])

const handleCustomClick = (contact) => {
  console.log('选择联系人：', contact)
}`,
  },

  // 搜索联动代码
  search: {
    template: `<view class="search-demo-wrapper">
  <!-- 搜索框 -->
  <wd-search
    v-model="searchKeyword"
    hide-cancel
    placeholder="搜索城市名称"
    @search="handleSearchSubmit"
    @clear="handleSearchClear"
    @input="handleSearchInput"
  />

  <!-- 索引栏 -->
  <wd-index-bar v-if="filteredCityList.length" sticky>
    <view v-for="item in filteredCityList" :key="item.index">
      <wd-index-anchor :index="item.index" />
      <wd-cell
        v-for="city in item.data"
        :key="city"
        clickable
        border
        :title="city"
        @click="handleSearchClick(item.index, city)"
      />
    </view>
  </wd-index-bar>
</view>`,

    script: `const searchKeyword = ref('')
const fullCityList = ref([
  { index: 'A', data: ['阿坝', '阿拉善'] },
  { index: 'B', data: ['北京', '白银'] }
])

const filteredCityList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return fullCityList.value
  }

  return fullCityList.value
    .map(group => ({
      ...group,
      data: group.data.filter(city =>
        city.includes(searchKeyword.value)
      )
    }))
    .filter(group => group.data.length > 0)
})`,
  },

  // 应用场景代码
  scenarios: {
    contactTemplate: `<wd-index-bar sticky>
  <view v-for="group in contactList" :key="group.index">
    <wd-index-anchor :index="group.index" />
    <wd-cell
      v-for="contact in group.data"
      :key="contact.id"
      clickable
      border
      :title="contact.name"
      :label="contact.department"
      @click="handleContactClick(contact)"
    >
      <template #icon>
        <view class="contact-avatar">
          {{ contact.name.charAt(0) }}
        </view>
      </template>
      <template #right-icon>
        <wd-icon name="phone" size="20" color="#999" />
      </template>
    </wd-cell>
  </view>
</wd-index-bar>`,

    contactScript: `const contactList = ref([
  {
    index: 'A',
    data: [
      { id: 1, name: '安小明', department: '技术部', phone: '138****1234' },
      { id: 2, name: '安小红', department: '市场部', phone: '139****5678' }
    ]
  }
])

const handleContactClick = (contact) => {
  console.log('联系：', contact.name, contact.phone)
}`,

    cityTemplate: `<wd-index-bar>
  <view v-for="region in regionList" :key="region.index">
    <wd-index-anchor :index="region.index">
      <view class="region-anchor">
        <text class="region-text">{{ region.name }}</text>
        <text class="region-count">({{ region.data.length }})</text>
      </view>
    </wd-index-anchor>
    <wd-cell
      v-for="city in region.data"
      :key="city.code"
      clickable
      border
      :title="city.name"
      :label="'区号：' + city.code"
      @click="handleCitySelect(city)"
    />
  </view>
</wd-index-bar>`,

    cityScript: `const regionList = ref([
  {
    index: '华北',
    name: '华北地区',
    data: [
      { name: '北京', code: '010' },
      { name: '天津', code: '022' }
    ]
  }
])

const handleCitySelect = (city) => {
  console.log('选择城市：', city.name, city.code)
}`,
  },
}

// ===== API 文档数据 =====

// IndexBar Props 属性文档
const indexBarProps = [
  {
    name: 'sticky',
    type: 'Boolean',
    default: 'false',
    desc: '索引是否吸顶，开启后当前索引标题会在滚动时吸附在顶部',
  },
]

// IndexBar Methods 方法文档
const indexBarMethods: any[] = []

// IndexBar Events 事件文档
const indexBarEvents: any[] = []

// IndexAnchor Props 属性文档
const indexAnchorProps = [
  {
    name: 'index',
    type: 'String | Number',
    default: '-',
    desc: '索引值，必填，用于标识当前锚点',
  },
  {
    name: 'custom-style',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式',
  },
  {
    name: 'custom-class',
    type: 'String',
    default: '""',
    desc: '自定义根节点样式类',
  },
]

// IndexAnchor Methods 方法文档
const indexAnchorMethods = [
  {
    name: 'getInfo()',
    desc: '获取锚点位置信息，重新计算锚点距离页面顶部的距离',
  },
]

// IndexAnchor Events 事件文档
const indexAnchorEvents: any[] = []

// ===== 事件处理方法 =====

/**
 * 基本用法点击事件
 */
const handleBasicClick = (index: string, city: string) => {
  console.log(`基本用法 - 选择了：${index}，城市：${city}`)
}

/**
 * 吸顶模式点击事件
 */
const handleStickyClick = (city: string) => {
  console.log(`吸顶模式 - 选择城市：${city}`)
}

/**
 * 自定义内容点击事件
 */
const handleCustomClick = (contact: any) => {
  console.log(`自定义内容 - 选择联系人：${contact.name}，电话：${contact.phone}`)
}

/**
 * 搜索提交事件
 */
const handleSearchSubmit = () => {
  console.log(`搜索提交：${searchKeyword.value}`)
}

/**
 * 搜索清空事件
 */
const handleSearchClear = () => {
  searchKeyword.value = ''
  console.log('搜索已清空')
}

/**
 * 搜索输入事件
 */
const handleSearchInput = () => {
  console.log(`搜索输入：${searchKeyword.value}`)
}

/**
 * 搜索结果点击事件
 */
const handleSearchClick = (index: string, city: string) => {
  console.log(`搜索结果 - 选择了：${index}，城市：${city}`)
}

/**
 * 通讯录联系人点击事件
 */
const handleContactClick = (contact: any) => {
  console.log(`通讯录 - 联系：${contact.name}，部门：${contact.department}，电话：${contact.phone}`)
}

/**
 * 城市选择事件
 */
const handleCitySelect = (city: any) => {
  console.log(`城市选择 - 选择了：${city.name}，区号：${city.code}`)
}

/**
 * 组件挂载后初始化
 */
onMounted(() => {
  console.log('IndexBar 示例页面已挂载')
})
const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped>
// 示例容器样式
.demo-wrapper {
  height: 300px;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  overflow: hidden;
}

// 搜索示例容器样式
.search-demo-wrapper {
  border: 1px solid #ebedf0;
  border-radius: 8px;
  overflow: hidden;

  .search-section {
    background: #f7f8fa;
    border-bottom: 1px solid #ebedf0;
  }

  .search-result-wrapper {
    height: 400px;
    overflow: hidden;
  }
}

// 无结果样式
.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #969799;

  &-text {
    margin-top: 12px;
    font-size: 14px;
  }
}

// 自定义锚点样式
.custom-anchor {
  display: flex;
  align-items: center;
  padding: 12px 16px;

  &-text {
    margin-left: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #323233;
  }
}

// 联系人头像样式
.contact-avatar {
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  color: white;
  background: #4d80f0;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 500;
}

// 地区锚点样式
.region-anchor {
  display: flex;
  align-items: center;
  padding: 12px 16px;

  .region-text {
    font-size: 14px;
    font-weight: 500;
    color: #323233;
  }
}
</style>
