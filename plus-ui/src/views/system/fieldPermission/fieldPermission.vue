<!-- 字段级权限配置 -->
<template>
  <div class="flex gap-4 items-stretch overflow-hidden" :style="{ height: pageHeight }">
    <!-- ========== 左：资源树 ========== -->
    <el-card shadow="hover" class="w-264px shrink-0 flex flex-col" body-class="!p-0 flex-1 min-h-0 overflow-hidden">
      <template #header>
        <AFormInput
          v-model="resourceKeyword"
          label=""
          prop="resourceKeyword"
          :placeholder="t('搜索资源')"
          clearable
          :span="24"
        />
      </template>

      <div v-loading="resourceLoading" class="py-2 h-full overflow-y-auto">
        <template v-for="group in groupedResources" :key="group.moduleName">
          <div class="px-4 py-1.5 text-xs text-gray-400 font-medium">{{ group.moduleName }}</div>
          <div
            v-for="item in group.list"
            :key="item.resourceKey"
            class="resource-item mx-2 flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors rounded"
            :class="item.resourceKey === activeResourceKey ? 'is-active' : 'text-gray-600 hover:bg-gray-50'"
            @click="handleSelectResource(item)"
          >
            <span class="truncate" :title="item.resourceKey">{{ item.resourceName }}</span>
            <!-- 数字徽标：一眼看出哪些资源做过限制 -->
            <el-tag v-if="item.configuredFieldCount > 0" size="small" type="warning" disable-transitions>
              {{ item.configuredFieldCount }}
            </el-tag>
          </div>
        </template>
        <el-empty v-if="groupedResources.length === 0" :description="t('暂无资源')" :image-size="60" />
      </div>
    </el-card>

    <!-- ========== 右：字段 × 主体 矩阵 ========== -->
    <el-card shadow="hover" class="flex-1 min-w-0 flex flex-col" body-class="!p-0 flex-1 min-h-0 flex flex-col">
      <!-- 工具条 -->
      <template #header>
        <div class="flex flex-wrap items-center gap-4">
          <div v-if="matrix">
            <div class="text-base font-medium">{{ matrix.resourceName }}</div>
            <div class="text-xs text-gray-400 mt-0.5 flex items-center flex-wrap gap-1">
              <span>{{ t('资源标识') }}</span>
              <code class="bg-gray-100 px-1 rounded">{{ matrix.resourceKey }}</code>
              <span>· {{ t('共') }} {{ matrix.fields.length }} {{ t('个字段') }} ·</span>
              <!-- 类绑定由 @FieldResource 注解扫描登记，此处只读展示覆盖范围 -->
              <el-tooltip :content="classNamesTip" placement="bottom">
                <span class="cursor-help">
                  {{ t('覆盖') }}
                  <span class="text-primary font-medium">{{ classCount('1') }}</span> {{ t('读出口') }} ·
                  <span class="text-primary font-medium">{{ classCount('2') }}</span> {{ t('写入口') }} ·
                  <span class="text-primary font-medium">{{ classCount('3') }}</span> {{ t('导入') }}
                </span>
              </el-tooltip>
              <el-tag size="small" type="info" disable-transitions>{{ t('注解自动登记') }}</el-tag>
            </div>
          </div>

          <div class="ml-auto flex items-center gap-2">
            <el-button icon="Filter" :disabled="!matrix" @click="handleOpenSubjectPicker">
              {{ t('配置主体') }} ({{ selectedSubjectIds.length }})
            </el-button>
            <el-button icon="View" :disabled="!matrix" @click="handlePreview">{{ t('效果预览') }}</el-button>
            <el-button
              v-permi="['system:fieldPermission:update']"
              type="primary"
              icon="Check"
              :loading="saveLoading"
              :disabled="!matrix"
              @click="handleSave"
            >
              {{ t('保存') }}
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="!matrix" class="py-16 flex-1">
        <el-empty :description="t('请先在左侧选择一个资源')" />
      </div>

      <template v-else>
        <!-- 主体类型 Tab：三种粒度共用一套矩阵 UI -->
        <el-tabs v-model="activeSubjectType" class="px-4 shrink-0" @tab-change="handleSubjectTypeChange">
          <el-tab-pane v-for="item in sys_field_subject" :key="item.value" :name="item.value">
            <template #label>
              <span>{{ t('按') }}{{ item.label }}</span>
            </template>
          </el-tab-pane>
        </el-tabs>

        <!-- 合并语义提示：最宽松合并是本机制最反直觉的一点，必须常驻说明。
             按用户这一类还要额外教一句「怎么开始」——它默认没有任何列，
             不说清楚管理员会以为是空功能，不会想到去点右上角的「配置主体」。 -->
        <el-alert type="info" :closable="false" class="mx-4 !mb-2 shrink-0">
          <template #default>
            <span v-if="activeSubjectType === SUBJECT_USER" class="text-xs">
              {{ t('按用户是给某个人开例外：先点右上角') }}<b>「{{ t('配置主体') }}」</b>{{ t('挑人，他的档位会与所属角色、部门按') }}<b>{{ t('最宽松') }}</b>{{ t('合并。') }}
            </span>
            <span v-else class="text-xs">
              {{ t('多个主体命中同一字段时取') }}<b>{{ t('最宽松') }}</b>{{ t('档位（授权是加法）。收紧某个主体后，兼有其他主体的用户可能仍能看到——单元格右上角的') }}
              <el-tag size="small" type="warning" disable-transitions>⚠ N</el-tag>
              {{ t('即为受影响人数。') }}
            </span>
          </template>
        </el-alert>

        <!-- 主体被截断的提示：不说清楚的话，管理员会以为这个类型下就这么几个主体 -->
        <el-alert v-if="hiddenSubjectCount > 0" type="warning" :closable="false" class="mx-4 !mb-2 shrink-0">
          <template #default>
            <span class="text-xs">
              {{ t('该类型共') }} {{ allSubjects.length }} {{ t('个主体，同屏展示过多会明显变卡，当前只显示') }}
              {{ selectedSubjectIds.length }} {{ t('个，还有') }}
              <b>{{ hiddenSubjectCount }}</b>
              {{ t('个未显示。需要配置其他主体请用右上角') }}「{{ t('配置主体') }}」{{ t('挑选。') }}
            </span>
          </template>
        </el-alert>

        <!-- 图例 -->
        <div class="px-4 py-2 bg-gray-50 border-y border-gray-200 flex items-center gap-4 text-xs text-gray-500 shrink-0">
          <span class="font-medium text-gray-600">{{ t('权限档位') }}：</span>
          <span v-for="item in sys_field_access" :key="item.value" class="flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-full" :class="accessDotClass(item.value)" />
            {{ item.label }}
          </span>
        </div>

        <!-- 矩阵表格：flex-1 + min-h-0 让它吃掉剩余空间，滚动条只出现在表格内部，
             底部状态条因此始终可见（不再被撑到视口外） -->
        <el-table
          v-loading="matrixLoading"
          :data="matrix.fields"
          height="100%"
          class="flex-1 min-h-0"
          border
          size="small"
        >
          <el-table-column :label="t('字段')" prop="label" fixed="left" min-width="220">
            <template #default="{ row }">
              <div class="flex items-center gap-1">
                <span class="font-medium">{{ row.label }}</span>
                <!-- 无中文名时后端把 label 回落成 fieldName，此时再渲染一遍英文名就会重复显示 -->
                <code v-if="row.label !== row.fieldName" class="text-xs text-gray-400">{{ row.fieldName }}</code>
                <!-- 非 String 字段上的 @Sensitive 实际不生效，必须提示：这类字段只能靠动态配置兜底 -->
                <el-tooltip v-if="row.annotationUncovered" :content="t('该字段非 String 类型，@Sensitive 注解不生效，只能靠此处配置兜底')">
                  <el-tag size="small" type="danger" disable-transitions>{{ t('注解不覆盖') }}</el-tag>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="t('注解基线')" width="130">
            <template #default="{ row }">
              <el-tag v-if="row.sensitive" size="small" type="warning" disable-transitions>
                {{ t('脱敏') }}
              </el-tag>
              <span v-else class="text-gray-400 text-xs">{{ t('可写') }}</span>
            </template>
          </el-table-column>

          <!-- 主体列由 v-for 动态生成。
               用固定 width 而不是 min-width：min-width 会让 el-table 把剩余空间摊到各列，
               只剩一两个主体时这一列会被拉到三四百像素、里面的下拉框跟着变形，
               和主体多时的观感对不上。固定宽后不论几个主体，每格都是同一个尺寸。 -->
          <el-table-column
            v-for="subject in matrix.subjects"
            :key="subject.subjectId"
            :label="subject.subjectName"
            align="center"
            width="140"
          >
            <template #header>
              <div class="flex items-center justify-center gap-1">
                <span>{{ subject.subjectName }}</span>
                <el-icon v-if="subject.superAdmin" class="text-gray-400"><Lock /></el-icon>
              </div>
            </template>
            <template #default="{ row }">
              <!-- 超管走 isSuperAdmin() 旁路，配了也不生效，渲染成不可编辑的「全权」 -->
              <el-tag v-if="subject.superAdmin" size="small" type="info" disable-transitions>
                {{ t('全权') }}
              </el-tag>
              <!-- w-full 不能省：全局样式把「最后一列」当操作列处理（_element-plus.scss 里
                   `td:last-child .cell { display: flex !important }`），本页最后一列却是动态主体列，
                   落进 flex 容器后 el-col 的 width:100% 会退化成按内容收缩，最后一列的下拉框比别的窄一半。 -->
              <div v-else class="relative w-full">
                <!-- 只有点中的那一格挂真正的下拉框，其余格子是纯文本。
                     格子数 = 字段数 × 主体数，全量挂 el-select 会卡死（见 DEFAULT_SUBJECT_LIMIT 注释） -->
                <AFormSelect
                  v-if="editingCellKey === cellKey(row.fieldName, subject.subjectId)"
                  class="field-cell-editing"
                  :model-value="cellValue(row.fieldName, subject.subjectId)"
                  label=""
                  :prop="`${row.fieldName}_${subject.subjectId}`"
                  :options="sys_field_access"
                  :span="24"
                  size="small"
                  :clearable="false"
                  @update:model-value="(val: unknown) => handleCellChange(row, subject, val as FieldAccessType)"
                  @visible-change="handleCellVisibleChange"
                />
                <div
                  v-else
                  class="field-cell-view"
                  @click="startEditCell(row.fieldName, subject.subjectId)"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0"
                    :class="accessDotClass(cellValue(row.fieldName, subject.subjectId))"
                  />
                  {{ accessLabel(cellValue(row.fieldName, subject.subjectId)) }}
                </div>
                <!-- 收权后果角标：最宽松合并下「收紧了但没生效」是最容易被忽略的坑 -->
                <el-tooltip v-if="affectedCount(row.fieldName, subject.subjectId) > 0" placement="top">
                  <template #content>
                    <div class="text-xs">
                      {{ affectedTip(row.fieldName, subject.subjectId) }}
                    </div>
                  </template>
                  <el-tag
                    size="small"
                    type="warning"
                    disable-transitions
                    class="absolute -top-2 -right-1 cursor-help"
                  >
                    ⚠ {{ affectedCount(row.fieldName, subject.subjectId) }}
                  </el-tag>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 底部状态条 -->
        <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500 shrink-0">
          <span>
            {{ t('共') }} {{ matrix.fields.length }} {{ t('个字段') }}，{{ t('其中') }}
            <span class="text-warning font-medium">{{ changedCellCount }}</span>
            {{ t('个已配置差异化权限') }}
          </span>
          <span v-if="dirty" class="text-warning text-xs">{{ t('有未保存的修改') }}</span>
        </div>
      </template>
    </el-card>

    <!-- 配置主体弹窗 -->
    <AModal v-model="subjectPicker.visible" :title="t('配置显示的主体')" @confirm="handleConfirmSubjects">
      <!-- 用户主体：后端不下发全量选项（用户量可能极大），只能按需检索后挑人 -->
      <template v-if="activeSubjectType === SUBJECT_USER">
        <!-- 必须写 !mb-4：Element Plus 的 `.el-alert { margin: 0 }` 与工具类同优先级、
             但加载在后，普通的 mb-* 会被它吃掉，提示条会紧贴下面的选择按钮 -->
        <el-alert type="info" :closable="false" class="!mb-4">
          <span class="text-xs">
            {{ t('用户数量不可控，这里不列出全量，请检索后指定。给单个人开的档位会与他的角色、部门配置按最宽松合并。') }}
          </span>
        </el-alert>
        <UserSelect
          v-model="subjectPicker.selected"
          multiple
          show-inline-tags
          default-return-type="id"
          :initial-user-names="pickedUserNames"
          :button-text="t('选择用户')"
        />
      </template>

      <!-- 全选行：主体多起来（角色几十个）时逐个点太费事 -->
      <div
        v-if="allSubjects.length > 0"
        class="flex items-center justify-between pb-2 mb-2 border-b border-gray-200"
      >
        <el-checkbox
          :model-value="allSubjectsChecked"
          :indeterminate="subjectPickerIndeterminate"
          @change="handleToggleAllSubjects"
        >
          {{ t('全选') }}
        </el-checkbox>
        <span class="text-xs text-gray-400">
          {{ t('已选') }} {{ subjectPicker.selected.length }} / {{ allSubjects.length }}
        </span>
      </div>

      <el-checkbox-group v-if="activeSubjectType !== SUBJECT_USER" v-model="subjectPicker.selected">
        <el-checkbox v-for="item in allSubjects" :key="item.subjectId" :value="item.subjectId" class="w-full">
          {{ item.subjectName }}
          <el-tag v-if="item.superAdmin" size="small" type="info" disable-transitions>{{ t('超管') }}</el-tag>
        </el-checkbox>
      </el-checkbox-group>
      <el-empty
        v-if="activeSubjectType !== SUBJECT_USER && allSubjects.length === 0"
        :description="t('暂无可选主体')"
        :image-size="60"
      />
    </AModal>

    <!-- 效果预览弹窗 -->
    <FieldPreviewDialog v-model="previewVisible" :resource-key="activeResourceKey" />
  </div>
