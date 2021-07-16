const app = getApp();
const util = require('../../utils/util.js');
Page({
    data: {
        data: [],
        list: [],
        page: 1,
        playing: '',
        uhide: 0,
        status: 0,
        playIndex: 0, //用于记录当前播放的视频的索引值
        courseList: [{
            videoUrl: '', //视频路径
            coverUrl: '/images/default.jpg', //视频封面图
            duration: '03:00', //视频时长
        }],
        currID: 0,
        currTitle: '',
        type: '',
        videoList: []
    },
    onLoad(e) {
        var that = this;
        that.setData({
            currID: e.id,
        });
        util.request({
            url: '/api/index/vidio_detail',
            data: {
                id: e.id,
                page: 1
            },
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        videoList: res.data.data,
                    });
                }
            }
        })
    },
    //点击切换隐藏和显示
    toggleBtn: function(event) {
        var that = this;
        var toggleBtnVal = that.data.uhide;
        var itemId = event.currentTarget.id;
        var videoContextPrev = wx.createVideoContext(_index + "")
        if (toggleBtnVal == itemId) {
            // videoContextPrev.stop();
        } else {
            videoContextPrev.stop();
            that.setData({
                uhide: itemId
            })
        }
    },
    videoPlay: function(e) {
        var that = this;
        var length = that.data.videoList.length;
        var id = e.currentTarget.id;
        if (!that.data.playIndex) {
            that.setData({
                playIndex: id
            })
            var videoContext = wx.createVideoContext(['index', id].join(''));
            videoContext.play();
        } else {
            var videoContextPrev = wx.createVideoContext(['index', that.data.playIndex].join(''));
            videoContextPrev.seek(0);
            videoContextPrev.pause();
            that.setData({
                playIndex: id
            })
            var videoContextCurrent = wx.createVideoContext(['index', that.data.playIndex].join(''))
            videoContextCurrent.play();
        }
    },
    end(e) {
        var id = e.currentTarget.dataset.id;
        this.setData({
            playIndex: id + 1
        })
        var videoContextCurrent = wx.createVideoContext(['index', this.data.playIndex].join(''))
        videoContextCurrent.play();
    },
    // 加载
    onReachBottom() {
        var that = this
        let page = that.data.page + 1
        util.request({
            url: '/api/index/vidio_detail',
            data: {
                id: that.data.currID,
                page: page
            },
            success(res) {
                if (res.data.code == 1) {
                    if (res.data.data.length > 0) {
                        var videoList = that.data.videoList.concat(res.data.data)
                        that.setData({
                            videoList: videoList,
                            page: page
                        })
                        wx.showToast({
                            title: '加载中...',
                            icon: 'loading'
                        })
                    } else {
                        wx.showToast({
                            title: '没有更多',
                            icon: 'none'
                        })
                    }
                }
            }
        })
    },
    //分享按钮函数
    onShareAppMessage: function(ops) {
        var that = this;
        var shareObj = {
            title: that.data.currTitle,
            path: '/pages/video/video?id=' + that.data.currID + '&type=' + that.data.type + '&title=' + that.data.currTitle + '&isretrue=1',
            success: function(res) {
            },
            fail: function(res) {
            }
        };
        if (ops.from === 'button') {
            var eData = ops.target.dataset;
            shareObj.title = eData.name;
            shareObj.path = '/pages/video/video?id=' + eData.id + '&title=' + eData.name + '&isretrue=1';
        }
        return shareObj;
    },
});