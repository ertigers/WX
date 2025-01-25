import { request, TABLE_ID } from '../utils/request'

/**
 * 圈子相关接口
 */
class CircleApi {
  /**
   * 获取圈子列表
   * @param {Object} params 查询参数
   * @param {Number} params.limit 每页数量
   * @param {Number} params.offset 偏移量
   * @param {Array} params.orderBy 排序字段
   */
  static async getList(params = {}) {
    return request
      .table(TABLE_ID.BADMINTON_GROUP)
      .find(params)
  }

  /**
   * 获取我的圈子列表
   * @param {String} userId 用户ID
   */
  static async getMyCircles(userId) {
    return request
      .table(TABLE_ID.BADMINTON_GROUP)
      .where({
        'created_by': ['=', userId]
      })
      .find()
  }

  /**
   * 获取圈子详情
   * @param {String} id 圈子ID
   */
  static async getDetail(id) {
    return request
      .table(TABLE_ID.BADMINTON_GROUP)
      .get(id)
  }

  /**
   * 创建圈子
   * @param {Object} data 圈子数据
   */
  static async create(data) {
    return request
      .table(TABLE_ID.BADMINTON_GROUP)
      .create(data)
  }

  /**
   * 更新圈子
   * @param {String} id 圈子ID
   * @param {Object} data 更新数据
   */
  static async update(id, data) {
    return request
      .table(TABLE_ID.BADMINTON_GROUP)
      .update(id, data)
  }

  /**
   * 删除圈子
   * @param {String} id 圈子ID
   */
  static async delete(id) {
    return request
      .table(TABLE_ID.BADMINTON_GROUP)
      .delete(id)
  }

  /**
   * 加入圈子
   * @param {String} id 圈子ID
   * @param {Object} userInfo 用户信息
   */
  static async join(id, userInfo) {
    const circle = await this.getDetail(id)
    const members = circle.members || []
    
    // 检查是否已经加入
    if (members.some(member => member.id === userInfo.id)) {
      throw new Error('您已经加入该圈子')
    }

    // 添加新成员
    members.push(userInfo)

    return this.update(id, {
      members,
      member_count: members.length
    })
  }

  /**
   * 退出圈子
   * @param {String} id 圈子ID
   * @param {String} userId 用户ID
   */
  static async quit(id, userId) {
    const circle = await this.getDetail(id)
    const members = circle.members || []
    
    // 过滤掉退出的成员
    const newMembers = members.filter(member => member.id !== userId)

    if (members.length === newMembers.length) {
      throw new Error('您不是该圈子成员')
    }

    return this.update(id, {
      members: newMembers,
      member_count: newMembers.length
    })
  }
}

export default CircleApi