</template>

<script setup lang="ts" name="FieldPermission">
import { Lock } from '@element-plus/icons-vue'
import {
  countAffectedUsers,
  getFieldMatrix,
  listFieldResources,
  listFieldSubjects,
  updateFieldMatrix
} from '@/api/system/fieldPermission/fieldPermissionApi'
import type {
  FieldAccessType,
  FieldMatrixCellVo,
  FieldMatrixVo,
  FieldMetaVo,
  FieldResourceVo,
  FieldSubjectType,
  FieldSubjectVo
} from '@/api/system/fieldPermission/fieldPermissionTypes'
import FieldPreviewDialog from './FieldPreviewDialog.vue'
import { showConfirm, showMsgSuccess } from '@/utils/modal'

const { t } = useI18n()
const { sys_field_access, sys_field_subject } = useDict(DictTypes.sys_field_access, DictTypes.sys_field_subject)
const layout = useLayout()

/**
 * 页面可用高度
 * @description 不用 useTableHeight：它按标准 CRUD 页（固定 62px 头 + 56px 分页）估算表格高度，
 * 本页头部是多行自适应的，估出来偏大会把卡片撑出视口、底部状态条被挤到屏幕外。
 * 这里只锁定外层容器高度，内部由 flex 自行分配，头部换行也不会算错。
 */
