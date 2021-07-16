// components/redBag/redBag.js
const app = getApp()
const util = require('../../utils/utils_old_live.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        animation: '',
        isOpen: 0,//0=>不展示宝箱，1=>展示宝箱，2=>已领取宝箱
        redBag_id: 0,
        boxInfo:"",//宝箱内容
    },
    ready() {

    },
    /**
     * 组件的方法列表
     */
    methods: {
        showBox(redBag_id) {
            console.log("2121")
            this.setData({
                isOpen: 1,
                redBag_id: redBag_id
            })
            var animation = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease',
            })
            this.animation = animation
            var next = true;
            setInterval(function () {
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
        //点击领取宝箱
        openBox() {
            let that = this; 
            this.setData({
                isOpen: 2,
                boxInfo:"200积分"
            })
            // util.request({
            //     url: '/api/hongbao/live_send_redbag',
            //     data: {
            //         user_id: app.globalData.userInfo.id,
            //         redbag_id: that.data.redBag_id,
            //     },
            //     method: 'post',
            //     success: function (res) {
            //         if (res.data.code === 1) {
            //             this.setData({
            //                 isOpen: 2
            //             })
            //         } else {

            //         }
            //     }
            // })

        },
        _close() {
            this.setData({
                isOpen: 0
            })
        }
    }
})
