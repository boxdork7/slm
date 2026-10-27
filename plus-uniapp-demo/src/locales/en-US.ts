export default {
  // 基础操作
  operation: 'Operation',
  add: 'Add',
  edit: 'Edit',
  delete: 'Delete',
  export: 'Export',
  import: 'Import',
  confirm: 'Confirm',
  cancel: 'Cancel',
  enable: 'Enable',
  disable: 'Disable',
  success: 'Success',
  confirmAction: 'Are you sure?',
  collapse: 'Collapse',
  expand: 'Expand',
  total: 'Total',
  items: 'Items',
  search: 'Search...',
  confirmDelete: 'Are you sure to delete the following data:',
  saveMainFirst:
    'Please save the main table information first, then the sub-table function will be automatically enabled',

  /** 按钮权限系统 */
  button: {
    // 通用按钮
    query: 'Query',
    add: 'Add',
    update: 'Edit',
    delete: 'Delete',
    export: 'Export',
    import: 'Import',
    list: 'List',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    upload: 'Upload',
    download: 'Download',
    preview: 'Preview',
    view: 'View',
    generate: 'Generate',
    more: 'More',
    downloadTemplate: 'Download Template',
    importData: 'Import Data',
    exportData: 'Export Data',
    collapse: 'Collapse',
    expand: 'Expand',
    close: 'Close',
    sync: 'Sync',

    // 系统管理特殊按钮
    resetPwd: 'Reset Password',
    unlock: 'Unlock Account',
    clean: 'Clean',
    refreshCache: 'Refresh Cache',
    syncTenantRoles: 'Sync Tenant Roles',
    syncTenantDicts: 'Sync Tenant Dicts',
    unbind: 'Unbind',

    // 监控特殊按钮
    batchLogout: 'Batch Logout',
    forceLogout: 'Force Logout',

    // 开发工具特殊按钮
    importCode: 'Import Code',
    previewCode: 'Preview Code',
    generateCode: 'Generate Code',
  },

  /** 弹窗提示 */
  dialog: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    query: 'Query',
    detail: 'Detail',
    import: 'Import',
    export: 'Export',
    config: 'Config',
  },

  /** 消息提示 */
  message: {
    operation: 'Operation',

    // 操作确认类消息
    confirmDelete: 'Are you sure to delete the following data:',
    confirmCancel: 'Are you sure to cancel the operation?',
    confirmSubmit: 'Are you sure to submit?',
    confirm: 'Are you sure',
    enable: 'Enable',
    disable: 'Disable',

    // 操作结果类消息
    success: 'Operation Successful',
    error: 'Operation Failed',

    // 具体操作结果消息
    saveSuccess: 'Save Successful',
    saveError: 'Save Failed',
    addSuccess: 'Add Successful',
    addError: 'Add Failed',
    updateSuccess: 'Update Successful',
    updateError: 'Update Failed',
    deleteSuccess: 'Delete Successful',
    deleteError: 'Delete Failed',
    importSuccess: 'Import Successful',
    importError: 'Import Failed',
    exportSuccess: 'Export Successful',
    exportError: 'Export Failed',
    confirmCleanAll: 'Confirm to delete all data?',
    confirmUnlock: 'Confirm to unlock account ',
    unlockSuccess: 'Account unlock successful ',
    unbindSuccess: 'Unbind successful',

    // 提示类消息
    noData: 'No Data',
    invalidParams: 'Invalid Parameters',
    networkError: 'Network error, please try again later',
    unauthorized: 'You do not have permission',
    sessionExpired: 'Session expired, please login again',

    saveMainFirst:
      'Please save the main table information first, then the sub-table function will be automatically enabled',
    total: 'Total',
    items: 'Items',
    search: 'Search...',

    confirmForceLogout: 'Confirm force logout',
    confirmBatchForceLogout: 'Confirm batch force logout',
  },

  /** 占位符 */
  placeholder: {
    input: 'Please input',
    select: 'Please select',
  },

  /** 提示 */
  tooltip: {
    showSearch: 'Show Search',
    hideSearch: 'Hide Search',
    resetSearch: 'Reset Search',
    refresh: 'Refresh',
    columns: 'Show/Hide Columns',
  },

  /** 路由国际化配置 */
  route: {
    dashboard: 'Dashboard',
    document: 'Document',
  },

  label: {
    large: 'Large',
    default: 'Default',
    small: 'Small',
  },

  /** 登录页面国际化 */
  login: {
    selectPlaceholder: 'Please select/input company name',
    tenantId: 'Tenant ID',
    userName: 'Username',
    password: 'Password',
    login: 'Login',
    logging: 'Logging in...',
    code: 'Verification Code',
    rememberPassword: 'Remember Me',
    switchRegisterPage: 'Register Now',
    // 表单验证规则
    rule: {
      tenantId: { required: 'Please enter your tenant ID' },
      userName: { required: 'Please enter your username' },
      password: { required: 'Please enter your password' },
      code: { required: 'Please enter verification code' },
    },
    // 第三方登录方式
    social: {
      wechat: 'WeChat Login',
      maxkey: 'MaxKey Login',
      topiam: 'TopIam Login',
      gitee: 'Gitee Login',
      github: 'Github Login',
    },
  },

  /** 注册页面国际化 */
  register: {
    selectPlaceholder: 'Please select/input company name',
    userName: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    register: 'Register',
    registering: 'Registering...',
    registerSuccess: 'Congratulations! Your account {userName} has been registered successfully!',
    code: 'Verification Code',
    switchLoginPage: 'Login with existing account',
    // 表单验证规则（包含动态参数示例）
    rule: {
      tenantId: { required: 'Please enter your tenant ID' },
      userName: {
        required: 'Please enter your username',
        length: 'Username length must be between {min} and {max}',
      },
      password: {
        required: 'Please enter your password',
        length: 'Password length must be between {min} and {max}',
        pattern: 'Cannot contain illegal characters: {strings}',
      },
      code: { required: 'Please enter verification code' },
      confirmPassword: {
        required: 'Please enter your password again',
        equalToPassword: 'The two passwords do not match',
      },
    },
  },

  /** 导航栏国际化 */
  navbar: {
    searchMenu: 'Search Menu',
    full: 'Full Screen',
    exitFull: 'Exit Full Screen',
    language: 'Language',
    dashboard: 'Dashboard',
    document: 'Document',
    message: 'Message',
    git: 'Repository',
    layoutSize: 'Layout Size',
    sizeChangeSuccess: 'Layout size changed successfully',
    selectTenant: 'Select Tenant',
    layoutSetting: 'Layout Setting',
    personalCenter: 'Personal Center',
    logout: 'Logout',
  },

  /** 页签 */
  tagsView: {
    refresh: 'Refresh',
    closeCurrent: 'Close Current',
    closeOthers: 'Close Others',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All',
  },

  /** 菜单系统配置（核心结构） */
  menu: {
    // 首页菜单
    index: 'Home',

    // 系统管理模块
    system: {
      _self: 'System Management',
      user: 'User Management',
      role: 'Role Management',
      menu: 'Menu Management',
      dept: 'Department Management',
      post: 'Post Management',
      dict: 'Dictionary Management',
      config: 'Parameter Setting',
      notice: 'Notice Announcement',
      // 日志管理子模块
      log: {
        _self: 'Log Management',
        operLog: 'Operation Log',
        loginLog: 'Login Log',
      },
      oss: 'File Management',
      sysOssDirectory: 'OSS Directory',
    },

    // 系统监控模块
    monitor: {
      _self: 'System Monitor',
      online: 'Online Users',
      cache: 'Cache Monitor',
      admin: 'Admin Monitor',
      snailjob: 'Job Scheduling',
    },

    // 系统工具模块
    tool: {
      _self: 'System Tools',
      gen: 'Code Generation',
    },

    // 租户管理模块
    tenant: {
      _self: 'Tenant Management',
      tenant: 'Tenant Management',
      tenantPackage: 'Tenant Package',
    },

    // 应用配置模块
    appConfiguration: {
      _self: 'APP Configuration',
      appConfig: 'Multi-platform Configuration',
    },

    // 商城管理
    mallManage: {
      _self: 'Mall Management',
    },
  },

  /** APP特有翻译 */
  app: {
    // 我的页面
    my: {
      title: 'My',
      nickname: 'Nickname',
      bindPhone: 'Bind Phone',
      points: 'Points',
      balance: 'Balance',
      coupon: 'Coupon',
      myOrders: 'My Orders',
      quickActions: 'Quick Actions',
      commonServices: 'Common Services',
      adminServices: 'Admin Services',
      logout: 'Logout',
      confirmLogout: 'Are you sure to logout?',
      confirmLogoutButton: 'Confirm Logout',
      loggingOut: 'Logging out...',
      logoutSuccess: 'Logout successful',
      bindSuccess: 'Bind successful',

      // 订单状态
      pendingPayment: 'Pending Payment',
      pendingReceive: 'Pending Receive',
      pendingReview: 'Pending Review',
      refundAftersale: 'Refund/After-sale',

      // 快捷功能
      address: 'Address',
      couponCenter: 'Coupon Center',
      pointsMall: 'Points Mall',
      customerService: 'Customer Service',
      favorites: 'Favorites',
      browsingHistory: 'Browsing History',
      helpCenter: 'Help Center',
      feedback: 'Feedback',

      // 常用服务
      memberCenter: 'Member Center',
      userCenter: 'User Center',
    },

    // 设置页面
    settings: {
      title: 'Settings',
      personalInfo: 'Personal Information',
      phone: 'Phone',
      email: 'Email',
      language: 'Language',
      currentLanguage: 'Current Language',
      selectLanguage: 'Select Language',
      languageChanged: 'Language changed successfully',
      notBound: 'Not bound',

      emailBinding: 'Bind Email',
      emailBindingMsg: 'Please enter your email address',
      emailFormatError: 'Please enter a valid email format',
      bindSuccess: 'Bind successful',
      bindError: 'Bind failed',

      // 语言选项
      languageOptions: {
        zh_CN: 'Simplified Chinese',
        en_US: 'English',
      },
    },
  },
}
