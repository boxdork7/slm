// 中文语言包
export default {
  // 基础操作
  operation: '操作',
  add: '新增',
  edit: '修改',
  delete: '删除',
  export: '导出',
  import: '导入',
  confirm: '确定',
  cancel: '取消',
  enable: '启用',
  disable: '停用',
  success: '成功',
  confirmAction: '是否确认',
  collapse: '折叠',
  expand: '展开',
  total: '共',
  items: '条',
  search: '搜索...',
  confirmDelete: '是否确认删除下列数据:',
  saveMainFirst: '请先保存主表信息后，子表功能将自动开启',

  // 按钮权限系统
  button: {
    // 通用按钮
    query: '查询',
    add: '新增',
    update: '修改',
    delete: '删除',
    export: '导出',
    import: '导入',
    list: '列表',
    confirm: '确定',
    cancel: '取消',
    save: '保存',
    upload: '上传',
    download: '下载',
    preview: '预览',
    view: '查看',
    generate: '生成',
    more: '更多',
    downloadTemplate: '下载模板',
    importData: '导入数据',
    exportData: '导出数据',
    collapse: '收起',
    expand: '展开',
    close: '关闭',
    sync: '同步',

    // 系统管理特殊按钮
    resetPwd: '重置密码',
    unlock: '账户解锁',
    clean: '清空',
    refreshCache: '刷新缓存',
    syncTenantRoles: '同步租户角色',
    syncTenantDicts: '同步租户字典',
    unbind: '解绑',

    // 监控特殊按钮
    batchLogout: '批量强退',
    forceLogout: '单条强退',

    // 开发工具特殊按钮
    importCode: '导入代码',
    previewCode: '预览代码',
    generateCode: '生成代码',
  },

  /** 弹窗提示 */
  dialog: {
    add: '新增',
    edit: '修改',
    delete: '删除',
    query: '查询',
    detail: '详情',
    import: '导入',
    export: '导出',
    config: '配置',
  },

  /** 消息提示 */
  message: {
    operation: '操作',

    // 操作确认类消息
    confirmDelete: '是否确认删除下列数据:',
    confirmCancel: '是否确认取消操作?',
    confirmSubmit: '是否确认提交?',
    confirm: '是否确认',
    enable: '启用',
    disable: '禁用',

    // 操作结果类消息
    success: '操作成功',
    error: '操作失败',

    // 具体操作结果消息
    saveSuccess: '保存成功',
    saveError: '保存失败',
    addSuccess: '新增成功',
    addError: '新增失败',
    updateSuccess: '修改成功',
    updateError: '修改失败',
    deleteSuccess: '删除成功',
    deleteError: '删除失败',
    importSuccess: '导入成功',
    importError: '导入失败',
    exportSuccess: '导出成功',
    exportError: '导出失败',
    confirmCleanAll: '确认删除所有数据?',
    confirmUnlock: '确认账户解锁 ',
    unlockSuccess: '账户解锁成功 ',
    unbindSuccess: '解绑成功',

    // 提示类消息
    noData: '暂无数据',
    invalidParams: '参数无效',
    networkError: '网络错误，请稍后重试',
    unauthorized: '您没有操作权限',
    sessionExpired: '会话已过期，请重新登录',

    saveMainFirst: '请先保存主表信息后，子表功能将自动开启',
    total: '共',
    items: '条',
    search: '搜索...',

    confirmForceLogout: '确认强制退出',
    confirmBatchForceLogout: '确认批量强制退出',
  },

  /** 占位符 */
  placeholder: {
    input: '请输入',
    select: '请选择',
  },

  /** 提示 */
  tooltip: {
    showSearch: '显示搜索',
    hideSearch: '隐藏搜索',
    resetSearch: '重置搜索',
    refresh: '刷新',
    columns: '显示/隐藏列',
  },

  /** 路由国际化配置 */
  route: {
    dashboard: '首页',
    document: '项目文档',
  },

  label: {
    large: '较大',
    default: '默认',
    small: '较小',
  },

  /** 登录页面国际化 */
  login: {
    selectPlaceholder: '请选择/输入公司名称',
    tenantId: '租户id',
    userName: '用户名',
    password: '密码',
    login: '登 录',
    logging: '登 录 中...',
    code: '验证码',
    rememberPassword: '记住我',
    switchRegisterPage: '立即注册',
    // 表单验证规则
    rule: {
      tenantId: { required: '请输入您的租户id' },
      userName: { required: '请输入您的账号' },
      password: { required: '请输入您的密码' },
      code: { required: '请输入验证码' },
    },
    // 第三方登录方式
    social: {
      wechat: '微信登录',
      maxkey: 'MaxKey登录',
      topiam: 'TopIam登录',
      gitee: 'Gitee登录',
      github: 'Github登录',
    },
  },

  /** 注册页面国际化 */
  register: {
    selectPlaceholder: '请选择/输入公司名称',
    userName: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    register: '注 册',
    registering: '注 册 中...',
    registerSuccess: '恭喜你，您的账号 {userName} 注册成功！',
    code: '验证码',
    switchLoginPage: '使用已有账户登录',
    // 表单验证规则（包含动态参数示例）
    rule: {
      tenantId: { required: '请输入您的租户id' },
      userName: {
        required: '请输入您的账号',
        length: '用户账号长度必须介于 {min} 和 {max} 之间',
      },
      password: {
        required: '请输入您的密码',
        length: '用户密码长度必须介于 {min} 和 {max} 之间',
        pattern: '不能包含非法字符：{strings}',
      },
      code: { required: '请输入验证码' },
      confirmPassword: {
        required: '请再次输入您的密码',
        equalToPassword: '两次输入的密码不一致',
      },
    },
  },

  /** 导航栏国际化 */
  navbar: {
    searchMenu: '搜索菜单',
    full: '全屏',
    exitFull: '退出全屏',
    language: '语言',
    dashboard: '首页',
    document: '项目文档',
    message: '消息',
    git: '仓库地址',
    layoutSize: '布局大小',
    sizeChangeSuccess: '布局大小切换成功',
    selectTenant: '选择租户',
    layoutSetting: '布局设置',
    personalCenter: '个人中心',
    logout: '退出登录',
  },

  /** 页签 */
  tagsView: {
    refresh: '刷新页面',
    closeCurrent: '关闭当前',
    closeOthers: '关闭其他',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '全部关闭',
  },

  /** 菜单系统配置（核心结构） */
  menu: {
    // 首页菜单
    index: '首页',

    // 系统管理模块
    system: {
      _self: '系统管理',
      user: '用户管理',
      role: '角色管理',
      menu: '菜单管理',
      dept: '部门管理',
      post: '岗位管理',
      dict: '字典管理',
      config: '参数设置',
      notice: '通知公告',
      // 日志管理子模块
      log: {
        _self: '日志管理',
        operLog: '操作日志',
        loginLog: '登录日志',
      },
      oss: '文件管理',
      sysOssDirectory: 'OSS目录',
    },

    // 系统监控模块
    monitor: {
      _self: '系统监控',
      online: '在线用户',
      cache: '缓存监控',
      admin: 'admin监控',
      snailjob: '任务调度',
    },

    // 系统工具模块
    tool: {
      _self: '系统工具',
      gen: '代码生成',
    },

    // 租户管理模块
    tenant: {
      _self: '租户管理',
      tenant: '租户管理',
      tenantPackage: '租户套餐',
    },

    // 应用配置模块
    appConfiguration: {
      _self: 'APP配置',
      appConfig: '多端配置',
    },

    // 商城管理
    mallManage: {
      _self: '商城管理',
    },
  },

  /** APP特有翻译 */
  app: {
    // 我的页面
    my: {
      title: '我的',
      nickname: '昵称',
      bindPhone: '绑定手机',
      points: '积分',
      balance: '余额',
      coupon: '优惠券',
      myOrders: '我的订单',
      quickActions: '快捷功能',
      commonServices: '常用服务',
      adminServices: '后台服务',
      logout: '退出登录',
      confirmLogout: '您确定要退出登录吗？',
      confirmLogoutButton: '确定退出',
      loggingOut: '退出中...',
      logoutSuccess: '退出成功',
      bindSuccess: '绑定成功',

      // 订单状态
      pendingPayment: '待付款',
      pendingReceive: '待收货',
      pendingReview: '待评价',
      refundAftersale: '退款/售后',

      // 快捷功能
      address: '收货地址',
      couponCenter: '优惠券',
      pointsMall: '积分商城',
      customerService: '客服',
      favorites: '收藏夹',
      browsingHistory: '浏览记录',
      helpCenter: '帮助中心',
      feedback: '意见反馈',

      // 常用服务
      memberCenter: '会员中心',
      userCenter: '用户中心',
    },

    // 设置页面
    settings: {
      title: '设置',
      personalInfo: '个人信息',
      phone: '手机号',
      email: '邮箱',
      language: '语言',
      currentLanguage: '当前语言',
      selectLanguage: '选择语言',
      languageChanged: '语言切换成功',
      notBound: '未绑定',

      emailBinding: '绑定邮箱',
      emailBindingMsg: '请输入您的邮箱地址',
      emailFormatError: '请输入正确的邮箱格式',
      bindSuccess: '绑定成功',
      bindError: '绑定失败',

      // 语言选项
      languageOptions: {
        zh_CN: '简体中文',
        en_US: 'English',
      },
    },
  },
}
