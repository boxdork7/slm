<!-- Avatar 头像 http://127.0.0.1:100/#/pages-sub/display/avatar -->
<template>
  <view>
    <!-- 导航栏 -->
    <wd-navbar title="Avatar 头像" show-back />

    <!-- 实时预览区域 -->
    <view class="mx-4 mt-4 border-2 border-purple-300 rounded-xl border-dashed bg-white p-4">
      <view class="mb-3 text-base font-medium">📱 实时预览</view>
      <view class="flex items-center justify-center gap-4">
        <wd-avatar
          :src="demoSrc"
          :text="demoText"
          :icon="demoIcon"
          :size="demoSize"
          :shape="demoShape"
          :bg-color="demoBgColor"
        />
      </view>
      <view class="mt-3 text-center text-sm text-gray-600">
        当前配置：{{ getCurrentConfig() }}
      </view>
    </view>

    <!-- 实时配置面板 -->
    <view class="mx-4 mt-4 rounded-xl bg-purple-50 p-4">
      <view class="mb-3 text-base text-purple-800 font-medium">⚙️ 实时配置</view>
      <view class="space-y-3">
        <!-- 内容类型 -->
        <view>
          <view class="mb-2 text-sm text-purple-600">内容类型：</view>
          <wd-radio-group v-model="demoContentType" direction="horizontal" @change="onContentTypeChange">
            <wd-radio value="image">图片</wd-radio>
            <wd-radio value="text">文字</wd-radio>
            <wd-radio value="icon">图标</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 尺寸选择 -->
        <view>
          <view class="mb-2 text-sm text-purple-600">尺寸：</view>
          <wd-radio-group v-model="demoSize" direction="horizontal">
            <wd-radio value="large">大</wd-radio>
            <wd-radio value="medium">中</wd-radio>
            <wd-radio value="normal">标准</wd-radio>
            <wd-radio value="small">小</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 形状选择 -->
        <view>
          <view class="mb-2 text-sm text-purple-600">形状：</view>
          <wd-radio-group v-model="demoShape" direction="horizontal">
            <wd-radio value="round">圆形</wd-radio>
            <wd-radio value="square">方形</wd-radio>
          </wd-radio-group>
        </view>

        <!-- 自定义颜色 -->
        <view>
          <view class="mb-2 text-sm text-purple-600">背景颜色：</view>
          <view class="flex gap-2">
            <view
              v-for="color in presetColors"
              :key="color"
              :class="`w-8 h-8 rounded-full border-2 cursor-pointer ${demoBgColor === color ? 'border-gray-800' : 'border-gray-300'}`"
              :style="`background-color: ${color}`"
              @click="demoBgColor = color"
            />
            <view
              :class="`w-8 h-8 rounded-full border-2 cursor-pointer flex items-center justify-center text-xs ${!demoBgColor ? 'border-gray-800 bg-gray-100' : 'border-gray-300'}`"
              @click="demoBgColor = ''"
            >
              默认
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 基本用法 -->
    <DemoSection title="基本用法" desc="头像支持图片、文字和图标三种展示方式">
      <wd-cell-group>
        <wd-cell title="图片头像">
          <view class="flex gap-3">
            <wd-avatar src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <wd-avatar src="https://img.yzcdn.cn/vant/cat.jpeg" shape="square" />
          </view>
        </wd-cell>

        <wd-cell title="文字头像">
          <view class="flex gap-3">
            <wd-avatar text="张三" bg-color="#1989fa" />
            <wd-avatar text="李" bg-color="#07c160" />
            <wd-avatar text="Admin" bg-color="#ee0a24" />
          </view>
        </wd-cell>

        <wd-cell title="图标头像">
          <view class="flex gap-3">
            <wd-avatar icon="user" bg-color="#1989fa" />
            <wd-avatar icon="star-on" bg-color="#ee0a24" />
            <wd-avatar icon="camera" bg-color="#ff976a" />
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 图片头像" :code="codes.basic.imageTemplate" />
        <DemoCode title="模板 - 文字头像" :code="codes.basic.textTemplate" />
        <DemoCode title="模板 - 图标头像" :code="codes.basic.iconTemplate" />
      </template>
    </DemoSection>

    <!-- 尺寸 -->
    <DemoSection title="尺寸" desc="支持 large、medium、normal、small 四种尺寸和自定义数字尺寸">
      <wd-cell-group>
        <wd-cell title="预设尺寸">
          <view class="flex items-end gap-3">
            <wd-avatar text="大" size="large" bg-color="#1989fa" />
            <wd-avatar text="中" size="medium" bg-color="#1989fa" />
            <wd-avatar text="标" size="normal" bg-color="#1989fa" />
            <wd-avatar text="小" size="small" bg-color="#1989fa" />
          </view>
        </wd-cell>

        <wd-cell title="自定义尺寸">
          <view class="flex items-end gap-3">
            <wd-avatar text="120" :size="120" bg-color="#07c160" />
            <wd-avatar text="50" :size="50" bg-color="#07c160" />
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 预设尺寸" :code="codes.size.presetTemplate" />
        <DemoCode title="模板 - 自定义尺寸" :code="codes.size.customTemplate" />
      </template>
    </DemoSection>

    <!-- 头像组 -->
    <DemoSection title="头像组" desc="使用 AvatarGroup 组合多个头像，支持重叠展示和溢出计数">
      <wd-cell-group>
        <wd-cell title="基本头像组">
          <wd-avatar-group>
            <wd-avatar src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <wd-avatar text="张" bg-color="#1989fa" />
            <wd-avatar text="李" bg-color="#07c160" />
            <wd-avatar icon="user" bg-color="#ee0a24" />
          </wd-avatar-group>
        </wd-cell>

        <wd-cell title="限制数量（max=3）">
          <wd-avatar-group :max-count="3">
            <wd-avatar text="A" bg-color="#1989fa" />
            <wd-avatar text="B" bg-color="#07c160" />
            <wd-avatar text="C" bg-color="#ee0a24" />
            <wd-avatar text="D" bg-color="#ff976a" />
            <wd-avatar text="E" bg-color="#8B5CF6" />
          </wd-avatar-group>
        </wd-cell>

        <wd-cell title="左侧优先重叠">
          <wd-avatar-group cascading="left-up">
            <wd-avatar text="1" bg-color="#1989fa" />
            <wd-avatar text="2" bg-color="#07c160" />
            <wd-avatar text="3" bg-color="#ee0a24" />
          </wd-avatar-group>
        </wd-cell>

        <wd-cell title="统一方形 + 大尺寸">
          <wd-avatar-group shape="square" size="large">
            <wd-avatar text="A" bg-color="#1989fa" />
            <wd-avatar text="B" bg-color="#07c160" />
            <wd-avatar text="C" bg-color="#ee0a24" />
          </wd-avatar-group>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 基本头像组" :code="codes.group.basicTemplate" />
        <DemoCode title="模板 - 限制数量" :code="codes.group.maxCountTemplate" />
        <DemoCode title="模板 - 左侧优先" :code="codes.group.leftUpTemplate" />
        <DemoCode title="模板 - 统一样式" :code="codes.group.unifiedTemplate" />
      </template>
    </DemoSection>

    <!-- 自定义样式 -->
    <DemoSection title="自定义样式" desc="自定义背景色和文字颜色">
      <wd-cell-group>
        <wd-cell title="自定义颜色">
          <view class="flex gap-3">
            <wd-avatar text="热" bg-color="#FF6B6B" color="#fff" />
            <wd-avatar text="酷" bg-color="#8B5CF6" color="#fff" />
            <wd-avatar text="新" bg-color="linear-gradient(135deg, #667eea, #764ba2)" color="#fff" />
          </view>
        </wd-cell>

        <wd-cell title="图片加载失败降级">
          <view class="flex gap-3">
            <wd-avatar src="https://invalid-url.com/avatar.jpg" icon="user" bg-color="#c0c4cc" />
            <wd-avatar src="https://invalid-url.com/avatar.jpg" text="默认" bg-color="#1989fa" />
          </view>
        </wd-cell>
      </wd-cell-group>

      <template #codes>
        <DemoCode title="模板 - 自定义颜色" :code="codes.custom.colorTemplate" />
        <DemoCode title="模板 - 降级显示" :code="codes.custom.fallbackTemplate" />
      </template>
    </DemoSection>

    <!-- 实际应用场景 -->
    <DemoSection title="实际应用场景" desc="常见的业务场景和最佳实践">
      <view class="space-y-4">
        <!-- 用户列表 -->
        <view class="mx-4 border rounded-lg bg-white p-4">
          <view class="mb-3 text-sm font-medium">👥 用户列表</view>
          <view class="space-y-3">
            <view
              v-for="user in userList"
              :key="user.id"
              class="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-b-0"
            >
              <wd-avatar :src="user.avatar" :text="user.name" :bg-color="user.color" />
              <view class="flex-1">
                <view class="font-medium">{{ user.name }}</view>
                <view class="text-sm text-gray-500">{{ user.role }}</view>
              </view>
              <wd-tag :type="user.online ? 'success' : 'info'" size="small">
                {{ user.online ? '在线' : '离线' }}
              </wd-tag>
            </view>
          </view>
        </view>

        <!-- 评论区 -->
        <view class="mx-4 border rounded-lg bg-white p-4">
          <view class="mb-3 text-sm font-medium">💬 评论区</view>
          <view class="flex gap-3">
            <wd-avatar text="张三" bg-color="#1989fa" size="small" />
            <view class="flex-1">
              <view class="text-sm font-medium">张三</view>
              <view class="mt-1 text-sm text-gray-600">这个组件效果很不错！</view>
              <view class="mt-1 text-xs text-gray-400">2 小时前</view>
            </view>
          </view>
        </view>

        <!-- 最佳实践 -->
        <view class="mx-4 rounded-lg bg-green-50 p-4">
          <view class="mb-2 text-sm text-green-800 font-medium">⭐ 最佳实践</view>
          <view class="text-sm text-green-600 space-y-1">
            <view>• 图片头像：用于有真实头像的用户，设置 alt 提升可访问性</view>
            <view>• 文字头像：用于无头像用户，取姓名首字符显示</view>
            <view>• 图标头像：用于默认头像或功能图标</view>
            <view>• 头像组：用于显示参与者列表，合理设置 maxCount</view>
            <view>• 加载失败时自动降级到图标或文字展示</view>
          </view>
        </view>
      </view>

      <template #codes>
        <DemoCode title="模板 - 用户列表" :code="codes.scenarios.userListTemplate" />
        <DemoCode title="脚本 - 用户列表" :code="codes.scenarios.script" />
      </template>
    </DemoSection>

    <!-- API 文档 -->
    <DemoApi title="Avatar Props" :props="avatarProps" />
    <DemoApi title="AvatarGroup Props" :props="groupProps" />
  </view>
