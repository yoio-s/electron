const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')

const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
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

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            defaultEncoding: 'utf-8',
            // backgroundThrottling: false,
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
        frame: true, // 是否显示顶部导航栏
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
        log.info(data)
        mainWindow.webContents.send('message', '哒哒哒哒')
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


    // const server = 'https://github.com/yoio-s/electron.git'
    // const url = `${server}/update/${process.platform}/ ${app.getVersion()}`
    // autoUpdater.setFeedURL({
    //     provider: "github", // 这里还可以是 generic, s3, bintray
    //     url:"https://github.com/yoio-s/electron/releases/latest"
    //     // https://github.com/yoio-s/electron.git
    //     // url: url
    // });
    autoUpdater.setFeedURL('https://github.com/yoio-s/electron/releases/latest')
    // autoUpdater.checkForUpdates()

    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, 60000)
//更新错误事件
    autoUpdater.on('error', function (error) {
        sendUpdateMessage(returnData.error.msg)
        log.info(returnData.error, error)
    });

//检查事件 在检查更新是否已开始时发出
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(returnData.checking.msg)
        log.info(returnData.checking)
    });

//发现新版本 有可用更新时发出
    autoUpdater.on('update-available', function (messsage) {
        sendUpdateMessage(returnData.updateAva.msg)
        log.info(returnData.updateAva,messsage)
    });

//当前版本为最新版本 没有可用更新时发出
    autoUpdater.on('update-not-available', function (messsage) {
        setTimeout(function () {
            sendUpdateMessage(returnData.updateNotAva.msg)
            log.info(returnData.updateNotAva,messsage)
        }, 1000);
    });

//更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        // win.webContents.send('downloadProgress', progressObj)
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        sendUpdateMessage('正在下载',log_message)
        log.info('正在下载',log_message)
    });


//下载完毕
// autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    autoUpdater.on('update-downloaded', function (messsage) {
        //退出并进行安装（这里可以做成让用户确认后再调用）
        log.info("下载完毕",messsage)
        autoUpdater.quitAndInstall();
    });

//发送消息给窗口
    function sendUpdateMessage(text) {
        mainWindow.webContents.send('message', text)
    }
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
        label: '菜单',
        showOn: ["darwin"],
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
    }
]
const menu = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu)










