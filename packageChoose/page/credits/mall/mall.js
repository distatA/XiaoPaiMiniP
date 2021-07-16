// packageChoose/page//credits/mall/mall.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsList:[],//商品
        userList: {},//积分和订单数量
        adUrl:[],//banner图
        page:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
    },
    userInfo(){
        var that = this;
        util.request({
            url: '/api/user/userinfo',
            data: {
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        userList: res.data.info,
                    })
                }
            }
        })   
    },
    goDetails(e){
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../details/details?id='+id,
        })
    },
    openAdlink(e){
        var that = this;
        let link = e.currentTarget.dataset.link;
        var media = e.currentTarget.dataset.type;
        if (media == 0) {
            return;
        } else if (media == 1) {
            wx.navigateTo({
                url: link,
            })
        } else if (media == 4) {
            wx.navigateTo({
                url: "/pages/webview/index?url=" + link,
            })
        }
    },
    // 查看订单
    goOrder(){
        wx.navigateTo({
            url: '../order/order',
        })
    },
    // 填写地址
    goAddress(){
        wx.navigateTo({
            url: '../address/address',
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        that.userInfo();
        util.request({
            url: '/api/integral/goods',
            data: {
                'uid': app.globalData.userInfo.id,
                'page': 1
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        goodsList: res.data.list,
                        page:1
                    })
                }
            }
        })   
        util.request({
            url: '/api/ad/rotation_shop',
            data: {
                "province": app.globalData.province.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        adUrl: res.data.banlist
                    })
                }
            }
        }) 
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.userInfo();

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var that = this;
        let page=that.data.page+1
        util.request({
            url: '/api/integral/goods',
            data: {
                'uid': app.globalData.userInfo.id,
                'page': page
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    wx.showToast({
                        title: '加载中...',
                        icon: 'loading'
                    })
                    let goodsList = that.data.goodsList.concat(res.data.list)
                    that.setData({
                        goodsList: goodsList,
                        page: page
                    })
                }else{
                    wx.showToast({
                        title: '没有更多',
                        icon: 'none'
                    })
                }
            }
        })  
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
    }
})