</template>

<script setup lang="ts">
import type { AvatarShape, AvatarSize } from '@/wd/components/wd-avatar/wd-avatar.vue'
import { ref } from 'vue'

// ===== 实时配置状态 =====
const demoContentType = ref('image')
const demoSrc = ref('https://img.yzcdn.cn/vant/cat.jpeg')
const demoText = ref('')
const demoIcon = ref('')
const demoSize = ref<AvatarSize>('normal')
const demoShape = ref<AvatarShape>('round')
const demoBgColor = ref('')

const presetColors = ['#1989fa', '#07c160', '#ee0a24', '#ff976a', '#8B5CF6', '#FF6B6B']

const onContentTypeChange = (val: string) => {
  demoSrc.value = val === 'image' ? 'https://img.yzcdn.cn/vant/cat.jpeg' : ''
  demoText.value = val === 'text' ? '张三' : ''
  demoIcon.value = val === 'icon' ? 'user' : ''
  if (val !== 'image' && !demoBgColor.value) {
    demoBgColor.value = '#1989fa'
  }
}

const getCurrentConfig = () => {
  const config: string[] = []
  if (demoContentType.value === 'image') config.push('图片')
  if (demoContentType.value === 'text') config.push(`文字:${demoText.value}`)
  if (demoContentType.value === 'icon') config.push(`图标:${demoIcon.value}`)
  config.push(`尺寸:${demoSize.value}`)
  config.push(`形状:${demoShape.value}`)
  if (demoBgColor.value) config.push('自定义颜色')
  return config.join(', ')
}

