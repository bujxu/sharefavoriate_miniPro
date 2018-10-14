var util = require('../../../utils/util.js')
var col1H = 0;
var col2H = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_id:'',
    groupCommit:[],
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    offset : 0,
    size: 10,
    isEnd:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.group_id != undefined)
    {
      this.data.group_id = options.group_id;
    }

    this.getGroupCommit();
  },
  getMoreCommitCheck()
  {
    if (this.data.isEnd == true)
    {
      wx.showToast({
        title: '已经没有更多提交了',  //标题
        icon: 'none',       //图标 none不使用图标，详情看官方文档
        duration: 2000,
      });
      return false;
    }

    if (this.data.offset != 0 && this.data.images.length !=0)
    {
      wx.showToast({
        title: '还没有加载完，请稍等',  //标题
        icon: 'none',       //图标 none不使用图标，详情看官方文档
        duration: 2000,
      });
      return false;
    }

    return true;
  },
  getGroupCommit()
  {
    if (this.getMoreCommitCheck() == false)
    {
      return ;
    }
    
    var baseApiUrl = util.config('baseApiUrl');
    var url = baseApiUrl + 'group/getGroupCommit?groupId=' + this.data.group_id;
    var that = this;
    var offset = this.data.offset;
    var size = this.data.size;

    util.ajax({
      url: url,
      method: 'GET',
      data: {
        "offset" : offset * size,
        "size" : size,
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
          that.data.offset++;
          var that1 = that;
          var result = res;
          wx.getSystemInfo({
            success: (res) => {
                console.log("getSystemInfo res", res);
                var ww = res.windowWidth;
                var wh = res.windowHeight;
                var imgWidth = ww * 0.48;
                var scrollH = wh;
                that1.setData({
                  scrollH: scrollH,
                  imgWidth: imgWidth
              });
              that1.loadImages(result);
            }
        })
        console.log('index getGroupUsers success', res);
        that.setData({ groupCommit: res });
      },
      fail: function (res) {
        console.log('index getGroups fail', res);
      }
    })
  },

  onImageLoad: function (e) {
    var imageId = e.currentTarget.id;
    console.log('imageId:', imageId);
    var oImgW = e.detail.width;         //图片原始宽度
    var oImgH = e.detail.height;        //图片原始高度
    var imgWidth = this.data.imgWidth;  //图片设置的宽度
    var scale = imgWidth / oImgW;        //比例计算
    var imgHeight = oImgH * scale;      //自适应高度

    var images = this.data.images;
    var imageObj = null;

    imageObj = images[imageId];
    imageObj.height = imgHeight;

    var loadingCount = this.data.loadingCount - 1;
    var col1 = this.data.col1;
    var col2 = this.data.col2;

    if (col1H <= col2H) {
        col1H += imgHeight;
        col1.push(imageObj);
    } else {
        col2H += imgHeight;
        col2.push(imageObj);
    }

    var data = {
        loadingCount: loadingCount,
        col1: col1,
        col2: col2
    };

    if (!loadingCount) {
        data.images = [];
    }

    this.setData(data);
},

loadImages: function (res) {
  var images = [];
  var time = +new Date();
  
  for (var index = 0; index < res.length; index++)
  {
    var temp = {};
    temp['pic'] = res[index]['images'];
    temp['id'] = index;
    temp['commitId'] = res[index]['commitId'];      
    temp['content'] = res[index]['content'];
    temp['time'] = res[index]['time'];
    temp['count'] = res[index]['count'];
    images.push(temp);
  }

  this.setData({
    loadingCount: images.length,
    images: images
  });

  if (images.length < this.data.size)
  {
    this.data.isEnd = true;
  }
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
    col1H = 0;
    col2H = 0;
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