const pageHeight = computed(() => {
  // 顶栏 50 + 页签 34（可关）+ AppMain 里 el-scrollbar 的 p-4 上下内边距 32。
  // 这 32 不能照抄 useTableHeight 的 16：那是按 .p-2 算的，本项目 AppMain.vue 用的是 p-4，
  // 少减 16px 会让 app-main 总高超出视口，body 冒出一条整页滚动条。
  const reserved = 50 + (layout.tagsView.value ? 34 : 0) + 32
  return `calc(100vh - ${reserved}px)`
})

/** 可写档位常量：与后端 FieldAccess.WRITABLE 对应 */
const ACCESS_WRITABLE: FieldAccessType = '3'
/** 脱敏档位常量：注解基线用 */
const ACCESS_MASKED: FieldAccessType = '1'
/** 用户主体类型：与后端 SubjectType.USER 对应。这一类不下发全量选项，走用户选择器按需检索 */
const SUBJECT_USER: FieldSubjectType = '3'

const resourceLoading = ref(false)
const matrixLoading = ref(false)
const saveLoading = ref(false)

const resourceKeyword = ref('')
const resources = ref<FieldResourceVo[]>([])
const activeResourceKey = ref('')

const activeSubjectType = ref<FieldSubjectType>('1')
const matrix = ref<FieldMatrixVo>()
const allSubjects = ref<FieldSubjectVo[]>([])
const selectedSubjectIds = ref<Array<string | number>>([])

