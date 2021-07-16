const app = getApp();
const util = require('../../../utils/util.js');
const util_live = require('../../../utils/util_live.js');
const util_new = require('../../../utils/utils_old_live.js')

const count = require('../../../utils/count.js');
Page({
    data: {
        showMoney: false, //红包弹窗
        showMasks: false, //领取口罩活动
        showMasks_active:false,//活动页
        row: 4,
        menuWidth: "150rpx",
        showLogin: false,
        banner: [], //首页banner图
        searchSchoolList: [], //搜索时学校的列表
        noticeList: [], //公告新闻数据
        newsList: [], //新闻数据
        page: 1, //加载首页新闻分页
        color: [],
        autoplay: true,
        menuList: [],
        scrollMenu: [{
            ename: 'New college entrance exam',
            login: 1,
            name: '新高考',
            url: '../../../packageChoose/page/examination/formulate/formulate',
            logo: 'https://new.schoolpi.net/attach/small_program/index/cate_ten.jpg'
        }, {
            ename: 'Famous teacher\'s course',
            login: 1,
            name: '名师课堂',
            url: '../../../packageChoose/page/famousteach/course/course',
            logo: 'https://new.schoolpi.net/attach/small_program/index/cate_eleven.jpg'
        }, {
            ename: 'Study abroad center',
            login: 0,
            name: '留学中心',
            url: '../../../packageChoose/page/international/index/index',
            logo: 'https://new.schoolpi.net/attach/small_program/index/cate_twelve.jpg'
        }],
      noticeListbanner:[ ],
        province: '安徽省',
        index: 0,
    },
    //信息流滚动
    onLoad: function(option) {
        var that = this;
        wx.getLocation({
            success: function(res) {
                let longitude = res.longitude;
                let latitude = res.latitude;
                util.request({
                    url: '/api/login/prefecture',
                    data: {
                        longitude: longitude,
                        latitude: latitude
                    },
                    success: function(res) {
                        app.globalData.province = res.data.list;
                        that.setData({
                            province: app.globalData.province.province
                        })
                    },
                })
            },
            fail(res) {}
        })
      this.bannerList()
    },
    // 加载栏目
    menuList() {
        var that = this;
        util.request({
            url: '/api/index/wx_column',
            data: {
                province: app.globalData.province.id
            },
            success: function(res) {
                if (res.data.code === 1) {
                    if (res.data.list.length === 5) {
                        that.setData({
                            menuWidth: "119rpx",
                            row: 5
                        })
                    }
                  console.log(res.data.list)
                    that.setData({
                        menuList: res.data.list,
                    });
                }
            }
        })
    },
    //加载首页广告banner
    loadBanner() {
        var that = this;
        util.request({
            url: '/api/ad/rotation_index',
            data: {
                province: app.globalData.province.id
            },
            success: function(res) {
                if (res.data.code === 1) {
                    that.setData({
                        banner: res.data.banlist,
                    });
                }
                //头部导航初始颜色
                let colorList = [];
                res.data.banlist.forEach((item, index) => {
                    colorList.push(item.color);
                    if (index === 0) {
                        wx.setNavigationBarColor({
                            frontColor: '#ffffff',
                            backgroundColor: item.color
                        })
                    }
                })
                that.setData({
                    color: colorList,
                    index: 0,
                    autoplay: true,
                })
            },
        })
    },
    // 广告页跳转
    goAd(e) {
        let media = e.currentTarget.dataset.media;
        let link = e.currentTarget.dataset.link;
        let id = e.currentTarget.dataset.id;
        let schoolId = e.currentTarget.dataset.schoolid;
        let appid = e.currentTarget.dataset.appid;
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 1,
            objectId: id,
            schoolId: schoolId
        })
        if (media == 0) {
            return;
        } else if (media == 1) {
            wx.navigateTo({
                url: link,
            })
        } else if (media == 4) {
            wx.navigateTo({
                url: "/pages/webview/index?url=" + link,
            })
        } else if (media == 3) {
            wx.navigateToMiniProgram({
                appId: appid
            })
        }
    },
    // 活动页点击跳转
    goTo(e){
      let that= this
      if (app.globalData.userInfo.id != 0) { //有没有登录 已经登录
          let textname = e.currentTarget.dataset.itemname;
          let datetotal = e.currentTarget.dataset.totaldate
          let link_url = datetotal.link_url
         
          wx.navigateTo({
            url: '../../../packageChoose/page/webview_active/webview_active?textname=' + textname + "&link_url=" + encodeURIComponent(link_url) // 表示是从bannn进去的。
          })
      } else { //没有登录
        that.setData({
          showLogin: true
        })
      }
    },


    
    bannerList:function(){
      let that = this
      util_new.request_new({
        url: '/live/banner',
        success: function (res) {
          let code = res.data.code
          if (code == 1) {
            if (res.data.list.length != 0) {
              that.setData({
                noticeListbanner: res.data.list
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    //3.0加载新闻列表
    loadNews() {
        var that = this;
        util.request({
            url: '/api/index/index',
            data: {
                province: app.globalData.province.id,
                page: that.data.page
            },
            success: function(res) {
                if (res.data.code === 1) {
                  console.log(res)
                    that.setData({
                        noticeList: res.data.topnewslist,
                        newsList: res.data.indexlist,
                        informationIndex:0
                    });
                }

            },
        })
    },
    //动态改变头部导航颜色。
    transition(event) {
        var colorList = this.data.color;
        let index = event.detail.current;
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: colorList[index]
        })
    },
    //搜索
    formSubmit: function(e) {
        var name = e.detail.value.name;
        wx.navigateTo({
            url: '../school/screen/screen?name=' + name + "&province=" + app.globalData.province.id,
        })
    },
    onShow: function() {
        var that = this;
        that.loadBanner();
        that.menuList();
        that.loadNews();
        that.setData({
            province: app.globalData.province.province,
            autoplay: true,
        })
        if (app.globalData.isLogin) {
            that.setData({
                showLogin: false
            })
        }
        // 红包是否弹出
        util.request({
            url: '/api/index/popup',
            data: {
                uid: app.globalData.userInfo.id,
            },
            success: function(res) {
                if (res.data.code === 1) {
                    that.setData({
                        showMoney: true,
                    });
                } else {
                    that.setData({
                        showMoney: false,
                    });
                }
            },
        })
        // 口罩活动弹窗
        util.request({
            url: '/api/index/draw_wx',
            data: {
                uid: app.globalData.userInfo.id
            },
            success: function(res) {
                if (res.data.code == 1) {
                    that.setData({
                        showMasks: true,
                    });
                } else {
                    that.setData({
                        showMasks: false,
                    });
                }
            },
        })
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 0,
            objectId: 1
        })
    },
    // 视频新闻
    goVedio(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../video/video?id=' + id,
        })
    },
    // 普通新闻
    goNews(e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../../../packageChoose/page/indexNews/indexNews?id=' + id,
        })
    },
    // 信息流
    goInformation(e) {
        let type = e.currentTarget.dataset.type;
        let link = e.currentTarget.dataset.link;
        let vurl = e.currentTarget.dataset.vurl
        let id = e.currentTarget.dataset.id;
        let schoolId = e.currentTarget.dataset.schoolid;
        count.calEnterTime(); //统计埋点-记录进入时间
        count.statistics({
            objectType: 1,
            objectId: id,
            schoolId: schoolId
        })
        if (type == 2) {
            wx.navigateTo({
                url: link,
            })
        } else if (type == 4) {
            wx.navigateTo({
                url: "/pages/webview/index?id=" + id,
            })
        } else {
            return;
        }
    },
    // // 早班车
    // goEarly(e) {
    //     var id = e.currentTarget.dataset.id
    //     wx.navigateTo({
    //         url: '../../../packageChoose/page/early/index?id=' + id,
    //     })
    // },
    onHide() {
        count.calLeaveTime(); //统计埋点-记录离开时间
        count.statistics({
            objectType: 0,
            objectId: 1
        })
        this.setData({
            color: "#22d8d9",
            autoplay: false
        })
    },
    onReachBottom() {
        var that = this;
        let page = that.data.page + 1;
        wx.showLoading({
            title: '加载中',
        })
        util.request({
            url: '/api/index/index',
            data: {
                province: app.globalData.province.id,
                page: page
            },
            success(res) {
                if (res.data.code == 1) {
                    if (that.data.newsList.length < res.data.all_num) {
                        var newsList = that.data.newsList.concat(res.data.indexlist)
                        that.setData({
                            newsList: newsList,
                            page: page
                        })
                        wx.hideLoading()
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
    // 下拉刷新
    onPullDownRefresh(event) {
        var that = this;
        util.request({
            url: '/api/index/index',
            data: {
                province: app.globalData.province.id,
                page: 1
            },
            success: function(res) {
                if (res.data.code === 1) {
                    that.setData({
                        noticeList: res.data.topnewslist,
                        newsList: res.data.indexlist,
                        page:1
                    });
                }
                wx.stopPullDownRefresh();
            },
        })
        util.request({
            url: '/api/ad/rotation_index',
            data: {
                province: app.globalData.province.id
            },
            success: function(res) {
                if (res.data.code === 1) {
                    that.setData({
                        banner: res.data.banlist,
                    });
                }
                //头部导航初始颜色
                let colorList = [];
                res.data.banlist.forEach((item, index) => {
                    colorList.push(item.color);
                    if (index === 0) {
                        wx.setNavigationBarColor({
                            frontColor: '#ffffff',
                            backgroundColor: item.color
                        })
                    }
                })
                that.setData({
                    color: colorList,
                    index: 0,
                })
                wx.stopPullDownRefresh();
            },
        })

    },
    onShareAppMessage: function() {
        util.request({
            url: '/api/index/share',
            data: {
                uid: app.globalData.userInfo.id
            }
        });

    },
    isLogin(e) {
        var that = this;
        var url = e.currentTarget.dataset.url;
        var login = e.currentTarget.dataset.login;
        var type = e.currentTarget.dataset.type;
       var name = e.currentTarget.dataset.name;
      //   console.log(type)
      // console.log(url)
      //不要忘了吧type 改为1 搞招直播的

        // if (type == 2) {//直播
        //     // wx.navigateToMiniProgram({
        //     //     appId: 'wxaead703d24b93901',
        //     //     success(res) {
        //     //     },
        //     //     fail(res) {
        //     //     }
        //     // })
        // } else {
            // if (login == 1) {//需要登录
                if (app.globalData.userInfo.id != 0) { //有没有登录 已经登录
                  // wx.navigateTo({
                  //   url: url,
                  // })
                  if (name=="高招直播"){
                      // let id = app.globalData.userInfo.id
                      // let mobile = app.globalData.userInfo.mobile
                      // util_live.request_post({
                      //   url: '/login',
                      //   data:{
                      //     id: id,
                      //     mobile: mobile
                      //   },
                      //   success: function (res) {
                      //     console.log(res)
                      //   let code = res.data.code
                      //     if (code==200){
                      //       app.globalData.liveToken = res.data.data.token
                            wx.navigateTo({
                              url: '../../../packageChoose/page/newlive/index',
                            })
                      //     }else{
                      //       wx.showToast({
                      //         title: '直播授权失败，请稍后重试'
                      //       })
                      //     }
                      //   }
                      // })
                    }else{
                      wx.navigateTo({
                        url: url,
                      })
                    }
                } else { //没有登录
                    that.setData({
                        showLogin: true
                    })
                }
            // } else { //不需要登录
            //     wx.navigateTo({
            //         url: url,
            //     })
            // }
        // }
    },
    // 红包弹窗跳转
    closeLive() {
        this.setData({
            showMoney: false
        })
    },
    goLive() {
        var that = this;
        if (app.globalData.userInfo.id != 0) {
            wx.navigateToMiniProgram({
                appId: 'wxaead703d24b93901',
                // path: url,
                success(res) {
                    util.request({
                        url: '/api/index/send_redbag',
                        data: {
                            uid: app.globalData.userInfo.id,
                        },
                        success: function(res) {
                            if (res.data.code === 1) {
                                that.setData({
                                    showMoney: false,
                                });
                            }
                        },
                    })
                },
                fail(res) {
                    that.setData({
                        showMoney: true,
                    })
                }
            })
        } else {
            that.setData({
                showLogin: true
            })
        }
    },
    // 口罩活动
    closeLottery() {
        this.setData({
            showMasks: false
        })
    },
    goLottery() {
        var that = this;
        wx.navigateTo({
            url: '../../lottery/lottery'
        })
        that.setData({
            showMasks: false
        })

    },

  
  toActive(){
    wx.setStorage({
        key: 'link_url',
       data: "https://zbh5.schoolpi.net/index.html?textname=zixunhui",
      })
     wx.navigateTo({
        url: '../../../packageChoose/page/webview_active/webview_active?textname=' + "zixunhui" // 表示是从bannn进去的。
      })
    this.setData({
      showMasks_active: false
    })

  },
  close_acvite(){
      this.setData({
        showMasks_active:false
      })
  }
});