import HttpUtil from '@/common/HttpUtil'

const enquiriesAPI = {
  /**
   * 加载商机列表
   * @param {[type]} params [description]
   */
  getChanceList (params) {
    let getUrl = process.env.DOMAIN + '/bshop/client/commercial/opportunity/inquiry/page'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 获取微询盘列表
   * */
  getMicroEnquiries (params) {
    let getUrl = process.env.DOMAIN + '/bshop/client/enquiry/recommend/micro/page'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 获取普通询盘列表
   * */
  getCommonEnquiries (params) {
    let getUrl = process.env.DOMAIN + '/bshop/client/enquiry/recommend/trad/page'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 普通询盘（公司邮箱）信息挖掘（获取邮箱）
   * @param {[type]} params [description]
   */
  emailCommendGig (params) {
    let getUrl = process.env.DOMAIN + '/bshop/client/enquiry/recommend/email/getbydomain'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 普通询盘（联系人邮箱）信息挖掘（获取邮箱）
   * @param {[type]} params [description]
   */
  emailPersonGig (params) {
    let getUrl = process.env.DOMAIN + '/bshop/client/enquiry/recommend/email/getbyname'
    return HttpUtil.post(getUrl, params)
  },
  /**
   * 添加联系人
   * @param {[type]} params [description]
   */
  addPerson (params) {
    let getUrl = process.env.DOMAIN + '/bshop/contacts/person/add'
    return HttpUtil.post(getUrl, params)
  },
  addCompany (params) {
    let getUrl = process.env.DOMAIN + '/bshop/client/contacts/add'
    return HttpUtil.post(getUrl, params)
  }
}
export default enquiriesAPI
