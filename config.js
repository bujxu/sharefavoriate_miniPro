/**
 *  baseApiUrl 必须配置
 *  share_text 可选配置
 *  web        可选配置
 *  appDebug   可选配置
 *  ...        可选配置
 */
var Config = {
  //默认分享文字
  'share_text': {
    'title': 'xubuju 个人小程序',
    'path': 　'pages/homePage/homePage'
  },
  "restUrl": 'https://share.bujxu.com/sharefavorite/public/index.php/api/v1/',
  //接口 基础 url http://localhost/weipin-admin/   http://118.31.0.172/weipin/
  "baseApiUrl": "https://share.bujxu.com/sharefavorite/public/index.php/api/v1/",
  //"baseApiUrl": "http://localhost/sharefavorite/public/index.php/api/v1/",
  //网站配置
  "web": {
    "url": "https://www.bujxu.com/",
    //  "url": "http://localhost/weipin-admin/",
    "name": "微拼",
  },
  //是否开启测试
  "appDebug": false,

  //错误信息
  "error_text": {
    0: "服务器可能中暑了，请稍后再试",
    1: "您还没有填写收货信息哦~",
    2: "Oops! 这个团已经不在地球上了，快去首页火拼吧！",
    3: "您还没有参加过任何团哦，赶快去首页火拼吧！",
    4: "商品已下架或不存在，赶快去首页看看吧！",
    5: "您的地址信息不完整，请先完善地址信息吧~",
    6: "订单信息错误~",
    7: "暂时没有物流信息",
    8: "获取快递信息失败, 请稍后再试",
    9: "获取订单失败，请稍后再试！",
    10: "您还没有优惠券哦~",
    11: "您还没有填写联系人信息哦~~"
  },

  //订单状态
  "order_status": {
    0: "待支付",
    1: "待发货",
    2: "已发货",
    3: "删除",
    4: "取消",
    5: "交易已取消",
    6: "未发货退款处理中",
    7: "未发货退款成功",
    8: "已发货退款处理中",
    9: "已发货退款成功"
  },

  "page_offset": 0,

  "page_size": 20,

  //默认用户信息
  "userInfo": {
    "nickName": "游客",
    "avatarUrl": 　""
  },

  //页面加载提示信息
  pullload_text: {
    load_text: "正在玩命的加载...",
    no_orders: "没有更多的订单了...",
    no_tuan_orders: "没有更多的团订单了...",
    no_goods: "没有更多了..."
  },
  pullload_last_text: {
    bottom_text: "↑ 继续向上滑将切换到下一个频道",
    bottom_text_ready_to_next_channel: "↓ 松开按键切换到下一个频道",
    change_channel_tip: "正在加载下一个频道"
  },
  pay_text: {
    success: "支付成功",
    fail: "支付失败",
    cancel: "支付取消"
  },
};

function config() {
  return Config;
}
module.exports = {
  config: config
}



// class Config {
//   constructor() {

//   }
// }



// //Config.restUrl = 'https://share.bujxu.com/sharefavorite/public/index.php/api/v1/';

// Config.restUrl = 'http://localhost/sharefavorite/public/index.php/api/v1/';
// export { Config };