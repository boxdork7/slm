<!-- icon 图标 http://127.0.0.1:100/#/pages-sub/demo/wd/icon -->
<template>
  <view>
    <wd-navbar title="icon 图标" show-back />

    <view class="fixed z-100 w-100vw">
      <wd-search
        v-model="keyword"
        light
        placeholder="查找图标 (支持中英文搜索)"
        @change="handleSearch"
        @clear="handleClear"
      >
        <template #suffix>
          <view class="px-4 text-xs">共{{ showIcons.length }}条记录</view>
        </template>
      </wd-search>
    </view>

    <wd-row custom-class="mt-15 p-2 bg-white mx-4 rounded-xl" :gutter="16">
      <wd-col v-for="(iconItem, index) in showIcons" :key="index" :span="6">
        <view class="flex flex-col items-center py-3" @click="handleClick(iconItem.name)">
          <wd-icon :name="iconItem.name" size="60" color="#999" />
          <wd-text custom-class="mt-2 line-clamp-1" size="22" :text="iconItem.name" />
        </view>
      </wd-col>
    </wd-row>

    <wd-status-tip v-if="!showIcons.length" image="search" tip="当前无相关图标" />
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from '@/wd'
import { copy } from '@/utils/function'

const toast = useToast()

const keyword = ref<string>('')

// 图标配置接口
interface IconConfig {
  name: string
  keywords: string[]
}

