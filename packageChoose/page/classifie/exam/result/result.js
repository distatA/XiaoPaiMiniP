// packageChoose/page//classifie/exam/result/result.js
const app = getApp();
const util = require('../../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        err: 'https://new.schoolpi.net/attach/small_program/classify/select_err.png',
        sure: 'https://new.schoolpi.net/attach/small_program/classify/select_sure.png',
        none: "https://new.schoolpi.net/attach/small_program/classify/select.png",
        list: [{
                "num": "1",
                "image": "https://new.schoolpi.net/uploads/live/20200327/7761d4d565edb9b2a5b998b97708ed28.png",
                "error": "A",
                "answer": "A"
            },
            {
                "num": "2",
                "image": "https://new.schoolpi.net/uploads/live/20200327/deb400a9dcbe85dc605ccaa0016adce4.png",
                "error": "A",
                "answer": "A"
            },
            {
                "num": "3",
                "image": "https://new.schoolpi.net/uploads/live/20200327/7cec7872d4416873af6164a3b8d43be1.png",
                "error": "A",
                "answer": "D"
            },
            {
                "num": "4",
                "image": "https://new.schoolpi.net/uploads/live/20200327/843378ddcaa1c5a2ba2a9bb9106a64dd.png",
                "error": "A",
                "answer": "B"
            },
            {
                "num": "5",
                "image": "https://new.schoolpi.net/uploads/live/20200327/ed13793b0ec70942885908d0db926319.png",
                "error": "A",
                "answer": "B"
            }
        ],
        showQuestionList: false,
        current: 1,
        timeCost: '',
        successNum: "",
        errorNum: "",
        province: "",
        back_image: '',
        fileUrl: '',
    },
    //上一题
    previous() {
        if (this.data.current > 1) {
            this.setData({
                current: this.data.current - 1
            })
        }
    },
    //下一题
    next() {
        console.log()
        if (this.data.current >= 1 && this.data.current < this.data.list.length) {
            this.setData({
                current: this.data.current + 1
            })
        }
    },
    selectItem(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            showQuestionList: true,
            current: index + 1,
        })
    },
    close() {
        this.setData({
            showQuestionList: false
        })
    },
    // 下载江苏答案
    downLoad() {
        wx.showLoading({
            title: '正在下载',
        });
        wx.downloadFile({
            url: this.data.fileUrl,
            success: function(res) {
                console.log(res)
                var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
                wx.openDocument({
                    filePath: Path,
                    success: function(res) {
                        console.log('打开文档成功')
                        wx.hideLoading();
                    }
                })
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/classifie/exam',
            data: {
                'province': app.globalData.province.id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    that.setData({
                        back_image: res.data.list.back_image
                    })
                }
            },
        });
        util.request({
            url: '/api/classifie/exam_topic_jiangsu',
            data: {
                id: options.id
            },
            method: 'post',
            success: (res) => {
                if (res.data.code === 1) {
                    that.setData({
                        fileUrl: res.data.info.file_url
                    })
                }
            },
        });
        let timeCost = that.formatSeconds(options.timeCost);
        let successNum = options.successNum
        let errorNum = options.errorNum
        that.setData({
            list: JSON.parse(options.result),
            timeCost: timeCost,
            successNum: successNum,
            errorNum: errorNum,
            province: app.globalData.province.id
        })
    },
    //时间转换
    formatSeconds(value) {

        var theTime = parseInt(value); // 秒
        var middle = 0; // 分
        var hour = 0; // 小时

        if (theTime > 60) {
            middle = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (middle > 60) {
                hour = parseInt(middle / 60);
                middle = parseInt(middle % 60);
            }
        }
        var result = "" + parseInt(theTime) + "秒";
        if (middle > 0) {
            result = "" + parseInt(middle) + "分" + result;
        }
        if (hour > 0) {
            result = "" + parseInt(hour) + "小时" + result;
        }
        return result;
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

})