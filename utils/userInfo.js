import {
  Config
} from 'config.js';
import {
  Share
} from 'share.js';

class UserInfo {
  constructor() {
    this.UserInfoUrl = Config.restUrl + 'decode/user';
  }

  getUserInfo() {
    var that = this;
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    wx.getUserInfo({
      success: function(res) {
        console.log("wx.getUserInfo success", res);
        that.getDecodeEncryptedData(res.encryptedData, res.iv)
      },
      fail: function(res) {
        console.log("getUserInfo fail", res);
        wx.showModal({
          title: '警告',
          content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: '../../pages/getUserInfo/getUserInfo',
              })
            }
          }
        })
      }
    })
  }

  //从服务器获取token
  getDecodeEncryptedData(encryptedData, iv) {
    var token = wx.getStorageSync('token');
    wx.request({
      url: this.UserInfoUrl,
      method: 'POST',
      data: {
        encryptedData: encryptedData,
        iv: iv
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function(res) {
        console.log('getDecodeEncryptedData success', res);
        var share = new Share();
        share.getShareInfo();
      },
      fail: function(res) {
        console.log('getDecodeEncryptedData fail', res);
      }
    })
  }

}

export {
  UserInfo
};