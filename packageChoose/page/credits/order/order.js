// packageChoose/page//credits/order/order.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: [], //订单
        expressList: [], //物流信息
        express: '',
        express_num: '',
        show: false
    },
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    // 查看物流
    click(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        that.showModal();
        util.request({
            url: '/api/integral/orders_traces',
            data: {
                'id': id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        expressList: res.data.list,
                        express: res.data.express,
                        express_num: res.data.express_num,
                        expressShow: true
                    })
                } else {
                    that.setData({
                        msg: res.data.msg,
                        expressShow: false
                    })
                }
            }
        })
    },
    showModal: function() {
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    hideModal: function() {
        // 隐藏遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function() {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        util.request({
            url: '/api/integral/orders',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        orderList: res.data.list,
                    })
                } else {
                    that.setData({
                        show: true
                    })

                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
    }
})