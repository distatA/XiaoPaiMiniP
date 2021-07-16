const app = getApp();
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: '', //中奖类型
        form: '', //中奖表单
        name: '', //姓名
        tel: '', //电话
        school: '', //学校
        grade: '高三', //年级
        address: '', //奖品为虚拟物品，传账号信息
        array: ['高三', '高二','高一'],
        index:0,//年级默认显示高三
    },
    // 年级选择
    gradeChange(e){
        var that=this;
        var index = e.detail.value;
        var grade = that.data.array[index];
        that.setData({
            index: index,
            grade: grade
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            type: options.type,
            form: options.form,
        })
    },
    nameInput(e) {
        this.setData({
            name: e.detail.value
        })
    },
    telInput(e) {
        this.setData({
            tel: e.detail.value
        })
    },
    schoolInput(e) {
        this.setData({
            school: e.detail.value
        })
    },
    valueInput(e) {
        this.setData({
            address: e.detail.value
        })
    },
    // 提交
    submit(e) {
        var that = this;
        util.request({
            url: '/api/draw/address',
            data: {
                uid: app.globalData.userInfo.id,
                type: that.data.type,
                form: that.data.form,
                name: that.data.name,
                tel: that.data.tel,
                school: that.data.school,
                grade: that.data.grade,
                address: that.data.address,
            },
            success(res) {
                if(res.data.code==1){
                    wx.reLaunch({
                        url: '../result/result',
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
            }
        })
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

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})