// 带关键词的图标配置
const iconConfigs: IconConfig[] = [
  // 系统操作类
  { name: 'home', keywords: ['首页', '主页', '家', '房屋', '住宅'] },
  { name: 'home-fill', keywords: ['首页', '主页', '家', '房屋', '住宅', '填充'] },
  { name: 'back', keywords: ['返回', '后退', '回退', '向左', '箭头'] },
  { name: 'back-fill', keywords: ['返回', '后退', '回退', '向左', '箭头', '填充'] },
  { name: 'close', keywords: ['关闭', '取消', '删除', '叉号', '清除'] },
  { name: 'close-fill', keywords: ['关闭', '取消', '删除', '叉号', '清除', '填充'] },
  { name: 'close-outline', keywords: ['关闭', '取消', '删除', '叉号', '清除', '轮廓'] },
  {
    name: 'close-outline-fill',
    keywords: ['关闭', '取消', '删除', '叉号', '清除', '轮廓', '填充'],
  },
  { name: 'check', keywords: ['确认', '勾选', '选中', '对号', '检查', '完成'] },
  { name: 'check-fill', keywords: ['确认', '勾选', '选中', '对号', '检查', '完成', '填充'] },
  { name: 'check-outline', keywords: ['确认', '勾选', '选中', '对号', '检查', '完成', '轮廓'] },
  {
    name: 'check-outline-fill',
    keywords: ['确认', '勾选', '选中', '对号', '检查', '完成', '轮廓', '填充'],
  },
  { name: 'menu', keywords: ['菜单', '列表', '汉堡', '导航', '更多'] },
  { name: 'menu-fill', keywords: ['菜单', '列表', '汉堡', '导航', '更多', '填充'] },
  { name: 'more', keywords: ['更多', '三点', '选项', '操作'] },
  { name: 'more-fill', keywords: ['更多', '三点', '选项', '操作', '填充'] },
  { name: 'search', keywords: ['搜索', '查找', '放大镜', '检索'] },
  { name: 'search-fill', keywords: ['搜索', '查找', '放大镜', '检索', '填充'] },
  { name: 'filter', keywords: ['筛选', '过滤', '筛子', '条件'] },
  { name: 'filter-fill', keywords: ['筛选', '过滤', '筛子', '条件', '填充'] },
  { name: 'refresh', keywords: ['刷新', '重新加载', '更新', '循环'] },
  { name: 'refresh-fill', keywords: ['刷新', '重新加载', '更新', '循环', '填充'] },
  { name: 'setting', keywords: ['设置', '配置', '齿轮', '选项', '参数'] },
  { name: 'setting-fill', keywords: ['设置', '配置', '齿轮', '选项', '参数', '填充'] },
  { name: 'help', keywords: ['帮助', '问号', '疑问', '支持', '说明'] },
  { name: 'help-fill', keywords: ['帮助', '问号', '疑问', '支持', '说明', '填充'] },
  { name: 'add', keywords: ['添加', '新增', '加号', '创建', '插入'] },
  { name: 'add-fill', keywords: ['添加', '新增', '加号', '创建', '插入', '填充'] },
  { name: 'minus', keywords: ['减少', '删除', '减号', '移除'] },
  { name: 'minus-fill', keywords: ['减少', '删除', '减号', '移除', '填充'] },
  { name: 'edit', keywords: ['编辑', '修改', '铅笔', '写入', '更改'] },
  { name: 'edit-fill', keywords: ['编辑', '修改', '铅笔', '写入', '更改', '填充'] },
  { name: 'delete', keywords: ['删除', '移除', '垃圾桶', '清除'] },
  { name: 'delete-fill', keywords: ['删除', '移除', '垃圾桶', '清除', '填充'] },
  { name: 'copy', keywords: ['复制', '拷贝', '克隆', '副本'] },
  { name: 'copy-fill', keywords: ['复制', '拷贝', '克隆', '副本', '填充'] },
  { name: 'save', keywords: ['保存', '存储', '磁盘', '下载'] },
  { name: 'save-fill', keywords: ['保存', '存储', '磁盘', '下载', '填充'] },
  { name: 'upload', keywords: ['上传', '上载', '发送', '提交'] },
  { name: 'upload-fill', keywords: ['上传', '上载', '发送', '提交', '填充'] },
  { name: 'download', keywords: ['下载', '下载', '接收', '获取'] },
  { name: 'download-fill', keywords: ['下载', '下载', '接收', '获取', '填充'] },
  { name: 'print', keywords: ['打印', '印刷', '打印机'] },
  { name: 'print-fill', keywords: ['打印', '印刷', '打印机', '填充'] },
  { name: 'share', keywords: ['分享', '共享', '转发', '发送'] },
  { name: 'share-fill', keywords: ['分享', '共享', '转发', '发送', '填充'] },
  { name: 'link', keywords: ['链接', '连接', '网址', '超链接'] },
  { name: 'link-fill', keywords: ['链接', '连接', '网址', '超链接', '填充'] },
  { name: 'clear', keywords: ['清除', '清空', '重置', '删除'] },
  { name: 'clear-fill', keywords: ['清除', '清空', '重置', '删除', '填充'] },
  { name: 'login', keywords: ['登录', '登入', '进入', '账户'] },
  { name: 'login-fill', keywords: ['登录', '登入', '进入', '账户', '填充'] },
  { name: 'logout', keywords: ['退出', '登出', '注销', '离开'] },
  { name: 'logout-fill', keywords: ['退出', '登出', '注销', '离开', '填充'] },
  { name: 'scan', keywords: ['扫描', '二维码', '条码', '识别'] },
  { name: 'scan-fill', keywords: ['扫描', '二维码', '条码', '识别', '填充'] },
  { name: 'play', keywords: ['播放', '开始', '运行', '三角形'] },
  { name: 'play-fill', keywords: ['播放', '开始', '运行', '三角形', '填充'] },
  { name: 'pause', keywords: ['暂停', '停止', '中断'] },
  { name: 'pause-fill', keywords: ['暂停', '停止', '中断', '填充'] },
  { name: 'stop', keywords: ['停止', '结束', '终止'] },
  { name: 'stop-fill', keywords: ['停止', '结束', '终止', '填充'] },
  { name: 'next', keywords: ['下一个', '前进', '向前', '下一步'] },
  { name: 'next-fill', keywords: ['下一个', '前进', '向前', '下一步', '填充'] },
  { name: 'previous', keywords: ['上一个', '后退', '向后', '上一步'] },
  { name: 'previous-fill', keywords: ['上一个', '后退', '向后', '上一步', '填充'] },
  { name: 'forward', keywords: ['转发', '前进', '向前'] },
  { name: 'forward-fill', keywords: ['转发', '前进', '向前', '填充'] },
  { name: 'backward', keywords: ['后退', '向后', '倒退'] },
  { name: 'backward-fill', keywords: ['后退', '向后', '倒退', '填充'] },
  { name: 'enter', keywords: ['进入', '回车', '确认', '输入'] },
  { name: 'enter-fill', keywords: ['进入', '回车', '确认', '输入', '填充'] },
  { name: 'jump', keywords: ['跳转', '跳跃', '跳到'] },
  { name: 'jump-fill', keywords: ['跳转', '跳跃', '跳到', '填充'] },
  { name: 'swap', keywords: ['交换', '切换', '互换'] },
  { name: 'swap-fill', keywords: ['交换', '切换', '互换', '填充'] },
  { name: 'rotate', keywords: ['旋转', '转动', '循环'] },
  { name: 'rotate-fill', keywords: ['旋转', '转动', '循环', '填充'] },
  { name: 'fullscreen', keywords: ['全屏', '最大化', '展开'] },
  { name: 'fullscreen-fill', keywords: ['全屏', '最大化', '展开', '填充'] },
  { name: 'exit-fullscreen', keywords: ['退出全屏', '最小化', '收起'] },
  { name: 'exit-fullscreen-fill', keywords: ['退出全屏', '最小化', '收起', '填充'] },
  { name: 'zoom-in', keywords: ['放大', '缩放', '扩大'] },
  { name: 'zoom-in-fill', keywords: ['放大', '缩放', '扩大', '填充'] },
  { name: 'zoom-out', keywords: ['缩小', '缩放', '减小'] },
  { name: 'zoom-out-fill', keywords: ['缩小', '缩放', '减小', '填充'] },
  { name: 'translate', keywords: ['翻译', '转换', '语言'] },
  { name: 'translate-fill', keywords: ['翻译', '转换', '语言', '填充'] },
  { name: 'keywords', keywords: ['关键词', '标签', '关键字'] },
  { name: 'keywords-fill', keywords: ['关键词', '标签', '关键字', '填充'] },
  { name: 'rollback', keywords: ['回滚', '撤销', '恢复'] },
  { name: 'rollback-fill', keywords: ['回滚', '撤销', '恢复', '填充'] },
  { name: 'poweroff', keywords: ['关机', '电源', '关闭'] },
  { name: 'poweroff-fill', keywords: ['关机', '电源', '关闭', '填充'] },

  // 导航箭头类
  { name: 'up', keywords: ['向上', '上', '箭头', '上升'] },
  { name: 'down', keywords: ['向下', '下', '箭头', '下降'] },
  { name: 'left', keywords: ['向左', '左', '箭头', '左侧'] },
  { name: 'right', keywords: ['向右', '右', '箭头', '右侧'] },
  { name: 'chevron-up', keywords: ['向上', '箭头', '折叠', '收起'] },
  { name: 'chevron-up-fill', keywords: ['向上', '箭头', '折叠', '收起', '填充'] },
  { name: 'chevron-down', keywords: ['向下', '箭头', '展开', '下拉'] },
  { name: 'chevron-down-fill', keywords: ['向下', '箭头', '展开', '下拉', '填充'] },
  { name: 'chevron-left', keywords: ['向左', '箭头', '左侧'] },
  { name: 'chevron-left-fill', keywords: ['向左', '箭头', '左侧', '填充'] },
  { name: 'chevron-right', keywords: ['向右', '箭头', '右侧'] },
  { name: 'chevron-right-fill', keywords: ['向右', '箭头', '右侧', '填充'] },
  { name: 'caret-up', keywords: ['向上', '三角', '箭头'] },
  { name: 'caret-up-fill', keywords: ['向上', '三角', '箭头', '填充'] },
  { name: 'caret-down', keywords: ['向下', '三角', '箭头'] },
  { name: 'caret-down-fill', keywords: ['向下', '三角', '箭头', '填充'] },
  { name: 'caret-left', keywords: ['向左', '三角', '箭头'] },
  { name: 'caret-left-fill', keywords: ['向左', '三角', '箭头', '填充'] },
  { name: 'caret-right', keywords: ['向右', '三角', '箭头'] },
  { name: 'caret-right-fill', keywords: ['向右', '三角', '箭头', '填充'] },
  { name: 'backtop', keywords: ['回到顶部', '置顶', '向上'] },
  { name: 'backtop-fill', keywords: ['回到顶部', '置顶', '向上', '填充'] },
  { name: 'page-first', keywords: ['第一页', '首页', '开始'] },
  { name: 'page-first-fill', keywords: ['第一页', '首页', '开始', '填充'] },
  { name: 'page-last', keywords: ['最后一页', '末页', '结束'] },
  { name: 'page-last-fill', keywords: ['最后一页', '末页', '结束', '填充'] },
  { name: 'unfold-more', keywords: ['展开更多', '展开', '显示更多'] },
  { name: 'unfold-less', keywords: ['收起', '折叠', '显示更少'] },

  // 状态指示类
  { name: 'warn', keywords: ['警告', '注意', '提醒', '危险'] },
  { name: 'warn-fill', keywords: ['警告', '注意', '提醒', '危险', '填充'] },
  { name: 'info', keywords: ['信息', '提示', '消息', '通知'] },
  { name: 'info-fill', keywords: ['信息', '提示', '消息', '通知', '填充'] },
  { name: 'loading', keywords: ['加载', '载入', '等待', '转圈'] },
  { name: 'loading-fill', keywords: ['加载', '载入', '等待', '转圈', '填充'] },
  { name: 'locked', keywords: ['锁定', '上锁', '加密', '保护'] },
  { name: 'locked-fill', keywords: ['锁定', '上锁', '加密', '保护', '填充'] },
  { name: 'unlocked', keywords: ['解锁', '开锁', '解密', '开放'] },
  { name: 'unlocked-fill', keywords: ['解锁', '开锁', '解密', '开放', '填充'] },
  { name: 'visible', keywords: ['可见', '显示', '眼睛', '查看'] },
  { name: 'visible-fill', keywords: ['可见', '显示', '眼睛', '查看', '填充'] },
  { name: 'hidden', keywords: ['隐藏', '不可见', '遮挡'] },
  { name: 'hidden-fill', keywords: ['隐藏', '不可见', '遮挡', '填充'] },
  { name: 'time', keywords: ['时间', '时钟', '时刻'] },
  { name: 'time-fill', keywords: ['时间', '时钟', '时刻', '填充'] },
  { name: 'clock', keywords: ['时钟', '钟表', '时间'] },
  { name: 'clock-fill', keywords: ['时钟', '钟表', '时间', '填充'] },
  { name: 'star', keywords: ['星星', '收藏', '喜欢', '评分'] },
  { name: 'star-fill', keywords: ['星星', '收藏', '喜欢', '评分', '填充'] },
  { name: 'heart', keywords: ['心形', '爱心', '喜欢', '收藏'] },
  { name: 'heart-fill', keywords: ['心形', '爱心', '喜欢', '收藏', '填充'] },
  { name: 'favorite', keywords: ['收藏', '喜爱', '最爱', '偏好'] },
  { name: 'favorite-fill', keywords: ['收藏', '喜爱', '最爱', '偏好', '填充'] },
  { name: 'like', keywords: ['喜欢', '点赞', '赞', '好评'] },
  { name: 'like-fill', keywords: ['喜欢', '点赞', '赞', '好评', '填充'] },
  { name: 'dislike', keywords: ['不喜欢', '踩', '差评', '反对'] },
  { name: 'dislike-fill', keywords: ['不喜欢', '踩', '差评', '反对', '填充'] },
  { name: 'flag', keywords: ['标记', '旗帜', '举报'] },
  { name: 'flag-fill', keywords: ['标记', '旗帜', '举报', '填充'] },
  { name: 'pin', keywords: ['固定', '钉住', '置顶'] },
  { name: 'pin-fill', keywords: ['固定', '钉住', '置顶', '填充'] },
  { name: 'secured', keywords: ['安全', '保护', '安全认证'] },
  { name: 'secured-fill', keywords: ['安全', '保护', '安全认证', '填充'] },
  { name: 'notification', keywords: ['通知', '消息', '提醒', '铃铛'] },
  { name: 'notification-fill', keywords: ['通知', '消息', '提醒', '铃铛', '填充'] },
  { name: 'tips', keywords: ['提示', '小贴士', '建议'] },
  { name: 'tips-fill', keywords: ['提示', '小贴士', '建议', '填充'] },

  // 用户相关类
  { name: 'user', keywords: ['用户', '个人', '账户', '头像'] },
  { name: 'user-fill', keywords: ['用户', '个人', '账户', '头像', '填充'] },
  { name: 'user-add', keywords: ['添加用户', '新增用户', '邀请'] },
  { name: 'user-add-fill', keywords: ['添加用户', '新增用户', '邀请', '填充'] },
  { name: 'team', keywords: ['团队', '小组', '组织'] },
  { name: 'team-fill', keywords: ['团队', '小组', '组织', '填充'] },
  { name: 'contact', keywords: ['联系人', '通讯录', '好友'] },
  { name: 'contact-fill', keywords: ['联系人', '通讯录', '好友', '填充'] },
  { name: 'admin', keywords: ['管理员', '管理', '权限'] },
  { name: 'admin-fill', keywords: ['管理员', '管理', '权限', '填充'] },
  { name: 'vip', keywords: ['会员', '贵宾', '特权'] },
  { name: 'vip-fill', keywords: ['会员', '贵宾', '特权', '填充'] },
  { name: 'user-group', keywords: ['用户组', '群组', '团体'] },
  { name: 'user-group-fill', keywords: ['用户组', '群组', '团体', '填充'] },
  { name: 'user-circle', keywords: ['用户头像', '圆形头像', '个人'] },
  { name: 'user-circle-fill', keywords: ['用户头像', '圆形头像', '个人', '填充'] },
  { name: 'user-talk', keywords: ['用户对话', '聊天', '交流'] },
  { name: 'user-talk-fill', keywords: ['用户对话', '聊天', '交流', '填充'] },
  { name: 'male', keywords: ['男性', '男', '先生'] },
  { name: 'male-fill', keywords: ['男性', '男', '先生', '填充'] },
  { name: 'female', keywords: ['女性', '女', '女士'] },
  { name: 'female-fill', keywords: ['女性', '女', '女士', '填充'] },
  { name: 'crown', keywords: ['皇冠', '王冠', '等级', '荣誉'] },
  { name: 'crown-fill', keywords: ['皇冠', '王冠', '等级', '荣誉', '填充'] },
  { name: 'diamon', keywords: ['钻石', '宝石', '珍贵', '高级'] },
  { name: 'diamon-fill', keywords: ['钻石', '宝石', '珍贵', '高级', '填充'] },

  // 通讯媒体类
  { name: 'call', keywords: ['通话', '电话', '呼叫'] },
  { name: 'call-fill', keywords: ['通话', '电话', '呼叫', '填充'] },
  { name: 'phone', keywords: ['手机', '电话', '移动电话'] },
  { name: 'phone-fill', keywords: ['手机', '电话', '移动电话', '填充'] },
  { name: 'message', keywords: ['消息', '短信', '信息'] },
  { name: 'message-fill', keywords: ['消息', '短信', '信息', '填充'] },
  { name: 'mail', keywords: ['邮件', '电子邮件', '邮箱'] },
  { name: 'mail-fill', keywords: ['邮件', '电子邮件', '邮箱', '填充'] },
  { name: 'chat', keywords: ['聊天', '对话', '交流'] },
  { name: 'chat-fill', keywords: ['聊天', '对话', '交流', '填充'] },
  { name: 'video', keywords: ['视频', '录像', '摄像'] },
  { name: 'video-fill', keywords: ['视频', '录像', '摄像', '填充'] },
  { name: 'audio', keywords: ['音频', '声音', '录音'] },
  { name: 'audio-fill', keywords: ['音频', '声音', '录音', '填充'] },
  { name: 'camera', keywords: ['相机', '拍照', '摄影'] },
  { name: 'camera-fill', keywords: ['相机', '拍照', '摄影', '填充'] },
  { name: 'image', keywords: ['图片', '图像', '照片'] },
  { name: 'image-fill', keywords: ['图片', '图像', '照片', '填充'] },
  { name: 'mobile', keywords: ['手机', '移动设备', '智能机'] },
  { name: 'mobile-fill', keywords: ['手机', '移动设备', '智能机', '填充'] },
  { name: 'vibrate', keywords: ['震动', '振动', '提醒'] },
  { name: 'vibrate-fill', keywords: ['震动', '振动', '提醒', '填充'] },
  { name: 'sound', keywords: ['声音', '音量', '扬声器'] },
  { name: 'sound-fill', keywords: ['声音', '音量', '扬声器', '填充'] },
  { name: 'wifi', keywords: ['无线网', '网络', '连接'] },
  { name: 'wifi-fill', keywords: ['无线网', '网络', '连接', '填充'] },
  { name: 'wifi-error', keywords: ['网络错误', '无网络', '连接失败'] },
  { name: 'wifi-error-fill', keywords: ['网络错误', '无网络', '连接失败', '填充'] },
  { name: 'bluetooth', keywords: ['蓝牙', '无线连接'] },
  { name: 'bluetooth-fill', keywords: ['蓝牙', '无线连接', '填充'] },
  { name: 'signal', keywords: ['信号', '网络信号', '连接强度'] },
  { name: 'signal-fill', keywords: ['信号', '网络信号', '连接强度', '填充'] },
  { name: 'battery', keywords: ['电池', '电量', '续航'] },
  { name: 'battery-fill', keywords: ['电池', '电量', '续航', '填充'] },
  { name: 'cloud', keywords: ['云', '云存储', '云服务'] },
  { name: 'cloud-fill', keywords: ['云', '云存储', '云服务', '填充'] },
  { name: 'cloud-upload', keywords: ['云上传', '上传到云', '备份'] },
  { name: 'cloud-upload-fill', keywords: ['云上传', '上传到云', '备份', '填充'] },
  { name: 'cloud-download', keywords: ['云下载', '从云下载', '同步'] },
  { name: 'cloud-download-fill', keywords: ['云下载', '从云下载', '同步', '填充'] },
  { name: 'internet', keywords: ['互联网', '网络', '全球网'] },
  { name: 'internet-fill', keywords: ['互联网', '网络', '全球网', '填充'] },
  { name: 'detection', keywords: ['检测', '探测', '发现'] },
  { name: 'detection-fill', keywords: ['检测', '探测', '发现', '填充'] },
  { name: 'iphone', keywords: ['苹果手机', '智能手机', '移动设备'] },
  { name: 'iphone-fill', keywords: ['苹果手机', '智能手机', '移动设备', '填充'] },

  // 商业功能类
  { name: 'cart', keywords: ['购物车', '购买', '商品'] },
  { name: 'cart-fill', keywords: ['购物车', '购买', '商品', '填充'] },
  { name: 'payment', keywords: ['支付', '付款', '结算'] },
  { name: 'payment-fill', keywords: ['支付', '付款', '结算', '填充'] },
  { name: 'order', keywords: ['订单', '下单', '购买记录'] },
  { name: 'order-fill', keywords: ['订单', '下单', '购买记录', '填充'] },
  { name: 'coupon', keywords: ['优惠券', '折扣券', '代金券'] },
  { name: 'coupon-fill', keywords: ['优惠券', '折扣券', '代金券', '填充'] },
  { name: 'gift', keywords: ['礼品', '礼物', '赠品'] },
  { name: 'gift-fill', keywords: ['礼品', '礼物', '赠品', '填充'] },
  { name: 'wallet', keywords: ['钱包', '钱夹', '资金'] },
  { name: 'wallet-fill', keywords: ['钱包', '钱夹', '资金', '填充'] },
  { name: 'card', keywords: ['卡片', '银行卡', '信用卡'] },
  { name: 'card-fill', keywords: ['卡片', '银行卡', '信用卡', '填充'] },
  { name: 'shop', keywords: ['商店', '店铺', '购物'] },
  { name: 'shop-fill', keywords: ['商店', '店铺', '购物', '填充'] },
  { name: 'goods', keywords: ['商品', '货物', '产品'] },
  { name: 'goods-fill', keywords: ['商品', '货物', '产品', '填充'] },
  { name: 'money', keywords: ['金钱', '货币', '现金'] },
  { name: 'money-fill', keywords: ['金钱', '货币', '现金', '填充'] },
  { name: 'discount', keywords: ['折扣', '优惠', '打折'] },
  { name: 'discount-fill', keywords: ['折扣', '优惠', '打折', '填充'] },
  { name: 'qrcode', keywords: ['二维码', '扫码', '条码'] },
  { name: 'qrcode-fill', keywords: ['二维码', '扫码', '条码', '填充'] },
  { name: 'bag', keywords: ['购物袋', '包装袋', '手提袋'] },
  { name: 'bag-fill', keywords: ['购物袋', '包装袋', '手提袋', '填充'] },
  { name: 'delivery', keywords: ['配送', '快递', '运输', '物流', '待收货'] },
  { name: 'delivery-fill', keywords: ['配送', '快递', '运输', '物流', '待收货', '填充'] },
  { name: 'subscribe', keywords: ['订阅', '关注', '预订'] },
  { name: 'subscribe-fill', keywords: ['订阅', '关注', '预订', '填充'] },
  { name: 'read', keywords: ['阅读', '查看', '浏览'] },
  { name: 'read-fill', keywords: ['阅读', '查看', '浏览', '填充'] },
  { name: 'company', keywords: ['公司', '企业', '组织'] },
  { name: 'company-fill', keywords: ['公司', '企业', '组织', '填充'] },

  // 文件管理类
  { name: 'file', keywords: ['文件', '文档', '档案'] },
  { name: 'file-fill', keywords: ['文件', '文档', '档案', '填充'] },
  { name: 'file-add', keywords: ['新建文件', '添加文档', '创建'] },
  { name: 'file-add-fill', keywords: ['新建文件', '添加文档', '创建', '填充'] },
  { name: 'file-copy', keywords: ['复制文件', '文件副本', '拷贝'] },
  { name: 'file-copy-fill', keywords: ['复制文件', '文件副本', '拷贝', '填充'] },
  { name: 'file-paste', keywords: ['粘贴文件', '文件粘贴', '插入'] },
  { name: 'file-paste-fill', keywords: ['粘贴文件', '文件粘贴', '插入', '填充'] },
  { name: 'folder', keywords: ['文件夹', '目录', '文件夹'] },
  { name: 'folder-fill', keywords: ['文件夹', '目录', '文件夹', '填充'] },
  { name: 'folder-open', keywords: ['打开文件夹', '展开目录'] },
  { name: 'folder-open-fill', keywords: ['打开文件夹', '展开目录', '填充'] },
  { name: 'folder-add', keywords: ['新建文件夹', '创建目录'] },
  { name: 'folder-add-fill', keywords: ['新建文件夹', '创建目录', '填充'] },
  { name: 'file-word', keywords: ['Word文档', '文档', '办公'] },
  { name: 'file-word-fill', keywords: ['Word文档', '文档', '办公', '填充'] },
  { name: 'file-excel', keywords: ['Excel表格', '电子表格', '数据'] },
  { name: 'file-excel-fill', keywords: ['Excel表格', '电子表格', '数据', '填充'] },
  { name: 'file-ppt', keywords: ['PPT演示', '幻灯片', '演示文稿'] },
  { name: 'file-ppt-fill', keywords: ['PPT演示', '幻灯片', '演示文稿', '填充'] },
  { name: 'file-pdf', keywords: ['PDF文档', '便携文档', '电子书'] },
  { name: 'file-pdf-fill', keywords: ['PDF文档', '便携文档', '电子书', '填充'] },
  { name: 'file-unknown', keywords: ['未知文件', '其他格式', '未识别'] },
  { name: 'file-unknown-fill', keywords: ['未知文件', '其他格式', '未识别', '填充'] },
  { name: 'attach', keywords: ['附件', '附加', '关联'] },
  { name: 'attach-fill', keywords: ['附件', '附加', '关联', '填充'] },
  { name: 'book', keywords: ['书籍', '图书', '阅读'] },
  { name: 'book-fill', keywords: ['书籍', '图书', '阅读', '填充'] },

  // 工具功能类
  { name: 'calendar', keywords: ['日历', '日期', '时间表'] },
  { name: 'calendar-fill', keywords: ['日历', '日期', '时间表', '填充'] },
  { name: 'location', keywords: ['位置', '地点', '定位'] },
  { name: 'location-fill', keywords: ['位置', '地点', '定位', '填充'] },
  { name: 'map', keywords: ['地图', '导航', '路线'] },
  { name: 'map-fill', keywords: ['地图', '导航', '路线', '填充'] },
  { name: 'tools', keywords: ['工具', '设置', '配置'] },
  { name: 'tools-fill', keywords: ['工具', '设置', '配置', '填充'] },
  { name: 'laptop', keywords: ['笔记本', '电脑', '便携电脑'] },
  { name: 'laptop-fill', keywords: ['笔记本', '电脑', '便携电脑', '填充'] },
  { name: 'desktop', keywords: ['台式机', '桌面电脑', '主机'] },
  { name: 'desktop-fill', keywords: ['台式机', '桌面电脑', '主机', '填充'] },
  { name: 'app', keywords: ['应用', '软件', '程序'] },
  { name: 'app-fill', keywords: ['应用', '软件', '程序', '填充'] },
  { name: 'history', keywords: ['历史', '记录', '过往'] },
  { name: 'history-fill', keywords: ['历史', '记录', '过往', '填充'] },
  { name: 'service', keywords: ['服务', '客服', '支持'] },
  { name: 'service-fill', keywords: ['服务', '客服', '支持', '填充'] },
  { name: 'layers', keywords: ['图层', '层级', '堆叠'] },
  { name: 'layers-fill', keywords: ['图层', '层级', '堆叠', '填充'] },
  { name: 'fork', keywords: ['分叉', '分支', '复制'] },
  { name: 'fork-fill', keywords: ['分叉', '分支', '复制', '填充'] },
  { name: 'cursor', keywords: ['光标', '指针', '鼠标'] },
  { name: 'cursor-fill', keywords: ['光标', '指针', '鼠标', '填充'] },
  { name: 'pointing-hand', keywords: ['手指', '点击', '选择'] },
  { name: 'pointing-hand-fill', keywords: ['手指', '点击', '选择', '填充'] },
  { name: 'keyboard', keywords: ['键盘', '输入', '打字'] },
  { name: 'keyboard-fill', keywords: ['键盘', '输入', '打字', '填充'] },
  { name: 'keyboard-delete', keywords: ['删除键', '退格', '清除'] },
  { name: 'keyboard-delete-fill', keywords: ['删除键', '退格', '清除', '填充'] },
  { name: 'ellipsis', keywords: ['省略号', '更多', '三点'] },
  { name: 'ellipsis-fill', keywords: ['省略号', '更多', '三点', '填充'] },

  // 数据图表类
  { name: 'chart', keywords: ['图表', '统计', '数据可视化'] },
  { name: 'chart-fill', keywords: ['图表', '统计', '数据可视化', '填充'] },
  { name: 'chart-bar', keywords: ['柱状图', '条形图', '统计图'] },
  { name: 'chart-bar-fill', keywords: ['柱状图', '条形图', '统计图', '填充'] },
  { name: 'trending-up', keywords: ['上升趋势', '增长', '上涨'] },
  { name: 'trending-down', keywords: ['下降趋势', '下跌', '减少'] },
  { name: 'data', keywords: ['数据', '信息', '资料'] },
  { name: 'data-fill', keywords: ['数据', '信息', '资料', '填充'] },
  { name: 'asc', keywords: ['升序', '从小到大', '递增'] },
  { name: 'desc', keywords: ['降序', '从大到小', '递减'] },
  { name: 'move', keywords: ['移动', '拖拽', '位移'] },
  { name: 'move-fill', keywords: ['移动', '拖拽', '位移', '填充'] },
  { name: 'rectangle', keywords: ['矩形', '长方形', '框'] },
  { name: 'rectangle-fill', keywords: ['矩形', '长方形', '框', '填充'] },
  { name: 'demo', keywords: ['演示', '示例', '样例'] },
  { name: 'demo-fill', keywords: ['演示', '示例', '样例', '填充'] },

  // 社交功能类
  { name: 'comment', keywords: ['评论', '留言', '回复'] },
  { name: 'comment-fill', keywords: ['评论', '留言', '回复', '填充'] },
  { name: 'reply', keywords: ['回复', '回答', '响应'] },
  { name: 'reply-fill', keywords: ['回复', '回答', '响应', '填充'] },
  { name: 'mention', keywords: ['提及', '@', '艾特'] },
  { name: 'mention-fill', keywords: ['提及', '@', '艾特', '填充'] },
  { name: 'hashtag', keywords: ['话题', '标签', '#'] },
  { name: 'hashtag-fill', keywords: ['话题', '标签', '#', '填充'] },
  { name: 'follow', keywords: ['关注', '跟随', '订阅'] },
  { name: 'follow-fill', keywords: ['关注', '跟随', '订阅', '填充'] },
  { name: 'unfollow', keywords: ['取消关注', '不关注', '退订'] },
  { name: 'unfollow-fill', keywords: ['取消关注', '不关注', '退订', '填充'] },
  { name: 'follower', keywords: ['粉丝', '关注者', '追随者'] },
  { name: 'follower-fill', keywords: ['粉丝', '关注者', '追随者', '填充'] },
  { name: 'friend-add', keywords: ['添加好友', '加好友', '邀请'] },
  { name: 'friend-add-fill', keywords: ['添加好友', '加好友', '邀请', '填充'] },
  { name: 'group-chat', keywords: ['群聊', '群组', '多人聊天'] },
  { name: 'group-chat-fill', keywords: ['群聊', '群组', '多人聊天', '填充'] },
  { name: 'emoji', keywords: ['表情', '情绪', '符号'] },
  { name: 'emoji-fill', keywords: ['表情', '情绪', '符号', '填充'] },
  { name: 'moments', keywords: ['朋友圈', '动态', '时刻'] },
  { name: 'moments-fill', keywords: ['朋友圈', '动态', '时刻', '填充'] },

  // 平台品牌类
  { name: 'wechat', keywords: ['微信', '聊天', '社交'] },
  { name: 'wechat-fill', keywords: ['微信', '聊天', '社交', '填充'] },
  { name: 'qq', keywords: ['QQ', '腾讯', '即时通讯'] },
  { name: 'qq-fill', keywords: ['QQ', '腾讯', '即时通讯', '填充'] },
  { name: 'weibo', keywords: ['微博', '新浪', '社交媒体'] },
  { name: 'weibo-fill', keywords: ['微博', '新浪', '社交媒体', '填充'] },
  { name: 'alipay', keywords: ['支付宝', '支付', '阿里'] },
  { name: 'alipay-fill', keywords: ['支付宝', '支付', '阿里', '填充'] },
  { name: 'github', keywords: ['GitHub', '代码', '开源'] },
  { name: 'github-fill', keywords: ['GitHub', '代码', '开源', '填充'] },
  { name: 'apple', keywords: ['苹果', '苹果公司', 'iOS'] },
  { name: 'apple-fill', keywords: ['苹果', '苹果公司', 'iOS', '填充'] },
  { name: 'android', keywords: ['安卓', '谷歌', '系统'] },
  { name: 'android-fill', keywords: ['安卓', '谷歌', '系统', '填充'] },
  { name: 'windows', keywords: ['Windows', '微软', '系统'] },
  { name: 'windows-fill', keywords: ['Windows', '微软', '系统', '填充'] },
  { name: 'chrome', keywords: ['Chrome', '浏览器', '谷歌'] },
  { name: 'chrome-fill', keywords: ['Chrome', '浏览器', '谷歌', '填充'] },
  { name: 'tiktok', keywords: ['抖音', '短视频', '娱乐'] },
  { name: 'tiktok-fill', keywords: ['抖音', '短视频', '娱乐', '填充'] },
]

const showIcons = ref<IconConfig[]>([])

onMounted(() => {
  showIcons.value = iconConfigs
})

const handleSearch = () => {
  if (!keyword.value.trim()) {
    showIcons.value = iconConfigs
    return
  }

  const searchTerm = keyword.value.toLowerCase()
  showIcons.value = iconConfigs.filter((iconConfig) => {
    // 搜索图标名称
    if (iconConfig.name.toLowerCase().includes(searchTerm)) {
      return true
    }
    // 搜索关键词
    return iconConfig.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm))
  })
}

const handleClear = () => {
  keyword.value = ''
  showIcons.value = iconConfigs
}

const handleClick = (icon: string) => {
  copy(icon, `复制成功:${icon}`)
}

const { resetScrollTop, updateScrollTop } = useScroll()
onShow(() => {
  resetScrollTop()
})
onPageScroll((e) => {
  updateScrollTop(e.scrollTop)
})
</script>

<style lang="scss" scoped></style>
