// packageChoose/page//credits/details/details.js
const app = getApp()
const util = require('../../../../utils/util.js');
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        num:1,
        currentData:0,//当前图片
        goodsInfo:{},//商品内容
        goodsPic:[],//商品图片
        exchangeShow:false,//兑换弹窗
        note:''//备注信息
    },
    // 加号
    addCount: function (e) {
        var that=this;
        var num = this.data.num;
        if (num < 10) {
            that.data.num++;
        }
        that.setData({
            num: that.data.num
        });
    },
    // 减号
    delCount: function (e) {
        var that = this;
        var num = that.data.num;
        if (num > 1) {
            that.data.num--;
        }
        that.setData({
            num: that.data.num
        });
    },
    // 切换图片
    changePic: function (e) {
        var that = this;
        if (that.data.currentData === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentData: e.target.dataset.current
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        util.request({
            url: '/api/integral/show',
            data: {
                'id': options.id,
                'uid': app.globalData.userInfo.id,
            },
            method: 'post',
            success(res) {
                if (res.data.code == 1) {
                    var content = util.format(res.data.info.content)
                    WxParse.wxParse('txtNew', 'html', content, that, 5);
                    that.setData({
                        goodsInfo: res.data.info,
                        goodsPic: res.data.info.thumb
                    })

                }
            }
        })   
    },
    // 兑换商品
    exchangeShow(){
        var that=this;
        that.setData({
            exchangeShow: true,
        })
    },
    // 取消兑换
    reject() {
        var that = this;
        that.setData({
            exchangeShow: false,
        })
    },
    note(e){
        this.setData({
            note:e.detail.value
        })
    },
    // 确定兑换
    affirm(e) {

        var that = this;
        util.request({
            url: '/api/integral/buy',
            data: {
                'uid': app.globalData.userInfo.id,
                'id': e.currentTarget.dataset.id,
                'num': e.currentTarget.dataset.num,
                note:that.data.note,
            },
            success(res) {
                if (res.data.code == 1) {
                    that.setData({
                        exchangeShow: false,
                    })
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

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