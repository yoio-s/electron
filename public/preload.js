// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// import { webviewJs } from "./webview/webview"
// import { webviewCss } from "./webview/webviewcss.css"
// const {webviewJs} = require('./webview/webview')
// const {webviewCss} = require('./webview/webviewcss.css')
window.addEventListener('DOMContentLoaded', () => {

    const webview = document.querySelector('#skylarkly')

    const pageOne = document.querySelector('#pageOne')

    const pageTwo = document.querySelector('#pagetwo')


    pageOne.addEventListener('click', function () {
        webview.src = "https://skylarkly.com"


        const loadstart = () => {
            // alert('开始加载')
        }

        const loadstop = () => {

            // alert('加载完成')
            //注入js
            // webview.executeJavaScript(webviewJs)
            // webview.insertCSS(webviewCss)
            webview.executeJavaScript(`
             document.body.innerHTML += '<div class="popup">'+
                '<iframe id="mainIframe" name="mainIframe" src="https://skylarkly.com/namespaces/14/yet_another_workflow/flows/1702/journeys/new" frameborder="0" scrolling="auto" ></iframe>'+
            '</div>'

            
            let loginBox =  document.querySelector('.project-to-use')
            loginBox.innerHTML += '<a class="ui small inverted button" href="javascript:;">发起流程</a>'
            const loginButton =  document.querySelector('.project-to-use>a')
            
            
            function closepop () {
                document.querySelector('.popup').style.display = 'none'
            }
            function openpop () {
                document.querySelector('.popup').style.display = 'block'
                
                var iframe = document.getElementById("mainIframe");
        
                //console.log(iframe.contentWindow.document.getElementsByClassName('form-field-value'))
                var iwindow = iframe.contentWindow;
                console.log(iwindow)
                var idoc = iwindow.document;
                console.log(idoc.URL)
                const contentValue = idoc.querySelector('.form-field-value')
                const ifromBthBox = idoc.querySelector('.formable-outer-actions')
                
                console.log(contentValue)
                contentValue.value = 'woaijiaban'
                ifromBthBox.innerHTML += '<button class="btn-large">取消</button>'
                
                const ifromBth = idoc.querySelectorAll('.btn-large')
                ifromBth[2].addEventListener('click',function(){
                    closepop();
                    scrControl(1)
                })
                
            }
            loginButton.href = 'javascript:;'
            loginButton.onclick = function(){
               openpop();
               alert("操作成功");
               scrControl(0)
            }
            console.log(loginButton)
            
            
            function bodyScroll(event){
                event.preventDefault();
            }
            function scrControl(t){
                if(t == 0){ //禁止滚动
                    document.body.addEventListener('touchmove', this.bodyScroll, { passive: false });
                    console.log('禁止滚动')
                }else if( t == 1){ //开启滚动
                    document.body.removeEventListener('touchmove',this.bodyScroll, {passive: false});
                    console.log('开启滚动')
                }
            }
            

        `)
            // 注入css
            webview.insertCSS(`
        .popup {
            position: fixed;
            top: 0;
            left: 0;
            margin: auto;
            z-index: 999;
            display: none;
            background: rgba(0,0,0,.3);
            width: 100%;
            height: 100%;
        }
        .popup>iframe {
            width: 80%;
            height: 96%;
            margin: auto 10%;
        }
        `)
            // 直接打开调试工具
            webview.openDevTools();
        }
        webview.addEventListener('did-start-loading', loadstart)
        webview.addEventListener('did-stop-loading', loadstop)

    })

    pageTwo.addEventListener('click', function () {
        webview.src = "https://www.baidu.com/"
    })


    // const replaceText = (selector, text) => {
    //   const element = document.getElementById(selector)
    //   if (element) element.innerText = text
    // }
    // for (const type of ['chrome', 'node', 'electron']) {
    //   replaceText(`${type}-version`, process.versions[type])
    // }
})