/** 当前编辑中的格子：key 为 `字段名|主体ID`，值为档位 */
const editedCells = ref<Map<string, FieldAccessType>>(new Map())
/** 收权后果计数缓存：key 同上，值为受影响人数与提示 */
const affectedMap = ref<Map<string, { count: number; tip: string }>>(new Map())
const dirty = ref(false)

const subjectPicker = ref({ visible: false, selected: [] as Array<string | number> })
const previewVisible = ref(false)

/** 正在编辑的格子 key，空串表示当前没有格子处于编辑态 */
const editingCellKey = ref('')

/**
 * 默认展示的主体列上限
 *
 * @description 每多一个主体就多一列、每列一个字段一个下拉框。实测用户管理（23 字段）
 * 切到「按部门」时默认全选 25 个部门 → 575 个 el-select、2400 个 option 节点、
 * 26000 个 DOM 节点，主线程卡 7.4 秒。角色数一般在这个量级内，
 * 部门和用户则完全不可控，所以统一设上限，超出的让管理员自己去「配置主体」挑。
 */
const DEFAULT_SUBJECT_LIMIT = 8

/** 资源按模块分组，供左树渲染 */
const groupedResources = computed(() => {
  const keyword = resourceKeyword.value.trim().toLowerCase()
  const filtered = keyword
    ? resources.value.filter(
        (item) =>
          item.resourceName.toLowerCase().includes(keyword) ||
          item.resourceKey.toLowerCase().includes(keyword)
      )
    : resources.value
  const groups: Array<{ moduleName: string; list: FieldResourceVo[] }> = []
  filtered.forEach((item) => {
    const moduleName = item.moduleName || t('未分组')
    const exists = groups.find((g) => g.moduleName === moduleName)
    if (exists) {
      exists.list.push(item)
    } else {
      groups.push({ moduleName, list: [item] })
    }
  })
  return groups
})

