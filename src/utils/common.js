import {Toast,Indicator} from 'mint-ui';
/**
 * 存储localStorage
 * @param {*} name 
 * @param {*} content 
 */
export const setStore = (name, content) => {
    if (!name) return
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 * @param {*} name 
 */
export const getStore = name => {
    if (!name) return
    return window.localStorage.getItem(name)
}

/** 
 * 删除localStorage
 * @param {*} name 
 */
export const removeStore = name => {
    if (!name) return
    window.localStorage.removeItem(name)
}

/**
 *
 *判断是否为移动设备
 * @returns
 */
export const isMobile = () => {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) return true;
    return false;
}

/**
 *Jim-476542084@qq.com
 *判断是否为微信浏览器
 * @returns
 */
export const isWechatBrower = () => {
    if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) === "micromessenger") return true;
    return false;
}

/**
 *Jim-476542084@qq.com
 *异步加载JS
 * @param {*} src
 */
export const asyncScript = src => {
    let old_script = document.getElementById(src)
    if(!!old_script){
        if(old_script.ready === true){
            return
        }else{
            document.body.removeChild(old_script)
        }
    }
    let script = document.createElement('script')
    script.id = src
    script.src = src
    script.onload = script.onreadystatechange = () => {
        if(script.ready){
            return false
        }
        if(!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete'){
            script.ready = true
        }
    }
    document.body.appendChild(script)
}

/**
 *Jim-476542084@qq.com
 *返回数组中符合某键值对的对象
 * @param {*} data
 */
export const getObjectValueForKeys = (arr,key,value) =>{
    let data = {}
    if(!(arr instanceof Array)) return 
    arr.some((item) => {
        if(item[key] === value){data = item; return}
    })
    return data
}


/**
 *Jim-476542084@qq.com
 *压缩图片
 * @param {*} readFile
 */
export const compressImage = (file = {} , maxHeight = 1200 , maxWidth = 1200 , quality = 1) => {
    let fileType = file.type;
    let fileName = file.name;
    let blob = null;
    // 选择的文件是图片
    if(file.type.indexOf("image") === 0) {
        let read = new Promise(
        function(resolve,reject){
          // 压缩图片需要的一些元素和对象
          let reader = new FileReader(),
          //创建一个img对象
          img = new Image();
          reader.readAsDataURL(file);
          // 文件base64化，以便获知图片原始尺寸
          reader.onload = function(e) {
            img.src = e.target.result;
          };
  
          // base64地址图片加载完毕后执行
          (function(){
            img.onload = function () {
              // 缩放图片需要的canvas
              let canvas = document.createElement('canvas');
              let context = canvas.getContext('2d');
              // 图片原始尺寸
              let originWidth = this.width;
              let originHeight = this.height;
              // 目标尺寸
              let targetWidth = originWidth,
                  targetHeight = originHeight;
              // 图片尺寸超过300x300的限制
              if(originWidth > maxWidth || originHeight > maxHeight) {
                  if(originWidth / originHeight > maxWidth / maxHeight) {
                      // 更宽，按照宽度限定尺寸
                      targetWidth = maxWidth;
                      targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                  } else {
                      targetHeight = maxHeight;
                      targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                  }
              }
              // canvas对图片进行缩放
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              // 清除画布
              context.clearRect(0, 0, targetWidth, targetHeight);
              // 图片压缩
              context.drawImage(img, 0, 0, targetWidth, targetHeight);
              resolve({canvas,fileType,quality,fileName});
            };
          })(maxHeight,maxHeight,quality,fileType,blob,fileName);
        })
       return read;
    }
}
/**
 *Jim-476542084@qq.com
 *canvas转为Blob
 * @param {*} src
 */
export const canvasToBlob = obj => {
    let file = '';
    let {canvas,fileType,quality,fileName} = obj;
    let blob = new Promise(function(resolve,reject){
        //把压缩后的图片转blob格式  再转file
        canvas.toBlob((blob)=>{
            file = new window.File([blob], fileName, {type: fileType})
            resolve(file);
        }, fileType, quality,fileName)
    })
    return blob;
}
/**
 *Jim-476542084@qq.com
 *获取本地上传图片地址(兼容)
 * @param {*} url
 */
export const getObjectURL = file => {
    let url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

/**
 *Jim-476542084@qq.com
 *字符串转Node
 * @param {*} dom
 */
export const parseDom = htmlString => {
    return new DOMParser().parseFromString(htmlString,'text/html').body.childNodes[0]
}


/**
 *Jim-476542084@qq.com
 *H5新锚点api
 * @param {*} dom
 */
export const scrollToAnchor = anchorName => {
    if (anchorName) {
        // 找到锚点
        let anchorElement = document.getElementById(anchorName);

        // 如果对应id的锚点存在，就跳转到锚点
        if(anchorElement) { anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'}); }
    }
}

//lbs

export const showError = text => {
    Indicator.close();
    return Toast({
        message: text,
        position: 'middle',
        className:'mytoast-warn',
        duration: 1000
    });
}

export const showSuccess = text => {
    Indicator.close();
    if(text){
        return Toast({
            message: text,
            position: 'middle',
            duration: 1500
        });
    }
    return
}
