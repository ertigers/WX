import CircleApi from '../../../api/circle'
import Storage, { STORAGE_KEY } from '../../../utils/storage'

Page({
  data: {
    userInfo: {},
    active: 0,
    myCircle: {},
    circleList: []
  },
  onLoad: function () {
    // 获取用户信息
    const userInfo = Storage.get(STORAGE_KEY.USER_INFO)
    if (userInfo) {
      this.setData({ userInfo })
    }

    console.log(CircleApi);
    
    this.fetchMyCircle()
    this.fetchCircle()
  },
  onChange(event) {
    console.log(event.detail.index);
    this.setData({
      active: event.detail.index
    })
  },
  // 查询我的圈子
  async fetchMyCircle() {
    const res = await CircleApi.getMyCircles(this.data.userInfo.id)
    this.setData({
      circleList: res.objects
    })
  },
  // 查询全部圈子
  async fetchCircle() {
    const res = await CircleApi.getList({
      limit: 20,
      offset: 0,
      orderBy: ['created_at']
    })
    this.setData({
      circleList: res.objects
    })
  }
})
