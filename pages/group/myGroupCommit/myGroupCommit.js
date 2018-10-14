var util = require('../../../utils/util.js')
Page({
  data: {
    commitList: [],
    groupId: '',
  },
  onLoad: function (options) {
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl');
    this.setData({ groupId: options.groupId })
    this.dataList();
  },
  bindDeleteGood: function (event) {
    var that = this;
    console.log(event);

    var url = this.baseApiUrl + "group/userUploadDel?commitId=" + event.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function (res) {
        if (res.confirm) {
          util.ajax({
            url: url,
            method: "GET",
            success: function (data) {
              that.refresh();
            }
          });
        }
      }
    })
  },
  bindEditGood:function(event)
  {
    wx.navigateTo({
      url: '../myGroupCommitNew/myGroupCommitNew?commitId=' +  event.currentTarget.dataset.id,
    });
  },
  onReady: function () {

    // 页面渲染完成
  },
  onShow: function () {
    this.refresh();
    // 页面显示
  },
  refresh: function () {
    this.dataList();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //监听用户下拉动作
  onPullDownRefresh: function () {
    this.refresh();
    wx.stopPullDownRefresh();
  },
  loadding: function () {

  },
  loaded: function () {

  },

  dataList: function () {
    var url = this.baseApiUrl + "group/groupUserCommit?groupId=" + this.data.groupId;
    var that = this;

    util.ajax({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'token': this.token,
      },
      success: function(res) {
        if (res) {
          that.setData({commitList:res})
        }
        console.log(res)
      },
      fail: function(res) {
        console.log(res);
      }

    });

  },

})