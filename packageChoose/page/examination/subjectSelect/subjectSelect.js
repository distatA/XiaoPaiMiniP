   // packageChoose/page//examination/subjectSelect/subjectSelect.js
   const app = getApp()
   const util = require('../../../../utils/util.js');
   Page({

       /**
        * 页面的初始数据
        */
       data: {
           subjectsName: [],
           subject: [],
           order: true,
           sortNum: 1,
           page: 1,
           number:0
       },
       sort() {
           var that = this;
           that.setData({
               order: !that.data.order
           })
           if (that.data.order) {
               util.request({
                   url: '/api/entrance/career_list',
                   data: {
                       year: app.globalData.exam.year,
                       province: app.globalData.exam.province,
                       choosen_subjects: that.data.subjectsName,
                       desc: 1,
                   },
                   method: 'post',
                   success(res) {
                       if (res.data.code === 1) {
                           that.setData({
                               subject: res.data.list,
                               sortNum: 1,
                               page: 1,
                           })
                       }
                   }
               })
           } else {
               util.request({
                   url: '/api/entrance/career_list',
                   data: {
                       year: app.globalData.exam.year,
                       province: app.globalData.exam.province,
                       choosen_subjects: that.data.subjectsName,
                       desc: 0,
                   },
                   method: 'post',
                   success(res) {
                       if (res.data.code === 1) {
                           that.setData({
                               subject: res.data.list,
                               sortNum: 0,
                               page: 1
                           })
                       }
                   }
               })
           }
       },
       goMajor(e) {
           let name = e.currentTarget.dataset.name;
           let probability = e.currentTarget.dataset.probability;
           let code = e.currentTarget.dataset.code;
           let school = e.currentTarget.dataset.school;
           wx.navigateTo({
               url: '../major/major?name=' + name + '&subjectsName=' + this.data.subjectsName + '&code=' + code + '&probability=' + probability + '&school=' + school,
           })
       },
       /**
        * 生命周期函数--监听页面加载
        */
       onLoad: function(options) {
           var that = this;
           util.request({
               url: '/api/entrance/career_list',
               data: {
                   year: app.globalData.exam.year,
                   province: app.globalData.exam.province,
                   choosen_subjects: options.subjectsName.split(","),
                   desc: 1,
               },
               method: 'post',
               success(res) {
                   if (res.data.code === 1) {
                       that.setData({
                           subject: res.data.list,
                           subjectsName: options.subjectsName.split(","),
                           number: res.data.all_num
                       })
                   } else if (res.data.code === 0) {
                       wx.showToast({
                           title: res.data.msg,
                           icon: 'none'
                       })
                       setTimeout(function() {
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
           var that = this;
           var page = that.data.page + 1
           util.request({
               url: '/api/entrance/career_list',
               data: {
                   year: app.globalData.exam.year,
                   province: app.globalData.exam.province,
                   choosen_subjects: that.data.subjectsName,
                   desc: that.data.sortNum,
                   page: page
               },
               method: 'post',
               success(res) {
                   if (res.data.code === 1) {
                       if (that.data.subject.length < res.data.all_num) {
                           let subject = that.data.subject.concat(res.data.list)
                           that.setData({
                               subject: subject,
                               page: page
                           })
                           wx.showToast({
                               title: '加载中',
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
   })