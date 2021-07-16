//获取应用实例
const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
const util = require('../../../utils/util.js');
Page({
    data: {
        showLogin: false,
        article_id: 0,
        info: {}, //文章详情
        collected: false, //收藏
        commentList: [], //文章评论
        replyList: [], //评论别人
        // 键盘收起弹出
        focusInput: false,
        isInput: false,
        maxTextLen: 100, //最大输入长度
        length: 0, //当前输入内容长度
        value: '', //评论内容
        isReply: false, //回复
        replyName: '', //被回复昵称
        zan: false //是否点赞
    },
    inputFocus(e) {
        var that = this;
        that.setData({
            isInput: true
        })
    },
    inputBlur() {
        var that = this;
        that.setData({
            isInput: false,
            isReply: false,
        })
    },
    focusButn: function() {
        var that = this;
        that.setData({
            focusInput: true,
            isInput: true
        })
    },
    length(e) {
        var that = this;
        let maxTextLen = that.data.maxTextLen;
        let length = e.detail.value.length
        that.setData({
            maxTextLen: maxTextLen,
            length: length,
            value: e.detail.value
        })
    },
    onLoad: function(option) {
        var that = this;
        that.setData({
            article_id: option.id
        })
    },
    onShow() {
        var that = this;
        that.discuss();
        util.request({
            url: '/api/index/details',
            data: {
                'id': that.data.article_id,
                'uid': app.globalData.userInfo.id
            },
            success: function(res) {
                if (res.data.code == 1) {
                    var content = util.format(res.data.info.content)
                    WxParse.wxParse('txtNew', 'html', content, that, 5);
                    that.setData({
                        info: res.data.info,
                    });
                    if (res.data.info.celled == 1) {
                        that.setData({
                            collected: true
                        })
                    }
                }
            }
        });
    },
    // 收藏
    shoucang(e) {
        var that = this;
        const collected = that.data.collected;
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/usercell/article_cell',
                data: {
                    article_id: that.data.article_id,
                    uid: app.globalData.userInfo.id
                },
                method: 'post',
                success: function(res) {
                    if (collected) {
                        that.setData({
                            collected: false
                        })
                        wx.showToast({
                            title: "取消收藏",
                            duration: 2000
                        });
                    } else {
                        that.setData({
                            collected: true
                        })
                        wx.showToast({
                            title: "收藏成功",
                            duration: 2000
                        });
                    }
                }
            })
        } else {
            that.setData({
                showLogin: true
            })
        }
    },
    //评论列表
    discuss() {
        var that = this;
        util.request({
            url: '/api/index/comment_list',
            data: {
                'id': that.data.article_id,
                'uid': app.globalData.userInfo.id,
            },
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        commentList: res.data.list,
                    });
                }
            },
        });
    },
    //提交评论
    comment: function(e) {
        var that = this;
        var value = that.data.value;
        let id = that.data.id //上一级评论内容id
        let touserid = that.data.touserid
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/index/add_comment',
                data: {
                    'aid': that.data.article_id,
                    'pid': id,
                    "content": value,
                    'uid': app.globalData.userInfo.id,
                    'touser_id': touserid,
                },
                success: function(res) {
                    if (res.data.code == 1) {
                        that.setData({
                            value: '',
                            touserid:''
                        })
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000
                        });
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000
                        });
                    }
                }
            });
        } else {
            that.setData({
                showLogin: true
            })
        }
        setTimeout(function() {
            that.discuss();
        }, 100)

    },
    // 回复
    reply(e) {
        var that = this;
        var touserid = e.currentTarget.dataset.touserid;
        var id = e.currentTarget.dataset.id;
        var replyName = e.currentTarget.dataset.name;
        that.setData({
            id: id,
            touserid: touserid,
            isReply: true,
            replyName: replyName,
        })
        that.focusButn();
    },
    //点赞
    thumb(e) {
        var that = this;
        var commentid = e.currentTarget.dataset.commentid;
        if (app.globalData.userInfo.id != 0) {
            util.request({
                url: '/api/index/comment_zan',
                data: {
                    'comment_id': commentid,
                    'uid': app.globalData.userInfo.id,
                },
            });
            setTimeout(function() {
                that.discuss();
            }, 100)
        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none'
            })
            setTimeout(function() {
                wx.switchTab({
                    url: '/pages/tabBar/user/index',
                })
            }, 1000)
        }
    },
    // 刷新
    onPullDownRefresh() {
        this.discuss();
    },
    onShareAppMessage: function(ops) {
        var that = this;
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
        var shareObj = {
            title: '校派',
            path: '/packageChoose/page/indexNews/indexNews?id=' + that.data.article_id,
        };
        if (ops.from === 'button') {
            shareObj.title = that.data.info.title;
            shareObj.path = '/packageChoose/page/indexNews/indexNews?id=' + that.data.article_id;
        }
        return shareObj;
    },
})