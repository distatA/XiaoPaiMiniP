// packageChoose/page//examination/subject/subject.js
const app = getApp()
const util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        subjectList: [],
        id: 0,
        subjectName: '',
        subjectId:0,
        // 选3的名称id
        selectName:[],
        selectId:[],
        // 选2
        twoName:[],
        twoId:[],
    },
    // 2选1
    itemSelected(e) {
        var that = this;
        let subjectName = e.currentTarget.dataset.name
        let subjectId = e.currentTarget.dataset.id
        that.setData({
            subjectName: subjectName,
            subjectId: subjectId
        })
    },
    // 选2
    selectTwo(e) {
        var that = this;
        let subjectList = that.data.subjectList;
        let list = subjectList[1].choose;
        let twoName = that.data.twoName;
        let twoId = that.data.twoId;
        var index = e.currentTarget.dataset.index;
        list[index].select = !list[index].select;
        if (!list[index].select) {
            twoName.forEach((i, j) => {
                if (list[index].name == i) {
                    twoName.splice(j, 1)
                    twoId.splice(j,1)
                }
            })
            that.setData({
                twoName: twoName,
                twoId: twoId
            })
        } else {
            if (twoName.length >= 2) {
                list[index].select = false;
                wx.showToast({
                    title: '请正确选择科目',
                    icon: 'none'
                })
            } else {
                twoName.push(list[index].name)
                twoId.push(list[index].id)
                that.setData({
                    twoName: twoName,
                    twoId: twoId
                })
            }
        }
        that.setData({
            subjectList: subjectList,
        })
    },
    // 选3
    selectThree(e) {
        var that = this;
        let subjectList = that.data.subjectList
        let list = subjectList[0].choose;
        let selectName = that.data.selectName
        let selectId = that.data.selectId
        var index = e.currentTarget.dataset.index;
        list[index].select = !list[index].select;
        if (!list[index].select) {
            selectName.forEach((i, j) => {
                if (list[index].name == i) {
                    selectName.splice(j, 1)
                    selectId.splice(j,1)
                }
            })
            this.setData({
                selectName: selectName,
                selectId: selectId
            })
        } else {
            if (selectName.length >= 3) {
                list[index].select = false;
                wx.showToast({
                    title: '请正确选择科目',
                    icon: 'none'
                })
            } else {
                selectName.push(list[index].name)
                selectId.push(list[index].id)
                that.setData({
                    selectName: selectName,
                    selectId: selectId
                })
            }
        }
        that.setData({
            subjectList: subjectList
        })
    },
    goMajor(){
        var that = this;
        let twoName=that.data.twoName;
        let twoId=that.data.twoId;
        let subjectName = that.data.subjectName;
        let subjectId = that.data.subjectId;
        let idList = twoId.concat(subjectId)
        let idName = twoName.concat(subjectName)
        let selectName = that.data.selectName;
        let selectId = that.data.selectId;
        if (selectName.length!=0){
            if (selectName.length < 3) {
                wx.showToast({
                    title: '请正确选择科目',
                    icon: 'none'
                })
            } else {
                wx.navigateTo({
                    url: '../probability/probability?selectName=' + selectName + '&selectId=' + selectId
                })
            }
        } else {
            if (idName.length < 3) {
                wx.showToast({
                    title: '请正确选择科目',
                    icon: 'none'
                })
            } else {
                console.log(idName)
                wx.navigateTo({
                    url: '../probability/probability?idName=' + idName + '&idList=' + idList
                })
            }
        }
    
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        util.request({
            url: '/api/entrance/index_subject',
            data: {
                year:app.globalData.exam.year,
                province: app.globalData.exam.province
            },
            method: 'post',
            success(res) {
                if (res.data.code === 1) {
                    let list = res.data.list;
                    that.setData({
                        subjectList: list,
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                    setTimeout(function () {
                        wx.navigateBack({
                            delta: 0
                        })
                    }, 1000);
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
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        util.request({
            url: '/api/index/share',
            data: {
               uid:app.globalData.userInfo.id
            }
        });
    }
})