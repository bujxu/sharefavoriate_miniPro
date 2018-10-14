var util = require('../../../utils/util.js')
var data = {
  images: []
};

var allImageIdNeedSave = [];

Page({
  data: {
    img_arr: [],
    images: [],
    gallery: [],
    currentImg: 0,
    tempImages: [],
    isSubmitDisable: false,
    submitTimes: 0,
    edit: 'false',
    groupId:'',
    commitId:'',
    commit:[],
    textareaValue:'',
    imagesId:[],
    autoplay:false,
    interval:500,
    canDelete:true,
    swiperCurrent:0,
    progressPercent:0,
    progressDisplay:'none'
  },

  swiperChange: function(e) {
    if (this.data.autoplay == true)
    {
      this.setData({
        autoplay:false,
      })
    }
    if (this.data.currentImg > 0) {
      var tempImage = this.data.img_arr;
      tempImage.splice(this.data.currentImg, 1);
      this.setData({
        img_arr: tempImage,
        currentImg: 0,
      });
    }
    this.setData({
      swiperCurrent: e.detail.current,
      autoplay:false,
    })

    this.data.canDelete = true;
  },
  refresh: function() {

  },
  onPullDownRefresh: function() {

  },
  deleteImage: function(e) {
    if (this.data.canDelete == false)
    {
      return ;
    }
    var tempImage = this.data.img_arr;
    var swiperCurrent = this.data.swiperCurrent;
    if (tempImage.length == (swiperCurrent + 1)) {
      this.data.canDelete = false;
      delete tempImage[swiperCurrent];
      this.setData({
        currentImg: (tempImage.length - 1),
        autoplay:true,
        img_arr: tempImage
      });

      if (this.data.currentImg == 0)
      {
        this.setData({
          img_arr: [],
          autoplay:false,
        });
      }
    } else {
      tempImage.splice(swiperCurrent, 1);
      this.setData({
        img_arr: tempImage
      });
    }
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
  
  onLoad: function(options) {
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl');
    this.data.commitId = options.commitId;
    this.data.groupId = options.groupId;
    if (options.commitId != undefined) {
      this.setData({edit:'true'});
      this.getCommit(this.data.groupId, this.data.commitId);
    }
    else
    {
      this.setData({edit:'false'});
    }
    
    // 页面初始化 options为页面跳转所带来的参数
  },
  getCommit:function(groupId, commitId)
  {
    var url = this.baseApiUrl + "group/getCommit?commitId=" + this.data.commitId;
    var that = this;

    util.ajax({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      success: function(res) {
        if (res) {
          that.setData({textareaValue:res['content'],img_arr:res['images']});
          that.data.imagesId = res['imagesId'];
          that.data.imagesUrl = res['images'];
        }
        console.log(res)
      },
      fail: function(res) {
        console.log(res);
      }

    });
  },
  sendImages: function() {
    var url = this.baseApiUrl + "group/userUploadSingle";
    this.data.tempImages = [];
    allImageIdNeedSave = [];
    for (var i = 0; i < this.data.img_arr.length; i++) {
      if (this.data.img_arr[i].indexOf("upload") == -1) { 
        this.data.tempImages.push(this.data.img_arr[i]);//没有上传过的个数
      }
      else
      {
        for (var index = 0; index < this.data.imagesUrl.length; index++)
        {
          if (this.data.img_arr[i] == this.data.imagesUrl[index])
          {
            allImageIdNeedSave.push(this.data.imagesId[index]);//imags_temp 里是这次提交的所有 imageId 的数组
            break;
          }
        }
      }
    }

    if (this.data.tempImages.length != 0)
    {
      this.setData({
        progressDisplay:'flex',
        progressPercent:0  
      });
    }

    if (0 == this.data.tempImages.length) {
      this.userUploadModify();
    } else {
      this.upload(0, this.data.tempImages.length, url);
    }
  },
  userUploadModify: function () {
    var that = this;
    var url = that.baseApiUrl + "group/userUploadModify?commitId=" + this.data.commitId;
    // for (var i = 0; i < that.data.img_arr.length; i++) {
    //   if (that.data.img_arr[i].indexOf("upload") != -1) {
    //     allImageIdNeedSave.push(that.data.img_arr[i]);
    //   }
    // }
    //imags_tem 是呈现的image的Id 用于后面差集删除

    wx.request({
      url: url,
      method: 'POST',
      data: {commitId:this.data.commitId, images:JSON.stringify(allImageIdNeedSave), content:this.data.textareaValue},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res) {
          wx.showToast({
            title: '已提交发布！',
            duration: 3000
          });
        }
        console.log(res);
        wx.navigateBack();
      },
      fail: function (res) {
        console.log(res);
        that.data.isSubmitDisable = true;
      }
    });
  },
  userUploadAdd: function() {
    var url = this.baseApiUrl + "group/userUploadAdd";
    var that = this;
    var images =  JSON.stringify(allImageIdNeedSave);

    util.ajax({
      url: url,
      method: 'POST',
      data: {images:images, groupId:this.data.groupId, content:this.data.textareaValue},
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'token': this.token,
      },
      success: function(res) {
        if (res) {
          if (that.data.submitTimes == 0) {
            wx.showToast({
              title: '已提交发布！',
              icon: 'none',
              duration: 3000
            });
            wx.navigateBack();
          }
        }
        console.log(res)
      },
      fail: function(res) {
        console.log(res);
        that.data.isSubmitDisable = true;
      }

    });
  },
  upload: function(index, uploadCount, url) {
    var that = this;
    var filePath = this.data.tempImages[index];

    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'file',
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        if (res.data != "") {
          var data = JSON.parse(res.data);
          allImageIdNeedSave.push(data["image_id"]);
        }
        console.log(res)
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        index++;
        that.setData({
          progressPercent:index/that.data.tempImages.length * 100
        });
        if (index < uploadCount) {
          var url = that.baseApiUrl + "group/userUploadSingle";
          that.upload(index, uploadCount, url);
        } else if (index == uploadCount) {
          that.setData({
            progressDisplay:'none'
          });
          if (that.data.edit == 'false') {
            that.userUploadAdd();
          } else {
            that.userUploadModify();
          }
          data.images = [];
          allImageIdNeedSave = [];
        }
      }
    });

  },
  formSubmit: function(e) {
    if (this.data.isSubmitDisable == true) {
      wx.showToast({
        title: '已提交,请稍等！',
        icon: 'none',
        duration: 3000
      });
      return ;
    }

    if (e.detail.value.textarea == "") {
      wx.showToast({
        title: '请填写描述信息',
        icon: 'none',
        duration: 3000
      });
      return;
    }

    if (this.data.img_arr.length == 0) {
      wx.showToast({
        title: '请填写信息',
        icon: 'none',
        duration: 3000
      });
      return;
    }

    this.data.textareaValue = e.detail.value.textareaValue;
    this.setData({
      isSubmitDisable: true
    });

    this.sendImages(data);
  },
  upimg: function() {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      success: function(res) {
        for (var index = 0; index < res.tempFiles.length; index++) {
          if (res.tempFiles[index].size >= 2000000) {
            wx.showToast({
              title: '上传图片不能大于2M!: 第' + (index + 1) + '张',
              icon: 'none',
              duration: 3000,
            });
            return;
          }
        }
        that.setData({
          img_arr: that.data.img_arr.concat(res.tempFilePaths)
        })
      }
    });
  },

});