// pages/zhibo/zhibo.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        school:[
            {
                name:"中国科学技术大学",
                time:"5月17号 19:00-21:00",
                logo:"https://new.schoolpi.net/attach/small_program/qiangji/keji.jpg",
                id:"222"
            },
            {
                name:"东南大学",
                time:" 5月18号  19:00-20:00",
                logo:"https://new.schoolpi.net/attach/small_program/qiangji/dl.jpg",
                id:"224"
            },
            {
                name:"西安交通大学",
                time:"5月20号 16:00-18:00",
                logo:"https://new.schoolpi.net/attach/small_program/qiangji/jt.jpg",
                id:"223"
            },
            {
                name: "西北工业大学",
                time: "5月21号 18:30-19:30",
                logo: "https://new.schoolpi.net/attach/small_program/qiangji/xbgy.jpg",
                id: "236"
            },
        ]
    },
    looking:function(e){
       
        this.setData({
            schid:e.target.dataset.sid
        })
        let schid = e.target.dataset.sid
        wx.navigateToMiniProgram({
            appId: 'wxaead703d24b93901',
            path: `pages/detail/detail?id=${schid}`,
            extraData: {
              foo: 'bar'
            },
            envVersion: 'develop',
            success(res) {
              // 打开成功
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    }
})