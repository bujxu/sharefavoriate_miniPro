import { Config } from 'config.js';
import { UserInfo } from 'userInfo.js';
import { Share } from 'share.js';
class Token {
  constructor() {
    this.verifyUrl = Config.restUrl + 'token/verify';
    this.tokenUrl = Config.restUrl + 'token/user';
    this.UserInfoUrl = Config.restUrl + 'token/userInfo';
  }

  verify() {
    var token = wx.getStorageSync('token');
    if (!token) {
      this.getTokenFromServer();
    } else {
      this._veirfyFromServer(token);
    }
  }
  //从服务器获取token
  getTokenFromServer() {
    var that = this;
    wx.login({
      success: function (res) {
        console.log("wx.login success", res);
        wx.request({
          url: that.tokenUrl,
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res) {
            console.log("getTokenFromServer success", res);
            wx.setStorageSync('token', res.data.token);
            var userInfo = new UserInfo();
            userInfo.getUserInfo();
          },
          fail:function (res)
          {
            console.log("getTokenFromServer fail", res);
          }
        })
      },
      fail:function(res)
      {
        console.log("wx.login fail", res);
      }
    })
  }

  // 携带令牌去服务器校验令牌
  _veirfyFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl,
      method: 'POST',
      data: {
        token: token
      },
      success: function(res) {
        console.log("_veirfyFromServer success", res);
        var valid = res.data.isValid;
        if (!valid) {
          that.getTokenFromServer();
        }
        else
        {
          // var userInfo = new UserInfo();
          // userInfo.getUserInfo();
          var share = new Share();
          share.getShareInfo();
        }
      },
      fail: function(res)
      {
        console.log("_veirfyFromServer fail", res);
      }
    })
  }
}

export {
  Token
};