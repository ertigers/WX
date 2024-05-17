Page({
  data: {
    option: [],
    value: '',

    active: 0,
    currentFightList: []
  },
  onLoad: function () {
    // this.fetchCircle()
  },
  fetchCircle() {
    // 应用查询对象
    let Product = new wx.BaaS.TableObject('badminton_group')
    // 不设置查询条件
    Product.find().then(res => {
      // success
      console.log(res);

      let option = res.data.objects.map(item =>{
        return {
          text: item.name,
          value: item.id
        }
      })

      this.setData({
        option,
        value: option[0] ? option[0].value : ''
      })
    }, err => {
      // err
    })
  },

  onChange(event) {
    console.log(event.detail.index);
    this.setData({
      active: event.detail.index
    })
  },
})
