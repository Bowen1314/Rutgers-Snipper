export const translations = {
    zh: {
        // Dashboard
        appTitle: "Rutgers Sniper",
        lastScan: "上次扫描: ",
        monitoring: "正在监控",
        stopped: "已停止",
        settings: "设置",
        stopMonitoring: "停止监控",
        startMonitoring: "开始监控",
        inputPlaceholder: "输入课程代码 (如 07:965:211) 或 Index (如 10193)",
        adding: "添加中...",
        add: "添加",
        indexWatchlist: "Index 监控列表",
        noIndexItems: "暂无 Index 监控项",
        courseWatchlist: "课程监控列表",
        noCourseItems: "暂无课程监控项",
        waitingForData: "等待数据...",
        remove: "移除",
        open: "开启",
        closed: "关闭",

        // Settings
        scanInterval: "扫描间隔 (秒)",
        intervalHint: "设置后台检查课程状态的频率。建议不要低于 5 秒以避免被封禁。",
        cancel: "取消",
        saving: "保存中...",
        save: "保存",

        // Toasts & Messages
        fetchStatusFailed: "无法获取状态",
        addedTarget: "已添加监控目标: ",
        addFailed: "添加失败，请检查输入",
        removed: "已移除: ",
        removeFailed: "移除失败",
        monitoringStopped: "监控已停止",
        listEmpty: "监控列表为空，请先添加课程",
        monitoringStarted: "监控已启动",
        operationFailed: "操作失败",
        settingsSaved: "设置已保存",
        settingsUpdateFailed: "设置更新失败",

        // Confirm Modal
        confirmRemove: "确认移除",
        confirmRemoveMessage: "您确定要停止监控 {target} 吗？此操作无法撤销。",
        confirm: "确认"
    },
    en: {
        // Dashboard
        appTitle: "Rutgers Sniper",
        lastScan: "Last Scan: ",
        monitoring: "Monitoring",
        stopped: "Stopped",
        settings: "Settings",
        stopMonitoring: "Stop Monitoring",
        startMonitoring: "Start Monitoring",
        inputPlaceholder: "Enter Course Code (e.g. 07:965:211) or Index (e.g. 10193)",
        adding: "Adding...",
        add: "Add",
        indexWatchlist: "Index Watchlist",
        noIndexItems: "No Index Watch Items",
        courseWatchlist: "Course Watchlist",
        noCourseItems: "No Course Watch Items",
        waitingForData: "Waiting for data...",
        remove: "Remove",
        open: "Open",
        closed: "Closed",

        // Settings
        scanInterval: "Scan Interval (seconds)",
        intervalHint: "Set the frequency of background checks. Recommended not less than 5 seconds to avoid IP ban.",
        cancel: "Cancel",
        saving: "Saving...",
        save: "Save",

        // Toasts & Messages
        fetchStatusFailed: "Failed to fetch status",
        addedTarget: "Added target: ",
        addFailed: "Add failed, please check input",
        removed: "Removed: ",
        removeFailed: "Remove failed",
        monitoringStopped: "Monitoring stopped",
        listEmpty: "Watchlist is empty, please add courses first",
        monitoringStarted: "Monitoring started",
        operationFailed: "Operation failed",
        settingsSaved: "Settings saved",
        settingsUpdateFailed: "Failed to update settings",

        // Confirm Modal
        confirmRemove: "Confirm Remove",
        confirmRemoveMessage: "Are you sure you want to stop monitoring {target}? This action cannot be undone.",
        confirm: "Confirm"
    }
};
