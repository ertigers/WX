// pages/apps/event-history/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchEvent()
  },
  fetchEvent() {
    // 应用查询对象
    let Event = new wx.BaaS.TableObject('badminton_event')
    let UserTableObject = new wx.BaaS.TableObject('_userprofile')

    let query = new wx.BaaS.Query()
    query.compare('status', '=',  3)

    // 不设置查询条件
    Event.expand('group_id').setQuery(query).find().then( async res => {
      // success
      for (const row of res.data.objects) {
        let user_ids = row.active_user_id.split(',')
        let user_names = ''
        for (const user_id of user_ids) {
          let rv = await UserTableObject.get(user_id)
          let user_name = rv.data.nickname
          user_names = ',' + user_name
        }
        row.user_names = user_names
      }
      this.setData({
        eventList: res.data.objects
      })
    }, err => {
      // err
    })
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