/** 已改动的格子数（含既有配置 + 本次编辑） */
const changedCellCount = computed(() => {
  if (!matrix.value) return 0
  const keys = new Set<string>()
  matrix.value.cells.forEach((cell) => keys.add(cellKey(cell.fieldName, cell.subjectId)))
  editedCells.value.forEach((value, key) => {
    if (value === baselineOfKey(key)) {
      keys.delete(key)
    } else {
      keys.add(key)
    }
  })
  return keys.size
})

/** 类绑定的完整清单，hover 展示 */
const classNamesTip = computed(() => {
  if (!matrix.value) return ''
  return matrix.value.classes.map((item) => `${item.classTypeLabel}：${item.simpleName}`).join('\n')
})

const classCount = (classType: string) => {
  return matrix.value?.classes.filter((item) => item.classType === classType).length ?? 0
}

const cellKey = (fieldName: string, subjectId: string | number) => `${fieldName}|${subjectId}`

/**
 * 字段名 → 注解基线档位（有 @Sensitive 为脱敏，否则可写）
 *
 * @description 建索引而不是每次 find：格子数是 字段数 × 主体数，
 * 模板里每格都要取一次基线，线性查找会把 O(格子数 × 字段数) 的比较全压进渲染。
 */
const baselineMap = computed(() => {
  const map = new Map<string, FieldAccessType>()
  matrix.value?.fields.forEach((item) => {
    map.set(item.fieldName, item.sensitive ? ACCESS_MASKED : ACCESS_WRITABLE)
  })
  return map
})

const baselineOf = (fieldName: string): FieldAccessType => baselineMap.value.get(fieldName) ?? ACCESS_WRITABLE

