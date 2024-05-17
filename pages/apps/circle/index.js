Page({
  data: {
    active: 0,
    circleList:[]
  },
  onLoad: function () {
    this.fetchCircle()
  },
  onChange(event) {
    console.log(event.detail.index);
    this.setData({
      active: event.detail.index
    })
  },
  fetchCircle() {
    // 应用查询对象
    let Product = new wx.BaaS.TableObject('badminton_group')
    // 不设置查询条件
    Product.find().then(res => {
      // success
      console.log(res);
      this.setData({
        circleList: res.data.objects
      })
    }, err => {
      // err
    })
  }

})
