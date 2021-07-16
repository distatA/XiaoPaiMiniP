const app = getApp();
const util = require('../../utils/util.js');
Page({
    data:{
        photoUrl:'',
        isAuthSavePhoto: false,
    },
    onLoad(){
        var that = this;
        util.request({
            url: '/api/qrcode/createwxaqrcode',
            data: {
                uid: app.globalData.userInfo.id
            },
            method: 'post',
            success: function (res) {
                if (res.data.code == 1) {
                    that.setData({
                        photoUrl: res.data.img,
                    });
                }
            }
        })
    },
    onSaveToPhone() {
        this.getSetting().then((res) => {
            // 判断用户是否授权了保存到本地的权限
            if (!res.authSetting['scope.writePhotosAlbum']) {
                this.authorize().then(() => {
                    this.savedownloadFile(this.data.photoUrl)
                    this.setData({
                        isAuthSavePhoto: false
                    })
                }).catch(() => {
                    wx.showToast({
                        title: '您拒绝了授权',
                        icon: 'none',
                        duration: 1500
                    })
                    this.setData({
                        isAuthSavePhoto: true
                    })
                })
            } else {
                this.savedownloadFile(this.data.photoUrl)
            }
        })
    },
    //打开设置，引导用户授权
    onOpenSetting() {
        wx.openSetting({
            success: (res) => {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.showToast({
                        title: '您未授权',
                        icon: 'none',
                        duration: 1500
                    })
                    this.setData({// 拒绝授权
                        isAuthSavePhoto: true
                    })

                } else {// 接受授权
                    this.setData({
                        isAuthSavePhoto: false
                    })
                    this.onSaveToPhone() // 接受授权后保存图片

                }

            }
        })

    },
    // 获取用户已经授予了哪些权限
    getSetting() {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: res => {
                    resolve(res)
                }
            })
        })
    },
    // 发起首次授权请求
    authorize() {
        return new Promise((resolve, reject) => {
            wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                    resolve()
                },
                fail: res => { //这里是用户拒绝授权后的回调
                    reject()
                }
            })
        })
    },
    savedownloadFile(img) {
        this.downLoadFile(img).then((res) => {
            return this.saveImageToPhotosAlbum(res.tempFilePath)
        }).then(() => {
        })
    },
    //单文件下载(下载文件资源到本地)，客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径。
    downLoadFile(img) {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url: img,
                success: (res) => {
                    resolve(res)
                }
            })
        })
    },
    // 保存图片到系统相册
    saveImageToPhotosAlbum(saveUrl) {
        return new Promise((resolve, reject) => {
            wx.saveImageToPhotosAlbum({
                filePath: saveUrl,
                success: (res) => {
                    wx.showToast({
                        title: '保存成功',
                        duration: 1000,
                    })
                    resolve()
                }
            })
        })
    },
    // 弹出模态框提示用户是否要去设置页授权
    showModal() {
        wx.showModal({
            title: '检测到您没有打开保存到相册的权限，是否前往设置打开？',
            success: (res) => {
                if (res.confirm) {
                    this.onOpenSetting() // 打开设置页面          
                } else if (res.cancel) {
                }
            }
        })
    },    
    //分享按钮函数
    onShareAppMessage: function (ops) {
    //     var that=this;
    //     if (ops.from === 'button') {
    //         // 来自页面内转发按钮
    //         console.log(ops.target)
    //     }
    //     return {
    //         title: '校派',
    //         path: '/pages/index/index',
    //         imageUrl:that.data.imgUrl,
    //         success: function (res) {
    //             // 转发成功
    //             console.log("转发成功:" + JSON.stringify(res));
    //         },
    //         fail: function (res) {
    //             // 转发失败
    //             console.log("转发失败:" + JSON.stringify(res));
    //         }
    //     }

    }


})