const baselineOfKey = (key: string): FieldAccessType => baselineOf(key.split('|')[0])

/** 既有配置格子的索引，理由同 baselineMap */
const baseCellMap = computed(() => {
  const map = new Map<string, FieldAccessType>()
  matrix.value?.cells.forEach((item) => {
    map.set(cellKey(item.fieldName, item.subjectId), item.accessType)
  })
  return map
})

/** 单元格当前值：本次编辑 > 既有配置 > 注解基线 */
const cellValue = (fieldName: string, subjectId: string | number): FieldAccessType => {
  const key = cellKey(fieldName, subjectId)
  return editedCells.value.get(key) ?? baseCellMap.value.get(key) ?? baselineOf(fieldName)
}

/** 档位标签，供视图态直接渲染文本 */
const accessLabelMap = computed(() => {
  const map = new Map<string, string>()
  // useDict 实际 return 的是 toRefs 后的 ref，但它的 DataResult 把类型声明成了裸数组，
  // 直接写 .value 运行时对、vue-tsc 报错。unref 两边都成立，且不用去动公共 composable 的类型。
  unref(sys_field_access).forEach((item) => map.set(String(item.value), item.label))
  return map
})

const accessLabel = (accessType: string) => accessLabelMap.value.get(accessType) ?? accessType

/**
 * 因列数上限而没显示的主体个数，为 0 时不提示
 *
 * @description 用户类型不适用：后端本来就不下发全量选项，allSubjects 恒为空，
 * 算出来的差值没有意义（会变成负数被 clamp 成 0，但语义上也不该提示）。
 */
const hiddenSubjectCount = computed(() => {
  if (activeSubjectType.value === SUBJECT_USER) return 0
  return Math.max(0, allSubjects.value.length - selectedSubjectIds.value.length)
})

/**
 * 弹窗里回显已选用户的名字
 *
 * @description UserSelect 只拿到一串 id，名字得由外部喂。当前矩阵的列就是已选的用户，
 * 直接取它的 subjectName，省一次额外查询。
 */
const pickedUserNames = computed(() => (matrix.value?.subjects ?? []).map((item) => item.subjectName))

const affectedCount = (fieldName: string, subjectId: string | number) => {
  return affectedMap.value.get(cellKey(fieldName, subjectId))?.count ?? 0
}

const affectedTip = (fieldName: string, subjectId: string | number) => {
  return affectedMap.value.get(cellKey(fieldName, subjectId))?.tip ?? ''
}

/** 档位对应的图例圆点颜色 */
const accessDotClass = (accessType: string) => {
  const map: Record<string, string> = {
    '0': 'bg-info',
    '1': 'bg-warning',
    '2': 'bg-primary',
    '3': 'bg-success'
  }
  return map[accessType] ?? 'bg-gray-300'
}

/** 查询资源列表 */
const getResources = async () => {
  resourceLoading.value = true
  const [err, data] = await listFieldResources()
  if (!err) {
    resources.value = data ?? []
    if (!activeResourceKey.value && resources.value.length > 0) {
      await handleSelectResource(resources.value[0])
    }
  }
  resourceLoading.value = false
}

/** 查询主体选项 */
const getSubjects = async () => {
  const [err, data] = await listFieldSubjects(activeSubjectType.value)
  if (!err) {
    allSubjects.value = data ?? []
    // 默认只取前 DEFAULT_SUBJECT_LIMIT 个：主体数直接决定列数，全选会让矩阵卡死（见该常量注释）。
    // 超出部分由管理员通过「配置主体」按需勾选，上方会提示还有多少个没显示。
    selectedSubjectIds.value = allSubjects.value
      .slice(0, DEFAULT_SUBJECT_LIMIT)
      .map((item) => item.subjectId)
  }
}

/** 查询矩阵 */
const getMatrix = async () => {
  if (!activeResourceKey.value) return
  matrixLoading.value = true
  const [err, data] = await getFieldMatrix({
    resourceKey: activeResourceKey.value,
    subjectType: activeSubjectType.value,
    subjectIds: selectedSubjectIds.value.length > 0 ? selectedSubjectIds.value : undefined
  })
  if (!err) {
    matrix.value = data
    editedCells.value = new Map()
    affectedMap.value = new Map()
    dirty.value = false
  }
  matrixLoading.value = false
}