// ===== 业务场景数据 =====
const userList = ref([
  { id: 1, name: '张三', role: '产品经理', avatar: '', color: '#1989fa', online: true },
  { id: 2, name: '李四', role: '前端开发', avatar: '', color: '#07c160', online: true },
  { id: 3, name: '王五', role: '后端开发', avatar: '', color: '#ee0a24', online: false },
  { id: 4, name: '赵六', role: 'UI设计师', avatar: '', color: '#ff976a', online: false },
])

// ===== 代码片段 =====
const codes = {
  basic: {
    imageTemplate: `<wd-avatar src="https://img.yzcdn.cn/vant/cat.jpeg" />
<wd-avatar src="https://img.yzcdn.cn/vant/cat.jpeg" shape="square" />`,

    textTemplate: `<wd-avatar text="张三" bg-color="#1989fa" />
<wd-avatar text="李" bg-color="#07c160" />
<wd-avatar text="Admin" bg-color="#ee0a24" />`,

    iconTemplate: `<wd-avatar icon="user" bg-color="#1989fa" />
<wd-avatar icon="star-on" bg-color="#ee0a24" />
<wd-avatar icon="camera" bg-color="#ff976a" />`,
  },

  size: {
    presetTemplate: `<wd-avatar text="大" size="large" bg-color="#1989fa" />
<wd-avatar text="中" size="medium" bg-color="#1989fa" />
<wd-avatar text="标" size="normal" bg-color="#1989fa" />
<wd-avatar text="小" size="small" bg-color="#1989fa" />`,

    customTemplate: `<wd-avatar text="120" :size="120" bg-color="#07c160" />
<wd-avatar text="50" :size="50" bg-color="#07c160" />`,
  },

  group: {
    basicTemplate: `<wd-avatar-group>
  <wd-avatar src="https://img.yzcdn.cn/vant/cat.jpeg" />
  <wd-avatar text="张" bg-color="#1989fa" />
  <wd-avatar text="李" bg-color="#07c160" />
  <wd-avatar icon="user" bg-color="#ee0a24" />
</wd-avatar-group>`,

    maxCountTemplate: `<wd-avatar-group :max-count="3">
  <wd-avatar text="A" bg-color="#1989fa" />
  <wd-avatar text="B" bg-color="#07c160" />
  <wd-avatar text="C" bg-color="#ee0a24" />
  <wd-avatar text="D" bg-color="#ff976a" />
  <wd-avatar text="E" bg-color="#8B5CF6" />
</wd-avatar-group>`,

    leftUpTemplate: `<wd-avatar-group cascading="left-up">
  <wd-avatar text="1" bg-color="#1989fa" />
  <wd-avatar text="2" bg-color="#07c160" />
  <wd-avatar text="3" bg-color="#ee0a24" />
</wd-avatar-group>`,

    unifiedTemplate: `<wd-avatar-group shape="square" size="large">
  <wd-avatar text="A" bg-color="#1989fa" />
  <wd-avatar text="B" bg-color="#07c160" />
  <wd-avatar text="C" bg-color="#ee0a24" />
</wd-avatar-group>`,
  },

  custom: {
    colorTemplate: `<wd-avatar text="热" bg-color="#FF6B6B" color="#fff" />
<wd-avatar text="酷" bg-color="#8B5CF6" color="#fff" />`,

    fallbackTemplate: `<!-- 图片加载失败时降级到图标 -->
<wd-avatar src="https://invalid-url.com/avatar.jpg" icon="user" bg-color="#c0c4cc" />
<!-- 图片加载失败时降级到文字 -->
<wd-avatar src="https://invalid-url.com/avatar.jpg" text="默认" bg-color="#1989fa" />`,
  },

  scenarios: {
    userListTemplate: `<view v-for="user in userList" :key="user.id" class="flex items-center gap-3">
  <wd-avatar :src="user.avatar" :text="user.name" :bg-color="user.color" />
  <view class="flex-1">
    <view class="font-medium">{{ user.name }}</view>
    <view class="text-sm text-gray-500">{{ user.role }}</view>
  </view>
  <wd-tag :type="user.online ? 'success' : 'info'" size="small">
    {{ user.online ? '在线' : '离线' }}
  </wd-tag>
</view>`,

    script: `const userList = ref([
  { id: 1, name: '张三', role: '产品经理', avatar: '', color: '#1989fa', online: true },
  { id: 2, name: '李四', role: '前端开发', avatar: '', color: '#07c160', online: true },
  { id: 3, name: '王五', role: '后端开发', avatar: '', color: '#ee0a24', online: false },
])`,
  },
}

