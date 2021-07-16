// components/redBag/redBag.js

const app = getApp()
const util = require('../../utils/utils_old_live.js')
Component({
    properties: {

    },
    data: {
        animation: '',
        isOpen: 0, //0=>不展示红包，1=>展示红包，2=>已领取红包
        redBag_id: 0,
        redBagInfo:"",//红包信息
        tapTime: '', // 防止两次点击操作间隔太快
    },
    ready() {

    },
    methods: {
        showRedBag(redBag_id, redBagInfo) {
            this.setData({
                isOpen: 1,
                redBag_id: redBag_id,
                redBagInfo: redBagInfo
            })
            console.log(this.data.isOpen)
            var animation = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease',
            })
            this.animation = animation
            var next = true;
            setInterval(function() {
                if (next) {
                    animation.translateX(4).step();
                    animation.rotate(15).step()
                    next = !next;
                } else {
                    animation.translateX(-4).step();
                    animation.rotate(-15).step()
                    next = !next;
                }
                this.setData({
                    animation: animation.export()
                })
            }.bind(this), 300)

        },
        //点击领取红包
        openRedBag() {
            var that = this;
            // 防止两次点击操作间隔太快
            var nowTime = new Date();
            if (nowTime - that.data.tapTime < 2000) {
                return;
            }
            that.setData({
                isOpen: 2
            })
            wx.request({
                url: 'https://new.schoolpi.net/api/hongbao/live_send_redbag',
                data: {
                    user_id: app.globalData.userInfo.id,
                    redbag_id: that.data.redBag_id,
                },
                method: 'post',
                success: function (res) {
                    if (res.data.code === 1) {
                        
                    }
                }
            })
        },
        _close() {
            this.setData({
                isOpen: 0
            })
        }
    }
})