/** 选中资源 */
const handleSelectResource = async (item: FieldResourceVo) => {
  if (dirty.value) {
    const [confirmErr] = await showConfirm(t('当前有未保存的修改，切换资源将丢失，是否继续？'))
    if (confirmErr) return
  }
  activeResourceKey.value = item.resourceKey
  await getSubjects()
  await getMatrix()
}

/** 切换主体类型 */
const handleSubjectTypeChange = async () => {
  if (dirty.value) {
    const [confirmErr] = await showConfirm(t('当前有未保存的修改，切换主体类型将丢失，是否继续？'))
    if (confirmErr) return
  }
  await getSubjects()
  await getMatrix()
}

/**
 * 进入单元格编辑态
 *
 * @description 矩阵平时只渲染纯文本，点中的那一格才换成真正的下拉框——全量挂
 * el-select 撑不住（见 DEFAULT_SUBJECT_LIMIT 的实测数据）。切过去后立刻把下拉展开，
 * 保持「点一下就能选」的手感，不让用户多点一次。
 */
const startEditCell = async (fieldName: string, subjectId: string | number) => {
  editingCellKey.value = cellKey(fieldName, subjectId)
  await nextTick()
  // AFormSelect 没有 defineExpose，拿不到内部 el-select 实例，只能点一下它的触发区
  document.querySelector<HTMLElement>('.field-cell-editing .el-select__wrapper')?.click()
}

/** 下拉收起就退回视图态（选完值或点到别处都会走这里，值已在 handleCellChange 落到 editedCells） */
const handleCellVisibleChange = (visible: boolean) => {
  if (!visible) editingCellKey.value = ''
}

/** 单元格档位变更 */
const handleCellChange = async (field: FieldMetaVo, subject: FieldSubjectVo, value: FieldAccessType) => {
  // 空值兜底：矩阵单元格必须始终持有一个档位，"没有档位"在后端没有对应表达。
  // 放进来会连累两处：countAffectedUsers 的 accessType 是必填参数（缺失直接 500），
  // handleSave 也会把 accessType 为空的格子一起提交。已关掉清空按钮，这里再挡一层。
  if (value === undefined || value === null || (value as unknown as string) === '') return

  const key = cellKey(field.fieldName, subject.subjectId)
  editedCells.value.set(key, value)
  dirty.value = true

  // 放权（可写）不存在"收权无效"的问题，直接清掉角标
  if (value === ACCESS_WRITABLE) {
    affectedMap.value.delete(key)
    return
  }
  const [err, data] = await countAffectedUsers({
    resourceKey: activeResourceKey.value,
    subjectType: activeSubjectType.value,
    subjectId: subject.subjectId,
    fieldName: field.fieldName,
    accessType: value
  })
  if (err || !data) return
  if (data.stillVisibleUsers > 0) {
    const names = data.samples.map((s) => `${s.nickName}（${s.finalAccess}）`).join('、')
    const suffix = data.approximate ? t('（影响范围较大，仅估算）') : ''
    affectedMap.value.set(key, {
      count: data.stillVisibleUsers,
      tip: `${t('该主体下有')} ${data.stillVisibleUsers} ${t('人因其他主体仍能看到此字段')}：${names}${suffix}`
    })
  } else {
    affectedMap.value.delete(key)
  }
}

/**
 * 打开主体弹窗
 *
 * @description 每次都从当前生效的 selectedSubjectIds 复制一份。少了这一步：
 *   首次打开会一个都不勾（但矩阵实际显示的是全部主体，对不上）；
 *   点「取消」之后再打开，上次没提交的临时勾选还留在里面。
 */
const handleOpenSubjectPicker = () => {
  subjectPicker.value.selected = [...selectedSubjectIds.value]
  subjectPicker.value.visible = true
}

/** 全选态：全勾才算选中，部分勾选走 indeterminate 半选样式 */
const allSubjectsChecked = computed(
  () => allSubjects.value.length > 0 && subjectPicker.value.selected.length === allSubjects.value.length
)

