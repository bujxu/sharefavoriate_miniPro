var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  bindGetUserInfo: function (res) {
    var that = this;
    if (res.detail.userInfo) {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      // var userInfo = new UserInfo();
      // userInfo.getUserInfo();

      console.log('getUserInfo success', res);
      wx.setStorageSync('userInfo', res.detail.userInfo);
      var baseApiUrl = util.config('baseApiUrl');
      var url = baseApiUrl + "decode/user";
      // util.getDecodeEncryptedData(res.detail.encryptedData, res.detail.iv, url);

      util.ajax({
        "url": url,
        "data": {
          encryptedData: res.detail.encryptedData,
          iv: res.detail.iv
        },
        "method": "POST",
        "header": {
          'content-type': 'application/json',
          'token': wx.getStorageSync('token')
        },
        "success": function (res) {
          console.log('getDecodeEncryptedData success', res);
          wx.navigateBack();
        }
      })

    } else {
      console.log(333, '执行到这里，说明拒绝了授权')
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  }
})