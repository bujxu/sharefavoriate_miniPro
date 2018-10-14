var util = require('../../../utils/util.js')
var col1H = 0;
var col2H = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commitId: '',
    groupCommit: [],
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    col:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.commitId != undefined) {
      this.data.commitId = options.commitId;
    }

    this.getCommit();
  },
  getCommit() {
    var baseApiUrl = util.config('baseApiUrl');
    var url = baseApiUrl + 'group/getCommit?commitId=' + this.data.commitId;
    var that = this;

    util.ajax({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
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

  previewImage:function(e)
  {
    var col1 = this.data.col1;
    var col2 = this.data.col2;
    var preImages = [];
    var current = 0;

    if (e.currentTarget.dataset.index1 != undefined)
    {
      current = e.currentTarget.dataset.index1;
    }
    else
    {
      current = e.currentTarget.dataset.index2 + col1.length;
    }

    for (var index = 0; index < col1.length; index++)
    {
      preImages.push(col1[index].pic)
    }

    for (var index = 0; index < col2.length; index++)
    {
      preImages.push(col2[index].pic);
    }

    wx.previewImage({
      current: preImages[current], // 当前显示图片的http链接
      urls: preImages // 需要预览的图片http链接列表
    })
  },
  
  onImageLoad: function (e) {
    var imageId = e.currentTarget.id;
    var oImgW = e.detail.width;         //图片原始宽度
    var oImgH = e.detail.height;        //图片原始高度
    var imgWidth = this.data.imgWidth;  //图片设置的宽度
    var scale = imgWidth / oImgW;        //比例计算
    var imgHeight = oImgH * scale;      //自适应高度

    var images = this.data.images;
    var imageObj = null;

    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

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

    for (var index = 0; index < res['images'].length; index++) {
      var temp = { pic: '', height: 0 };
      temp['pic'] = res['images'][index];
      images.push(temp);
    }

    var baseId = "img-" + (+new Date());
    for (var i = 0; i < images.length; i++) {
      images[i].id = baseId + "-" + i;
    }

    this.setData({
      loadingCount: images.length,
      images: images
    });
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