const subjectPickerIndeterminate = computed(() => {
  const count = subjectPicker.value.selected.length
  return count > 0 && count < allSubjects.value.length
})

/** 全选 / 取消全选（el-checkbox 的 change 回调值是 CheckboxValueType，这里只取真假） */
const handleToggleAllSubjects = (checked: unknown) => {
  subjectPicker.value.selected = checked ? allSubjects.value.map((item) => item.subjectId) : []
}

/** 确认主体筛选 */
const handleConfirmSubjects = async () => {
  selectedSubjectIds.value = [...subjectPicker.value.selected]
  subjectPicker.value.visible = false
  await getMatrix()
}

/** 效果预览 */
const handlePreview = () => {
  previewVisible.value = true
}

/** 保存矩阵 */
const handleSave = async () => {
  if (!matrix.value) return
  const [confirmErr] = await showConfirm(
    t('保存后将对 JSON 接口、Excel 导出、写入拦截三个出口同时生效，是否继续？')
  )
  if (confirmErr) return

  // 组装差异格：与注解基线相同的不提交（后端也会过滤，前端先减一次体积）
  const cells: FieldMatrixCellVo[] = []
  const seen = new Set<string>()
  const collect = (fieldName: string, subjectId: string | number, accessType: FieldAccessType) => {
    const key = cellKey(fieldName, subjectId)
    if (seen.has(key)) return
    seen.add(key)
    if (accessType === baselineOf(fieldName)) return
    cells.push({
      fieldName,
      subjectType: activeSubjectType.value,
      subjectId,
      accessType,
      strategy: undefined,
      includeSub: '1'
    })
  }
  editedCells.value.forEach((value, key) => {
    const [fieldName, subjectId] = key.split('|')
    collect(fieldName, subjectId, value)
  })
  matrix.value.cells.forEach((cell) => collect(cell.fieldName, cell.subjectId, cell.accessType))

  saveLoading.value = true
  const [err] = await updateFieldMatrix({
    resourceKey: activeResourceKey.value,
    subjectType: activeSubjectType.value,
    // 覆盖式保存：必须传全部主体，否则遗漏主体的既有配置不会被清除
    subjectIds: matrix.value.subjects.map((item) => item.subjectId),
    cells
  })
  saveLoading.value = false
  if (!err) {
    showMsgSuccess(t('保存成功'))
    await getResources()
    await getMatrix()
  }
}

onMounted(() => {
  getResources()
})
</script>

<style scoped>
/**
 * 资源列表选中态
 * @description 不用 `bg-primary/10`：UnoCSS 的透明度修饰符对 `var(--el-color-primary)`
 * 这种完整色值不生效，会退化成满格纯蓝，配 text-primary 就是蓝底蓝字、文字看不见。
 * 改用 Element Plus 自带的 light-9 浅色变量，主题换色时也能跟着走。
 */
.resource-item {
  border-radius: 4px;
}

.resource-item.is-active {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  font-weight: 500;
}

/**
 * 单元格视图态
 * @description 尺寸必须和编辑态的 small el-select 严丝合缝（24px 高、12px 字、撑满列宽），
 * 否则点一下就跳行。边框留透明、hover 才显形，避免几百个格子同时描边显得脏。
 */
.field-cell-view {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 24px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: var(--el-border-radius-base);
  font-size: 12px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.field-cell-view:hover {
  border-color: var(--el-border-color);
  background-color: var(--el-fill-color-light);
}

/**
 * 编辑态：把 AFormSelect 的表单外壳压扁到和视图态同一尺寸
 *
 * @description 不处理的话点一下行高会从 35px 跳到 59px，抖动非常明显。实测三处来源：
 *   el-form-item 默认 18px 下边距；
 *   label 传的是空串但元素仍在，占掉 12px 宽（select 因此比视图态窄一截）；
 *   默认尺寸 select 32px 高、比视图态高 8px —— 这条已由 size="small" 解决。
 */
.field-cell-editing :deep(.el-form-item) {
  margin-bottom: 0;
}

.field-cell-editing :deep(.el-form-item__label) {
  display: none;
}
</style>
