const app = getApp();
const util = require('../../../../../utils/util.js');
var WxParse = require('../../../../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailtList: {},
        url:""
    },
    //获取题目详情数据
    fetchSubjectDetail(id) {
        var that = this;
        util.request({
            url: '/api/classifie/question_school_details',
            data: {
                'id': id
            },
            method: 'post',
            success: (res) => {
                console.log(res);
                if (res.data.code === 1) {
                    WxParse.wxParse('txtNew', 'html', res.data.list.content, that, 5);
                    that.setData({
                        detailtList: res.data.list,
                        url: res.data.list.file_url
                    })
                }
            }
        })
    },
    // 点击下载
    download(){
        var that=this;
        wx.setClipboardData({
            data: this.data.url,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
        // wx.downloadFile({
        //     url: that.data.url,
        //     success: function (res) {
        //         console.log(wx.env.USER_DATA_PATH+'/hello.txt');
        //         const filePath = res.tempFilePath
        //         // console.log(filePath)
        //         const fs = wx.getFileSystemManager()
        //         //fs.writeFileSync(`${wx.env.USER_DATA_PATH}/分类招生.pdf`, filePath, 'utf8')
        //         fs.saveFile({
        //             tempFilePath: filePath, // 传入一个本地临时文件路径
        //             filePath: wx.env.USER_DATA_PATH+'/分类招生.pdf',
        //             success(res) {
        //                 wx.showToast({
        //                     title: '下载成功',
        //                     icon: 'success',
        //                     duration: 2000
        //                 })
        //                 console.log(res) // res.savedFilePath 为一个本地缓存文件路径
        //             },
        //             fail(res){
        //                 console.log(res)
        //             }
        //         })
        //         // wx.openDocument({
        //         //     filePath: filePath,
        //         //     success: function (res) {
        //         //         console.log('打开文档成功')
        //         //     }
        //         // })
        //     }
        // })     
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.fetchSubjectDetail(options.id)
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