<template>
  <div>
    <twitterAtMe
    v-if="data.socialContent.source===3&&(data.socialContent.bindingAccount === data.socialContent.receiverId)"
    :data="data"></twitterAtMe>
    <twitterMeAtOther
    v-if="data.socialContent.source===3&&(data.socialContent.bindingAccount === data.socialContent.senderId)&&(data.socialContent.senderId!==data.socialContent.receiverId)"
    :data="data"></twitterMeAtOther>
    <twitterChatMe
    v-if="data.socialContent.source===4&&(data.socialContent.bindingAccount === data.socialContent.receiverId)"
    :data="data"></twitterChatMe>
    <twitterMeChatOther
    v-if="data.socialContent.source===4&&(data.socialContent.bindingAccount === data.socialContent.senderId)"
    :data="data"></twitterMeChatOther>
    <facebookChatMeItem
    v-if="data.socialContent.actionType===2&&(data.socialContent.source===1||data.socialContent.source===2)"
    :data="data"></facebookChatMeItem>
  </div>
</template>
<script>
// Twitter上@我
import twitterAtMe from './twitterAtMe'
// Twitter我@别人
import twitterMeAtOther from './twitterMeAtOther'
// Twitter他人私信给我
import twitterChatMe from './twitterChatMe'
// Twitter我私信他人
import twitterMeChatOther from './twitterMeChatOther'
// facebook别人私信我
import facebookChatMeItem from './facebookChatMeItem'
export default {
  name: '',
  data () {
    return {}
  },
  mounted () {

  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {

  },
  components: {
    twitterAtMe,
    twitterMeAtOther,
    twitterChatMe,
    twitterMeChatOther,
    facebookChatMeItem
  },
  methods: {

  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>

</style>
