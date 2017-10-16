<template>
  <div>
    <createDoneItem
    v-if="!data.socialContent.commercialOpportunityFlag"
    :data="data"></createDoneItem>
    <enquiryCreateItem
    v-if="data.socialContent.commercialOpportunityFlag"
    :data="data"></enquiryCreateItem>
  </div>
</template>
<script>
import createDoneItem from './CreateDoneItem'
import enquiryCreateItem from './enquiryCreateItem'
export default {
  name: '',
  data () {
    return {}
  },
  props: {
    data: {
      type: Object
    }
  },
  mounted () {

  },
  computed: {

  },
  components: {
    createDoneItem,
    enquiryCreateItem
  },
  methods: {

  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>

</style>