// ===== API 文档 =====
const avatarProps = [
  { name: 'src', type: 'String', default: '""', desc: '图片地址' },
  { name: 'text', type: 'String', default: '""', desc: '文字内容（显示前两个字符）' },
  { name: 'icon', type: 'String', default: '""', desc: '图标名称' },
  { name: 'size', type: 'String | Number', default: '"normal"', desc: '尺寸，可选 large / medium / normal / small 或自定义数字' },
  { name: 'shape', type: 'String', default: '"round"', desc: '形状，可选 round / square' },
  { name: 'bg-color', type: 'String', default: '""', desc: '背景颜色' },
  { name: 'color', type: 'String', default: '"#fff"', desc: '文字颜色' },
  { name: 'alt', type: 'String', default: '""', desc: '图片替代文本' },
  { name: 'mode', type: 'String', default: '"scaleToFill"', desc: '图片裁剪模式' },
  { name: 'custom-style', type: 'String', default: '""', desc: '自定义根节点样式' },
  { name: 'custom-class', type: 'String', default: '""', desc: '自定义根节点样式类' },
]

const groupProps = [
  { name: 'max-count', type: 'Number', default: '0', desc: '最大显示数量，超出显示 +N（0 不限制）' },
  { name: 'cascading', type: 'String', default: '"right-up"', desc: '重叠方向，可选 right-up / left-up' },
  { name: 'shape', type: 'String', default: '"round"', desc: '统一头像形状' },
  { name: 'size', type: 'String | Number', default: '"normal"', desc: '统一头像尺寸' },
  { name: 'custom-style', type: 'String', default: '""', desc: '自定义根节点样式' },
  { name: 'custom-class', type: 'String', default: '""', desc: '自定义根节点样式类' },
]

const scroll = useScroll()

onShow(() => {
  scroll.resetScrollTop()
})
onPageScroll((e) => {
  scroll.updateScrollTop(e.scrollTop)
})
</script>
