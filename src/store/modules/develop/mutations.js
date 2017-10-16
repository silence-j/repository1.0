import * as types from './types'
import Vue from 'vue'
let vm = new Vue()

export const mutations = {
  [types.DEVELOP_ADDEXTENSION] (state, { isAddExtension }) {
    state.isAddExtension = isAddExtension
  },

  [types.DEVELOP_ADDSUCCESS] (state, { isAddSuccess, sendType }) {
    state.isAddSuccess = isAddSuccess
    state.sendType = sendType
  },

  [types.DEVELOP_EDITEXTENSION] (state, { isEditExtension, detail }) {
    state.isEditExtension = isEditExtension
    if (detail) {
      state.detail = detail
    }
  },

  [types.DEVELOP_EDITSUCCESS] (state, { isEditSuccess }) {
    state.isEditSuccess = isEditSuccess
  },

  [types.DEVELOP_BINDINGLIST] (state, { bindingList }) {
    state.bindingList = bindingList
  },

  [types.DEVELOP_BOARDLIST] (state, { boardList }) {
    state.boardList = boardList
  },

  [types.DEVELOP_CHANGEBINDLIST] (state, { value, index }) {
    vm.$set(state.bindingList[index], 'checked', value)
  },

  [types.DEVELOP_CHANNELTYPE] (state, { channelType }) {
    state.channelType = channelType
  },

  [types.FIND_CONTACTID] (state, { contactId }) {
    state.contactId = contactId
  },

  [types.FIND_COMPANYID] (state, { companyId }) {
    state.companyId = companyId
  },

  [types.TRADE_COMPANYID] (state, { tradeCompanyId }) {
    state.tradeCompanyId = tradeCompanyId
  },

  [types.DEVELOP_SEARCH_PAGE] (state, { page }) {
    state.searchPage = page
  },
  [types.DEVELOP_SETDIRTY] (state, ismDirty) {
    state.ismDirty = ismDirty
  },
  [types.DEVELOP_KEYWORD] (state, { keyWord }) {
    state.keyWord = keyWord
  },
  [types.DEVELOP_SENDINFO] (state, { first, second, third, four }) {
    if (first) {
      state.sendInfo.first = first
    }
    if (second) {
      state.sendInfo.second = second
    }
    if (third) {
      state.sendInfo.third = third
    }
    if (four) {
      state.sendInfo.four = four
    }
    // state.sendInfo.second = second
    // state.sendInfo.third = third
    // state.sendInfo.four = four
  },
  [types.DEVELOP_EMAILCONTENTLIST] (state, emailContentList) {
    state.emailContentList = emailContentList
  },
  [types.DEVELOP_ISTIMING] (state, isTiming) {
    state.isTiming = isTiming
  },
  // 是否是新建四个菜单点击过来的
  [types.DEVELOP_ISMENUCLICK] (state, flag) {
    state.ismenuclick = flag
  }
}
