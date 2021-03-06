//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.checkSession({
      success: function (a) {
        //session 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        //登录态过期 重新登录
        wx.login({
          success: function (body) {
            if (body.code) {
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session'
                + '?appid=wx35cf5d6b4146b9cf&'
                + 'secret=13df11be71d7c686adaa093c33fef3ba&'
                + 'js_code=' + body.code
                + '&grant_type=authorization_code',
                data: {
                },
                success: function (body) {
                  wx.getUserInfo({
                    success: function (res) {
                      wx.setStorageSync('userInfo', res.userInfo)
                      var data = {
                        'iv': res.iv,//wx.getUserInfo接口返回那里的iv
                        'rawData': res.rawData, //wx.getUserInfo接口返回那里的iv
                        'signature': res.signature,// wx.getUserInfo接口返回那里的signature
                        'encryptedData': res.encryptedData,  //wx.getUserInfo接口返回那里的encryptedData
                        'session_key': body.data.session_key //wx.login接口下面 “code 换取 session_key” 获得
                      }

                      that.getLoginData(data, function (res2) {
                        wx.setStorageSync('token', res2.data.token)
                        wx.setStorageSync('loginSuccessData', res2.data)
                      })
                    }
                  })
                }
              })
            } else {
              console.log('登录失败')
            }
          }
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  },
  getLoginData: function (data, callback) {
    var url = 'http://api.91ygj.net/vCard/VCardUser/Login'
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        callback(res.data)
      },
      fail: function (res) {
        console.log('请求出错')
      }
    })
  },
  getData: function (data, callback) {
    var url = 'http://api.91ygj.net/vCard/' + data
    var token = wx.getStorageSync('token')
    wx.request({
      url: url,
      data: {},
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      success: function (res) {
        callback(res.data)
      },
      fail: function (res) {
        console.log('请求出错')
      }
    })
  },
  postData: function (data, callback) {
    var url = 'http://api.91ygj.net/vCard/' + data.url
    var token = wx.getStorageSync('token')
    wx.request({
      url: url,
      method: 'POST',
      data: data.data,
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      success: function (res) {
        callback(res.data)
      },
      fail: function (res) {
        console.log('请求出错')
      }
    })
  },
})