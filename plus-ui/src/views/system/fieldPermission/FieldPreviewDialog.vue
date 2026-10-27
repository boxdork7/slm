<!-- 字段权限效果预览 -->
<template>
  <AModal v-model="visible" :title="t('效果预览')" size="xl" footer-type="close-only">
    <el-alert type="info" :closable="false" class="mb-3">
      <span class="text-xs">
        {{ t('按真实用户预览：合并其角色 + 部门 + 个人配置后的最终效果，走与运行期完全相同的合并逻辑，所见即所得。') }}
      </span>
    </el-alert>

    <div class="flex items-center gap-2 mb-3">
      <span class="text-sm shrink-0">{{ t('预览用户') }}</span>
      <!-- showInlineTags 默认 false 会让选择器整个不渲染；defaultReturnType 默认 object，这里只要 userId -->
      <UserSelect
        v-model="userId"
        class="flex-1"
        show-inline-tags
        default-return-type="id"
        :button-text="t('选择用户')"
        @confirm-call-back="loadPreview"
      />
      <el-button icon="Refresh" :disabled="!userId" @click="loadPreview">{{ t('刷新') }}</el-button>
    </div>

    <el-empty v-if="!preview" :description="t('请选择一个用户查看其实际可见范围')" :image-size="80" />

    <template v-else>
      <!-- 超管旁路提示：配了也不生效，必须显式说明，否则管理员会以为配置失效 -->
      <el-alert v-if="preview.superAdmin" type="warning" :closable="false" class="mb-3">
        <span class="text-xs">
          {{ t('该用户是超级管理员，走旁路不受字段权限约束，所有字段均为「可写」。') }}
        </span>
      </el-alert>

      <div class="mb-2 text-sm text-gray-500">
        {{ preview.nickName }} · {{ preview.resourceName }} ·
        {{ t('共') }} {{ preview.items.length }} {{ t('个字段') }}，
        <span class="text-warning font-medium">{{ restrictedCount }}</span> {{ t('个受限') }}
      </div>

      <!-- 变更明细：四个出口横向铺开，一眼看全，不用来回切 Tab -->
      <el-table v-loading="loading" :data="preview.items" size="small" border max-height="400">
        <el-table-column :label="t('字段')" min-width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-1">
              <span>{{ row.label }}</span>
              <!-- label 无中文名时会回落成 fieldName，此时不再重复渲染英文名 -->
              <code v-if="row.label !== row.fieldName" class="text-xs text-gray-400">{{ row.fieldName }}</code>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="t('档位')" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="accessTagType(row.accessType)" size="small" disable-transitions>
              {{ row.accessLabel }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="t('来源')" width="110" align="center">
          <template #default="{ row }">
            <!-- 区分"我配的生效了"与"这是注解带来的默认行为"，避免把注解脱敏误当成自己的配置 -->
            <el-tag v-if="row.fromConfig" type="primary" size="small" disable-transitions>
              {{ t('配置') }}
            </el-tag>
            <el-tag v-else-if="row.sensitive" type="warning" size="small" disable-transitions>
              {{ t('注解基线') }}
            </el-tag>
            <span v-else class="text-gray-400 text-xs">{{ t('无限制') }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('JSON 接口')" min-width="170">
          <template #default="{ row }">
            <span class="text-xs text-gray-600">{{ jsonBehavior(row) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('Excel 导出')" min-width="150">
          <template #default="{ row }">
            <span class="text-xs text-gray-600">{{ excelBehavior(row.accessType) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('写入')" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.accessType === ACCESS_WRITABLE ? 'success' : 'danger'" size="small" disable-transitions>
              {{ row.accessType === ACCESS_WRITABLE ? t('可修改') : t('提交被忽略') }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 越权写入说明：前端隐藏不是安全边界，这点必须让管理员知道 -->
      <el-alert type="warning" :closable="false" class="mt-3">
        <template #default>
          <div class="text-xs leading-relaxed">
            <b>{{ t('写入拦截说明') }}：</b>
            {{ t('非「可写」档位的字段，即使绕过前端直接调接口提交，后端也会置空该字段并保持原值，且记入操作日志。') }}
            {{ t('Excel 导入同样逐行拦截。前端隐藏只是体验优化，') }}
            <b>{{ t('不作为安全边界') }}</b>{{ t('。') }}
          </div>
        </template>
      </el-alert>
    </template>
  </AModal>
</template>

<script setup lang="ts">
import { previewFieldEffect } from '@/api/system/fieldPermission/fieldPermissionApi'
import type { FieldAccessType, FieldPreviewItem, FieldPreviewVo } from '@/api/system/fieldPermission/fieldPermissionTypes'

const { t } = useI18n()

const props = defineProps<{
  /** 当前资源标识 */
  resourceKey: string
}>()

const visible = defineModel<boolean>({ default: false })

/** 可写档位常量：与后端 FieldAccess.WRITABLE 对应 */
const ACCESS_WRITABLE: FieldAccessType = '3'

const userId = ref<string | number>()
const loading = ref(false)
const preview = ref<FieldPreviewVo>()

/** 受限字段数：非可写即为受限 */
const restrictedCount = computed(() => {
  return preview.value?.items.filter((item) => item.accessType !== ACCESS_WRITABLE).length ?? 0
})

type TagType = 'info' | 'success' | 'warning' | 'primary' | 'danger'

const accessTagType = (accessType: string): TagType => {
  const map: Record<string, TagType> = {
    '0': 'info',
    '1': 'warning',
    '2': 'primary',
    '3': 'success'
  }
  return map[accessType] ?? 'info'
}

/**
 * JSON 出口的实际表现
 *
 * 用文字说明而非示例值：示例值容易被误认为是该用户的真实数据
 */
const jsonBehavior = (row: FieldPreviewItem) => {
  const map: Record<string, string> = {
    '0': t('响应中完全没有这个 key（不是 null）'),
    '1': t('值按策略打码'),
    '2': t('明文下发'),
    '3': t('明文下发')
  }
  const base = map[row.accessType] ?? ''
  // 脱敏档带上实际策略名，管理员能确认配的是不是想要的那种掩码
  return row.accessType === '1' && row.strategy ? `${base}（${row.strategy}）` : base
}

const excelBehavior = (accessType: string) => {
  const map: Record<string, string> = {
    '0': t('整列消失，表头都不导出'),
    '1': t('值按策略打码'),
    '2': t('明文导出'),
    '3': t('明文导出')
  }
  return map[accessType] ?? ''
}

/** 加载预览数据 */
const loadPreview = async () => {
  if (!props.resourceKey || !userId.value) {
    preview.value = undefined
    return
  }
  loading.value = true
  const [err, data] = await previewFieldEffect({
    resourceKey: props.resourceKey,
    userId: userId.value
  })
  if (!err) {
    preview.value = data
  }
  loading.value = false
}

watch(visible, (val) => {
  if (val && userId.value) {
    loadPreview()
  }
})
</script>
