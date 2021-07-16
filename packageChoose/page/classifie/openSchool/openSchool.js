// packageChoose/page//classifie/openSchool/openSchool.js
const app = getApp();
const until = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        schoolLists:[],
        title:'',
        cid:''
    },
    // 进入院校详情
    goDetail(e){
        var id = e.currentTarget.dataset.item.sid;
        wx.navigateTo({
            url: '../hostdetail/index?id=' + id,
        })
    },
    //获取开设院校列表数据
    fetchOpenSchool(cid){
        until.request({
            url: '/api/classifie/career_school',
            data: {
                'province': app.globalData.province.id,
                'cid': cid
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    this.setData({
                        schoolLists: res.data.list
                    })
                }
            },
            fail: function (e) {
                wx.showToast({
                    title: '网络异常！',
                    duration: 2000
                });
            },
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchOpenSchool(options.cid)
        wx.setNavigationBarTitle({
            title: options.name+'开设院校',
        })
        this.setData({
            title: options.name,
            cid:options.cid
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
        return{
            title: this.data.title + '开设院校',
            path: '/packageChoose/page/classifie/openSchool/openSchool?cid=' + this.data.cid
        }
    }
})