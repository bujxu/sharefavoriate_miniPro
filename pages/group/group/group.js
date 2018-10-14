var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo:[],
  },

  onLoad: function (option) {    
    // this._loadData();
    this.getGroups();
     wx.showShareMenu({ withShareTicket: true });
  },

  refresh: function () {
    this.getGroups();
  },
  onPullDownRefresh: function () {
    this.refresh();

  },
  getGroups:function()
  {
    var baseApiUrl = util.config('baseApiUrl');
    var url = baseApiUrl + 'decode/getGroups';
    var that = this;
    util.ajax({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log('index getGroups success', res);
        that.setData({ groupInfo:res});
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log('index getGroups fail', res);
        wx.stopPullDownRefresh();
      }
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
    }
  },
  onProductsItemTap:function(e)
  {
    console.log(e);

    var groupId = e.currentTarget.dataset.id;
    if (this.data.groupInfo[e.currentTarget.dataset.index]['image'] == null)
    {
      wx.navigateTo({
        url: '../myGroupCommit/myGroupCommit?groupId=' + groupId
      });
    }
    else
    {
      wx.navigateTo({
        url: '../groupDetail/groupDetail?group_id=' + groupId
      });
    }

  },
  _loadData: function () {

  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    else
    {
      console.log(res);
    }
    var that = this;
    return {
      title: '群图片分享',
      path: 'pages/index/index',
      imageUrl: "../../default/img/shareImg.png",
      success:(res) =>
      {
        console.log('转发成功', res);
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log(res);
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            var baseApiUrl = util.config('baseApiUrl');
            var url = baseApiUrl + 'decode/share';
            util.getDecodeEncryptedData(encryptedData, iv, url);
            // that.setData({
            //   openGId: wx.getStorageSync('openGId')
            // });
            console.log(that);
          }
        })

      },
      fail:(res)=> 
      {
        console.log('转发失败', res);
      }
    }
  },
  onShow(e) {
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo == '')
    {
      wx.navigateTo({
        url: '../getUserInfo/getUserInfo',
      });
      this.refresh();
    }
  },

})