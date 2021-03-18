// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// import { ipcRenderer } from 'electron';
(function(){

    console.log('render')

    const { ipcRenderer } = require('electron')
    const max = document.getElementById('max');
    if (max) {
        max.addEventListener('click', () => {
            //发送最大化命令
            ipcRenderer.send('window-max','最大化命令');
            //切换
            // if (max.getAttribute('src') == 'images/max.png') {
            //     max.setAttribute('src', 'images/maxed.png');
            // } else {
            //     max.setAttribute('src', 'images/max.png');
            // }
        })
    }

    const min = document.getElementById('min');
    if (min) {
        min.addEventListener('click', () => {
            //发送最小化命令
            ipcRenderer.send('window-min');
        })
    }

    const close = document.getElementById('close');
    if (close) {
        close.addEventListener('click', () => {
            //发送关闭命令
            ipcRenderer.send('window-close');
        })
    }

    ipcRenderer.on('main-window-max', (event) => {
        max.classList.remove('icon-max');
        max.classList.add('icon-maxed');
        max.innerHTML = '还原'
    });
    ipcRenderer.on('main-window-unmax', (event) => {
        max.classList.remove('icon-maxed');
        max.classList.add('icon-max');
        max.innerHTML = '最大'
    })


})();



