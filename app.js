var util = require('./utils/util.js')
App({

  onLaunch: function () {
    if (!wx.getStorageSync('token')) { this.login(); }

    console.log("%c  xubuju on Launch", 'color: #1aad19;font-size:20px;');

  },
  onShow: function (options) {
      if (options.scene == 1044) {
        wx.checkSession({
          success: function (res) {
            console.log('share getShareInfo success', res);
            wx.getShareInfo({
              shareTicket: options.shareTicket,
              success: function (res) {
                console.log('wx.getShareInfo success', res);
                var baseApiUrl = util.config('baseApiUrl');
                var url = baseApiUrl + 'decode/share';
                util.getDecodeEncryptedData(res.encryptedData, res.iv, url);
              },
              fail: function (res) {
                console.log('wx.getShareInfo fail', res);
              }
            })
          },
          fail: function (res) {
            console.log('share getShareInfo fail', res);
          }
        })
      }
  },
  onHide: function () { },
  share: function (obj) {
    var token = wx.getStorageSync('token');
    var baseApiUrl = util.config('baseApiUrl');
    var url = baseApiUrl + "?g=Api&m=Weuser&a=share&token=" + token;
    var share_text = util.config('share_text');
    var share_type = '分享给好友';

    return {
      title: obj.title || share_text.title,
      path: obj.path || share_text.path,
      withShareTicket: true,
      success: function (res) {
        if (res.shareTickets != undefined && res.shareTickets.length > 0) share_type = "分享给群聊";

        util.ajax({ url: url, data: { 'share_type': share_type, 'share_status': 1, 'share_url': obj.path || share_text.path }, method: "POST", success: function (e) { } });
      },
      fail: function (res) {
        util.ajax({ url: url, data: { 'share_type': share_type, 'share_status': 0, 'share_url': obj.path || share_text.path }, method: "POST", success: function (e) { } });
      }
    }
  },
  login: function (obj = {}) {
    var baseApiUrl = util.config('baseApiUrl');
    var that = this;
    wx.login({
      success: function (res) {
        console.log("wx.login success", res);
        if (res.code) {
          var url = baseApiUrl + "token/user";
          util.ajax({
            "url": url,
            "method": 　"POST",
            "data":{
              code:res.code
            },
            "success": function (res) {
              console.log("getTokenFromServer success", res);
              var token = res.token;
            
                wx.setStorageSync('token', token);
                
                that.getUserInfo(token);
                if (obj.success != undefined) {
                  obj.success(token);
                }

            },
            "error": function (res) {
              console.log("getTokenFromServer fail", res);
            }
          });
        } else {
          if (obj.error != undefined) { obj.error(); }
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (res) {
        console.log('login fail', res);
      },
      error: function (res) {
        console.log('erro login code', res);
      }
    });
  },

  getUserInfo: function (token) {

    wx.getUserInfo({
      success: function (res) {
        console.log('getUserInfo success', res);
        wx.setStorageSync('userInfo', res.userInfo);
        var baseApiUrl = util.config('baseApiUrl');
        var url = baseApiUrl + "decode/user";
        util.getDecodeEncryptedData(res.encryptedData, res.iv, url);
      },
      fail: function (res) { 
        console.log('getUserInfo fail', res);

      }
    })
  },
})

// import { Token } from 'utils/token.js';

// App({
//   onLaunch: function (options) {
//     wx.setStorageSync('options', options);
//     console.log('App options', options);
//     var token = new Token();
//     token.verify();
//   },
//   onShow(options)
//   {

//   }

// });