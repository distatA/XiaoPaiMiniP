//获取应用实例（个人中心====>绑定手机号页面）
const app = getApp()
Page({
    data: {
        btnType: '',
        showCode: 0,
        phone: '',
        code: '',
        countDown: 5,
        btn_txt: '发送验证码',
        btnValue: 'qued',
        mobile: ''
    },
    input(e) {
        const type = e.currentTarget.dataset.type
        const val = e.detail.value
        this.setData({
            [type]: val,
            codeLength: val.length
        })
        if (type === 'code' && val.length === 6 && /^1[3|4|5|7|8][0-9]{9}$/.test(this.data.phone)) {
            this.sendCode(val)
        }
    },
    countDown() {
        if (this.data.countDown <= 0) {
            clearInterval(this.timer)
            return
        }
        this.setData({
            countDown: --this.data.countDown
        })
        setTimeout(() => {
            this.countDown()
        }, 1000)
    },
    sendCode(val) {

        wx.request({
            url: app.globalData.hostUrl + '/users/bindmobile',
            method: 'post',
            data: {
                uid: app.globalData.userid,
                phone_num: this.data.phone,
                code: this.data.code
            },
            success: function (res) {
                if (res.data.code == 1) {
                    app.globalData.userInfo.mobile = res.data.mobile;
                    wx.showToast({
                        title: '绑定成功',
                        icon: 'none'
                    });
                    setTimeout(function () {
                        wx.navigateBack();
                    }, 3000);
                }

            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        })
    },
    getCode() {
        var that = this;
        if (/^1[3|4|5|7|8][0-9]{9}$/.test(that.data.phone)) {
            that.setData({
                countDown: 60
            })

            wx.request({
                url: app.globalData.hostUrl + '/users/getcode',
                method: 'post',
                data: {
                    "mobile": that.data.phone,
                    "uid": app.globalData.userid
                },
                success: function (res) {
                    if (res.data.code == 1) {

                        if (that.data.btnType == 'upadte') {
                            that.setData({
                                showCode: 1,
                                btn_txt: '更新绑定'
                            })
                        } else {
                            that.setData({
                                showCode: 1,
                                btn_txt: '提交'
                            })
                        }
                        wx.showToast({
                            title: '已发送',
                            icon: 'success'
                        })
                        that.countDown();
                    } else {
                        wx.showToast({
                            title: '网络异常！',
                            duration: 2000
                        });
                    }

                },
                fail: function (e) {
                    wx.showToast({
                        title: '网络异常！',
                        duration: 2000
                    });
                },
            })
        } else {
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none'
            })
        }
    },
    onLoad() {

    },
    onShow() {
        if (app.globalData.userInfo['mobile']) {
            this.setData({
                btnType: 'upadte'
            })
        } else {
            this.setData({
                btnType: 'add'
            })
        }

    }
})