const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;
const log = require('electron-log');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            defaultEncoding: 'utf-8',
            backgroundThrottling: false,
            nodeIntegrationInWorker: true,
            nodeIntegration: true,
            webviewTag: true,
            sandbox: false,
            enableRemoteModule: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        },
        resizable: true, // 窗口大小是否可改变
        maximizable: true, // 窗口是否可以最大化
        frame: false, // 是否显示顶部导航栏
    })

    // and load the index.html of the app.
    mainWindow.loadFile('dist/index.html')
    // mainWindow.loadURL('https://www.baidu.com')

    mainWindow.webContents.openDevTools()

    //接收最小化命令
    ipcMain.on('window-min', function () {

        mainWindow.minimize();
    })
    //接收最大化命令
    ipcMain.on('window-max', function (event,data) {
        // if (mainWindow.isMaximized()) {
        //     console.log('ismax',)
        //     mainWindow.restore();
        // } else {
        //     mainWindow.maximize();
        // }
        console.log('接收最大')
        console.log(data,'ss')
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    })
    //接收关闭命令
    ipcMain.on('window-close', function () {
        console.log('接收关闭')
        mainWindow.close();
    })

    mainWindow.on('maximize', function () {
        mainWindow.webContents.send('main-window-max');
    })
    mainWindow.on('unmaximize', function () {
        mainWindow.webContents.send('main-window-unmax');
    })

}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    autoUpdater.checkForUpdatesAndNotify();
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('ready', function (){

})

let template = [
    {
        label: '编辑'
    },
    {
        label: '菜单',
        // showOn: ["darwin"],
        // hideOn: ["win32", "darwin"];
        submenu: [{
            label: '最小化',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: '关闭',
            accelerator: 'CmdOrCtrl+W',
            click: function () {
                app.quit();
            }
        }, {
            type: 'separator'
        }, {
            label: '重新打开窗口',
            accelerator: 'CmdOrCtrl+Shift+T',
            enabled: false,
            key: 'reopenMenuItem',
            click: function () {
                app.emit('activate')
            }
        }]
    },
    {
        label: '菜单2'
    }
]
const menu = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu)





const returnData = {
    error: {
        status: -1,
        msg: '更新时发生意外，无法进行正常更新！'
    },
    checking: {
        status: 0,
        msg: '正在检查更新……'
    },
    updateAva: {
        status: 1,
        msg: '正在升级……'
    },
    updateNotAva: {
        status: 2,
        msg: '开始加载程序……'
    }
};

// autoUpdater.setFeedURL({
//     provider: "github", // 这里还可以是 generic, s3, bintray
//     url:"https://github.com/yoio-s/electron/releases/latest"
//     // https://github.com/yoio-s/electron.git
// });

autoUpdater.on('update-available', function (info) {
    console.log('Update available.');
});

//更新错误事件
autoUpdater.on('error', function (error) {
    sendUpdateMessage(returnData.error)
    log.info(returnData.error, error)
});

//检查事件 在检查更新是否已开始时发出
autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(returnData.checking)
    log.info(returnData.checking)
});

//发现新版本 有可用更新时发出
autoUpdater.on('update-available', function () {
    sendUpdateMessage(returnData.updateAva)
    log.info(returnData.updateAva)
});

//当前版本为最新版本 没有可用更新时发出
autoUpdater.on('update-not-available', function () {
    setTimeout(function () {
        sendUpdateMessage(returnData.updateNotAva)
        log.info(returnData.updateNotAva)
    }, 1000);
});

//更新下载进度事件
autoUpdater.on('download-progress', function (progressObj) {
    // win.webContents.send('downloadProgress', progressObj)
    log.info('正在下载',progressObj)
});


//下载完毕
// autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
autoUpdater.on('update-downloaded', function () {
    //退出并进行安装（这里可以做成让用户确认后再调用）
    autoUpdater.quitAndInstall();
    log.info("下载完毕")
});

//发送消息给窗口
function sendUpdateMessage(text) {
    // mainWindow.webContents.send('message', text)
    alert(text)
}




