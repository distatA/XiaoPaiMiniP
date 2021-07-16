const app = getApp();
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: '请选择省市', //省市
        type: '', //中奖类型
        form: '', //中奖表单
        name: '', //姓名
        tel: '', //电话
        school: '', //学校
        grade: '高三', //年级
        address: '', //奖品为口罩，传详细地址
        picUrl:'',//图片路径 默认提示添加图片
        picShow:false,//显示上传图片
        array: ['高三', '高二', '高一'],
        index: 0,//年级默认显示高三
    },
    // 年级选择
    gradeChange(e) {
        var that = this;
        var index = e.detail.value;
        var grade = that.data.array[index];
        that.setData({
            index: index,
            grade: grade
        })
    },
    // 省市
    regionChange: function(e) {
        this.setData({
            region: e.detail.value
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
    addressInput(e) {
        this.setData({
            address: e.detail.value
        })
    },
    // 上传证明信息图片
    identity() {
        var that=this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths)
                wx.uploadFile({
                    url: 'https://new.schoolpi.net/api/upload/images', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'img',
                    success: function(res) {
                        var res=JSON.parse(res.data)
                        that.setData({
                            picUrl:res.data.all_path,
                            picShow:true
                        })
                    }
                })
            }
        })
    },
    // 提交
    submit(e) {
        var that = this;
        var address = that.data.region + that.data.address;
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
                address: address,
                cardimg:that.data.picUrl
            },
            success(res) {
                if (res.data.code == 1) {
                    wx.reLaunch({
                        url: '../result/result',
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
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