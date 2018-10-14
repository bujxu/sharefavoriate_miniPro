import { Config } from 'config.js';
import { Token } from 'token.js';

class Share {
  constructor() {
    this.shareUrl = Config.restUrl + 'decode/share';
  }

  getShareInfo() {
    var options = wx.getStorageSync('options');
    if (options.scene == 1044) {
      wx.checkSession({
        success: function (res) {
          console.log('share getShareInfo success', res);
          wx.getShareInfo({
            shareTicket: options.shareTicket,
            success: function (res) {
              console.log('wx.getShareInfo success', res);
              var share = new Share();
              share.getDecodeEncryptedData(res.encryptedData, res.iv);
            },
            fail: function (res) {
              console.log('wx.getShareInfo fail', res);
            }
          })
        },
        fail: function (res) {
          console.log('share getShareInfo fail', res);
          var token = new Token();
          token.getTokenFromServer();
        }
      })
    }
  }
  
  //从服务器获取token
  getDecodeEncryptedData(encryptedData, iv) {
    var token = wx.getStorageSync('token');
    wx.request({
      url: this.shareUrl,
      method: 'POST',
      data: {
        encryptedData: encryptedData,
        iv: iv
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log('share getDecodeEncryptedData success', res);
        wx.setStorageSync('openGId', res.data.openGId);
      },
      fail: function (res)
      {
        console.log('share getDecodeEncryptedData fail', res);
        that.setData({
          openGId: 'xubuju'
        })
      }
    })
  }
}



export { Share };