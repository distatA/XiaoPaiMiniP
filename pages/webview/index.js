const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoList:[],
        indexCurrent: null,
        url:'',//h5地址
        id:0,//视频id
    },
    onLoad: function (option) {
        var that = this;
        that.setData({
            url:option.url,
            id: option.id
        })
        util.request({
            url: '/api/index/rotation_information',
            data: {
                id: option.id,
                page: 1
            },
            method: 'post',
            success: function (res) {
                if (res.data.code == 1) {
                    that.setData({
                        videoList: res.data.list,
                    });
                }
            }
        })
    },
    videoPlay: function (e) {
        var that = this;
        var curIdx = e.currentTarget.dataset.index;
        // 有播放时先将prev暂停，再播放当前点击的current
        if (that.data.indexCurrent != null) {
            var videoContextPrev = wx.createVideoContext('myVideo' + that.data.indexCurrent)
            if (that.data.indexCurrent != curIdx) {
                videoContextPrev.pause()
            }
            that.setData({
                indexCurrent: curIdx
            })
            var videoContextCurrent = wx.createVideoContext('myVideo' + curIdx)
            videoContextCurrent.play()
        } else {  // 没有播放时播放视频
            that.setData({
                indexCurrent: curIdx
            })
            var videoContext = wx.createVideoContext('myVideo' + curIdx) //这里对应的视频id
            videoContext.play()
        }
    },
    play(e) {
        var that = this;
        var id = e.currentTarget.id;
        for (var i = 0; i < that.data.healthKjList.length; i++) {
            if (id === 'myVideo' + i) {
                //console.log('播放视频不做处理');
            } else {
                //console.log('暂停其他正在播放的视频');
                var videoContext = wx.createVideoContext("myVideo" + i, that);
                videoContext.pause();
            }
        }
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
        if (this.data.url){
            console.log(this.data.url)
            return {
                title: '',
                path: '/pages/webview/index?url=' + this.data.url,
                success: function (res) {
                },
                fail: function (res) {
                }
            }
        }
        if(this.data.videoList.length>0){
            console.log(this.data.id)
            return{
                title: '',
                path: '/pages/webview/index?id=' + this.data.id,
            }
        }

    }
})