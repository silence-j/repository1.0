<template>
  <div class="person-list" v-loading.fullscreen="fullscreenLoading">
    <div class="filter-contact">
      <div class="left">
        <span :class="filterType === -1 ? 'active': ''" @click="changeFilter(-1)">全部</span>
        <span class="down-line">|</span>
        <span :class="filterType === 1 ? 'active': ''" @click="changeFilter(1)">重要{{text}}</span>
      </div>
      <div class="operate-container" id="operate-box">
        <span class="tags-btn" @click="showTags=showTags?false:true">
          <i class="icon-font icon-menu"></i>
          {{showTags?'隐藏标签':'显示标签'}}
        </span>
        <el-input :placeholder="placeholdDisplay(text)" v-model="searchText" @keyup.enter.native="search" class="search-two">
          <el-button slot="append" icon="search" @click="search" class="contact-list-search"></el-button>
        </el-input>
        <el-button type="default" class="btn" @click="leadJump" v-if="importIsShow(type)" style="margin-left:16px;">导入</el-button>
        <!--<el-button type="default" class="btn" @click="dialogImport=true">导入</el-button>-->
        <el-button type="default" class="btn" @click="groupManage" v-if="groupIsShow()">分组管理</el-button>
        <el-button type="primary" class="btn" @click="type? dialogAddCompany= true:dialogAddPerson=true">新增</el-button>
      </div>
    </div>
    <div class="hidden-tags" v-show="showTags">
      <div class="arrow-up1 arrow" :class="type?'arrow-comp':''"></div>
      <div class="arrow-up2 arrow" :class="type?'arrow-comp':''"></div>
      <p v-show="!tags.length">您还未添加标签</p>
      <button
        @click="filterByTag(tag.id, i)"
        type="gray" class="tag"
        v-for="(tag,i) in tags"
        :class="tag.active?'active':''"
        :key="tags">{{tag.tag}}</button>
    </div>
    <div class="contact-table">
      <!--分组筛选start-->
      <el-dropdown @command="changeGroup" class="group_dropdownt" v-if="!loadingTable  && type === 0" menu-align="start">
           <span class="el-dropdown-link">
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right" style="font-size:10px;"></i>
           </span>
        <el-dropdown-menu slot="dropdown">
          <!--<el-dropdown-item command="0">所有分组</el-dropdown-item>-->
          <el-dropdown-item v-for="(item, index) in groupList" :key="item" :command="returnCommand(item.groupId)" :title="item.groupName">{{item.groupName | str10Display}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--分组筛选end-->
      <!--联系人列表已有国家筛选start-->
      <el-dropdown @command="changeCountry" class="country_dropdownt position-one" v-if="!loadingTable && type === 0" menu-align="start">
         <span class="el-dropdown-link">
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right" style="font-size:10px;"></i>
         </span>
        <el-dropdown-menu slot="dropdown">
          <!--<el-dropdown-item command="0">所有国家</el-dropdown-item>-->
          <el-dropdown-item v-for="(item, index) in filterCountryList" :key="item" :command="returnCommand(item.id)" :title="item.name"><img v-if="item.nameEn!='' && item.nameEn!=null" :src="'../../../static/img/ImageFlag/'+item.nameEn+'.png'" alt="" class="filter_country_logo" />{{item.name | str4Display}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--联系人列表已有国家筛选end-->
      <!--公司列表已有国家筛选start-->
      <el-dropdown @command="changeCountry" class="country_dropdownt position-two" v-if="!loadingTable && type === 1" menu-align="start">
         <span class="el-dropdown-link">
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right" style="font-size:10px;"></i>
         </span>
        <el-dropdown-menu slot="dropdown">
          <!--<el-dropdown-item command="0">所有国家</el-dropdown-item>-->
          <el-dropdown-item v-for="(item, index) in filterCountryListTwo" :key="item" :command="returnCommand(item.id)" :title="item.name"><img v-if="item.nameEn!='' && item.nameEn!=null" :src="'../../../static/img/ImageFlag/'+item.nameEn+'.png'" alt="" class="filter_country_logo" />{{item.name | str4Display}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--公司列表已有国家筛选end-->
      <div class="hidden-select" v-show="selected">
        <span class="select-table">已选中 {{selected}} 个项目</span>
        <el-popover ref="tag" v-model="addTag" popper-class="tag-pop addTag" placement="bottom-start" title="添加标签" width="183" trigger="click">
          <el-input v-model="addTags" placeholder="多个标签用“,”隔开"></el-input>
          <div class="tag-btn" style="text-align: right;">
            <el-button type="text" size="small" @click="addTag=false">取消</el-button>
            <el-button type="primary" size="small" @click="contactsTagAdd">确定</el-button>
          </div>
        </el-popover>
        <span class="operate">
          <span class="opt-box icon-buttons">
            <el-dropdown trigger="click" @command="major" menu-align="start">
              <span class="el-dropdown-link" style="padding:0 20px">
                <span><i class="icon-font icon-real-start"></i>重要</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">标记为重要</el-dropdown-item>
                <el-dropdown-item command="0">取消标记为重要</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span class="icon-button menu-after" v-popover:tag><i class="icon-font icon-label"></i>标签</span>
            <span class="icon-button" v-if="false" @click="dialogMerge=selection.length===2?true:false"><i class="icon-font icon-merge"></i>合并</span>
            <span v-if="deleteRight()" class="icon-button" @click="dialogDelete=true"><i class="icon-font icon-remove" ></i>删除</span>
            <span v-if="type==0 && groupIsShow()" @click="contactGroupPop" class="icon-button"><i class="icon-font icon-grouping" ></i>分组</span>
          </span>
          <!-- @click="removeContact" -->
      </span>
      </div>
      <el-table
        ref="tableBox"
        @header-click="sort"
        v-if="!loadingTable"
        class="person-table"
        :class="type?'comp-table': ''"
        :data="contactList"
        @select="selectContact"
        @select-all="selectAll"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column :label="type?'公司名称':'姓名'" class="hello" inline-template fixed width="277">
          <div class="info-msg">
          <span>
            <img v-if="row.avatar && type === 1" onerror="javascript:this.src='/static/img/default_comp.png'" :src="row.avatar">
            <img v-if="row.avatar && type === 0" onerror="javascript:this.src='/static/img/default_avatar.png'" :src="row.avatar">
            <img v-if="!row.avatar && type === 0" src="../../assets/img/default_avatar.png">
            <img v-if="!row.avatar && type === 1" src="../../assets/img/default_comp.png">
            <span class="name" :class="{'canClick':selCompanyInfo==true}" v-show="row.contactsType" :title="row.name" @click="showDetail(row, 1)">{{row.name}}</span>
            <span class="autoComplete" v-show="row.contactsType && row.completionStatus==2">更新</span>
            <span
              v-show="!row.contactsType"
              :title="row.firstName+(row.lastName!=null?row.lastName:'')"
              class="name"
              :class="{'canClick':selPersonInfo==true}"
              @click="showDetail(row, 0)">
              {{row.firstName}} {{row.lastName!=null?row.lastName:''}}
            </span>
            <span class="autoComplete" v-show="!row.contactsType && row.completionStatus==1">new</span>
            <span v-show="!row.contactsType" :title="row.companyName" class="companyName" :class="{'canClick':selCompanyInfo==true}" @click="showDetail(row, 1)" :style="row.companyId!='' && row.companyId!=null?'':'cursor: auto;'">{{row.companyName}}</span>
          </span>
            <a href="javascript:;" class="follow icon-font icon-empty-start" v-if="!row.isMajor" @click="majorContact(row)"></a>
            <a href="javascript:;" class="follow on icon-font icon-real-start" v-else @click="majorContact(row)"></a>
          </div>
        </el-table-column>
        <el-table-column label="职位" v-if="!type" width="105" inline-template>
          <span v-text="(row.position=='' || row.position==null)? '—' : row.position" :title="row.position"></span>
        </el-table-column>
        <!--<el-table-column label="阶段" v-if="!type" inline-template width="100">-->
          <!--<span>{{(row.stageValue==null ? '—' : row.stageValue)}}</span>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="邮箱" inline-template width="200">-->
          <!--<span v-text="(row.mail=='' || row.mail==null)? '—' : row.mail" :title="row.mail"></span>-->
        <!--</el-table-column>-->
        <el-table-column label="联系方式" v-if="!type" width="188" inline-template>
        <span class="socialAccounts">
          <a target="_blank" v-if="row.mail"><i class="icon-font icon-message icon-blue"></i></a>
          <a v-if="!row.mail"><i class="icon-font icon-message icon-gray"></i></a>
          <a target="_blank" v-if="row.fbUrl" :href="getHomePageUrl(row.fbUrl)"><i class="icon-font icon-facebook"></i></a>
          <a v-if="!row.fbUrl"><i class="icon-font icon-contact-facebook"></i></a>
          <a target="_blank" v-if="row.twUrl" :href="getHomePageUrl(row.twUrl)"><i class="icon-font icon-twitter"></i></a>
          <a v-if="!row.twUrl"><i class="icon-font icon-contact-twitter"></i></a>
          <a target="_blank" v-if="row.linkedUrl" :href="getHomePageUrl(row.linkedUrl)"><i class="icon-font icon-linkedin"></i></a>
          <a v-if="!row.linkedUrl"><i class="icon-font icon-contact-linkedin"></i></a>
        </span>
        </el-table-column>
        <el-table-column label="最新动态" v-if="!type" inline-template width="174">
          <span :class="row.latestActionTimeLine.readFlag === 0 ? 'textBold' : ''" v-html="returnDynamics(row)" v-if="row.latestActionTimeLine!=''&&row.latestActionTimeLine!=null">
          </span>
          <span v-else>—</span>
        </el-table-column>
        <el-table-column label="最近动态发生时间" v-if="!type" inline-template width="154">
          <span v-if="row.latestActionTime==null">{{'—'}}</span>
          <span v-else>{{row.latestActionTime | time-formater-no-second}}</span>
        </el-table-column>
        <el-table-column label="分组" v-if="!type" inline-template width="118">
          <span>{{(row.groupName==null ? '—' : row.groupName)}}</span>
        </el-table-column>
        <el-table-column label="国家" v-if="!type" inline-template width="127">
          <span><img v-if="row.countryNameEn!='' && row.countryNameEn!=null" :src="'../../../static/img/ImageFlag/'+row.countryNameEn+'.png'" alt="" class="nationalflag" />{{(row.countryName==null ? '—' : row.countryName)}}</span>
        </el-table-column>


        <el-table-column label="联系人数量" v-if="type" inline-template width="124">
          <span v-if="row.companySize==null || !row.companySize">—</span>
          <router-link v-else :to="{ path: '/contact', query: { type: 0, companyId: row.companyId}}">
            <span style="color: #5488F9;">{{row.companySize}}</span>
          </router-link >
        </el-table-column>
        <el-table-column label="行业" v-if="type" inline-template width="124">
          <span>{{(row.industry==null ? '—' : row.industry)}}</span>
        </el-table-column>
        <el-table-column label="联系方式" v-if="type" width="194" inline-template>
        <span class="socialAccounts">
          <a target="_blank" v-if="row.mail"><i class="icon-font icon-message icon-blue"></i></a>
          <a v-if="!row.mail"><i class="icon-font icon-message icon-gray"></i></a>
          <a target="_blank" v-if="row.fbUrl" :href="getHomePageUrl(row.fbUrl)"><i class="icon-font icon-facebook"></i></a>
          <a v-if="!row.fbUrl"><i class="icon-font icon-contact-facebook"></i></a>
          <a target="_blank" v-if="row.twUrl" :href="getHomePageUrl(row.twUrl)"><i class="icon-font icon-twitter"></i></a>
          <a v-if="!row.twUrl"><i class="icon-font icon-contact-twitter"></i></a>
          <a target="_blank" v-if="row.linkedUrl" :href="getHomePageUrl(row.linkedUrl)"><i class="icon-font icon-linkedin"></i></a>
          <a v-if="!row.linkedUrl"><i class="icon-font icon-contact-linkedin"></i></a>
        </span>
        </el-table-column>
        <el-table-column label="电话" width="134" v-if="type" inline-template>
          <span v-text="(row.telephone=='' || row.telephone==null)?'—' : row.telephone" :title="row.telephone"></span>
        </el-table-column>
        <el-table-column v-if="type" width="110" label="国家" inline-template>
          <span><img v-if="row.countryNameEn!='' && row.countryNameEn!=null" :src="'../../../static/img/ImageFlag/'+row.countryNameEn+'.png'" alt="" class="nationalflag" />{{(row.countryName==null ? '—' : row.countryName)}}</span>
        </el-table-column>
        <!--<el-table-column v-if="!type" label="所在地" inline-template>-->
          <!--<span v-text="(row.region=='' || row.region==null)? '—' : row.region" :title="row.region"></span>-->
        <!--</el-table-column>-->
        <el-table-column label="标签" inline-template v-if="type" width="180">
          <div class="contact-tag-list">
            <!-- <el-tag class="tag" v-for="(t,index) in row.tagList" key="tagList" v-show="index<row.maxNum">{{t.tag}}</el-tag>
            <a v-show="row.showMore" @click="showMoreTag(row.userId)">显示更多</a> -->
            <el-tag class="tag" v-for="(t,index) in row.tagList" key="tagList" v-show="index<more">
              <span :title="t.tag">{{t.tag|tagFilter}}</span>
            </el-tag>
            <el-button type="text" v-show="row.tagList&&row.tagList.length>more" @click="showMore(row)">显示更多</el-button>
          </div>
        </el-table-column>
      </el-table>
      <div class="empty-contact" v-show="!contactList.length&&!loadingTable">
        <img src="../../assets/img/empty-contact.png">
        <p>暂无数据</p>
      </div>
    </div>
    <div class="loading loading-circle" v-if="loadingTable"></div>
    <el-pagination
      v-show="contactList.length && !loadingTable"
      class="list-pagination"
      @size-change="listSizeChange"
      @current-change="listCurrentChange"
      :current-page="currentPage"
      :page-size="size"
      :page-sizes="[10, 20, 30, 40]"
      layout="prev, pager, next, sizes, jumper"
      :total="contactTotalCount">
    </el-pagination>
    <!--分组管理start-->
    <el-dialog title="分组管理" v-model="groupManagementPop" class="group">
      <div class="loading loading-circle loading-group" v-if="groupDataIsLoad"></div>
      <ul class="group-list" v-if="groupList.length>0 && !groupDataIsLoad">
        <li class="group-info" v-for="(item, index) in groupList" :key="item" :class="{selected:index==currId}" @click="selectGroup(index)">
          <span class="desc" v-if="!item.edit">{{item.groupName}}</span>
          <div class="group-edit-box" v-if="item.edit">
            <el-input class="edit-input" v-model="groupList[index].editname" @keyup.enter.native="addGroupFunc(index)" :maxlength="20"></el-input>
            <span class="opt" @click="addGroupFunc(index)"><i class="icon-font submit">&#xe6d1;</i></span>
            <span class="opt" @click="cancelAddGroupFunc(index)"><i class="icon-font remove">&#xe602;</i></span>
          </div>
          <div class="group-option" v-if="!item.edit">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <a href="javascript:;" @click.stop="editGroup(index)"><i class="icon-pen"></i></a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <a href="javascript:;" @click.stop="deleteGroupFunc(index)"><i class="icon-trash"></i></a>
            </el-tooltip>
          </div>
        </li>
      </ul>
      <div class="no-data-group textCenter" v-else-if="!groupDataIsLoad">
        <span class="info">
          暂无分组
        </span>
        <div class="uploader-container">
          <el-button type="primary" class="uploader" @click="addGroup"><i class="icon-font add">&#xe6ad;</i>新增分组</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" class="addgroup" @click="addGroup"><i class="icon-font add-icon">&#xe6ad;</i>新建分组</el-button>
        <el-button type="primary" class="sure" :disabled="importing" @click="contactGroupFunc" v-if="groupEditType=='2'">确定</el-button>
        <el-button type="default" class="cancel" @click="groupManagementPop = false">取消</el-button>
      </span>
    </el-dialog>
    <!--分组管理end-->
    <el-dialog title="新增联系人" v-model="dialogAddPerson" class="add-dialog">
      <el-form label-position="top" :model="rulePersonForm" :rules="rules" ref="rulePersonForm">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="rulePersonForm.firstName" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input v-model="rulePersonForm.lastName" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="rulePersonForm.position" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="rulePersonForm.email" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="add-dialog-footer">
        <el-button type="primary" @click="addPerson" class="add-btn" :disabled="!rulePersonForm.firstName||personError">新增</el-button>
        <el-button @click="dialogAddPerson = false" class="add-btn">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增公司" v-model="dialogAddCompany" class="add-dialog">
      <el-form label-position="top" :model="ruleCompForm" :rules="rules" ref="ruleCompForm">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="ruleCompForm.name" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="公司官网" prop="url">
          <el-input v-model="ruleCompForm.url" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="add-dialog-footer">
        <el-button type="primary" @click="addComp" class="add-btn" :disabled="!ruleCompForm.name||compError">新增</el-button>
        <el-button @click="dialogAddCompany = false" class="add-btn">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'导入'+text" v-model="dialogImport" class="import-person">
      <span class="info">
        <i class="icon-font icon-warn warning"></i>
        上传{{text}}列表导入{{text}}，每个文件{{text}}数量不超过10000条
      </span>
      <div class="uploader-container">
        <el-button type="primary" class="uploader" :disabled="uploading">{{uploading?'正在上传文件':'导入'+text}}</el-button>
        <input class="file" type="file" ref="importInput" @change="changeFile($event)">
      </div>
      <a class="download" :href="type?
      'http://onloonnet.oss-cn-shanghai.aliyuncs.com/ops/%E5%85%AC%E5%8F%B8%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.csv':
      'http://onloonnet.oss-cn-shanghai.aliyuncs.com/ops/%E8%81%94%E7%B3%BB%E4%BA%BA%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.csv'">
        下载导入模板
      </a>
      <div class="file-container" v-show="importFile.length">
        <div class="files" v-for="(file,i) in importFile">
          <i class="type icon-font icon-excel"></i>
          <span class="fileName">{{file}}</span>
          <i class="close el-icon-close" @click="removeFile(i)"></i>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-show="importFile.length">
        <el-button type="primary" :disabled="importing" @click="importContact">导入</el-button>
        <el-button type="text" @click="dialogImport = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="dialogMerge" class="merge-dialog">
      <span>
        <i class="warning el-icon-warning"></i>
        <span class="text">合并操作无法还原，请确认后执行！</span>
      </span>
      <div class="content">
        <span class="info-text">确定合并以下2个{{text}}：</span>
        <p v-for="contact in selection" :title="contact.firstName+contact.lastName" key="selectContacts">{{contact.firstName+contact.lastName}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="merge">合并</el-button>
        <el-button type="text" @click="dialogMerge = false">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog v-model="dialogDelete" class="delete-dialog">
      <span>
        <i class="warning el-icon-warning"></i>
        <span class="text" v-show="selection.length===1">确定删除以下{{text}}：</span>
        <span class="text" v-show="selection.length>1">确定删除{{selection.length}}个{{text}}？</span>
      </span>
      <div class="content" v-show="selection.length===1">
        <p v-for="contact in selection" :title="contact.firstName ? (contact.firstName+(contact.lastName||'')) : contact.name" key="selectContacts">{{contact.firstName ? (contact.firstName+(contact.lastName||'')) : contact.name}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="del">删除</el-button>
        <el-button type="text" @click="dialogDelete = false">取消</el-button>
      </span>
    </el-dialog>
    <DialogBox :config="oconfig" @sure="confirmOk" @close="popClose"></DialogBox>
  </div>
</template>

<script>
  import contactInfoApi from '../../../src/api/contactInfoApi'
  import DialogBox from '../../components/box/dialogBox'
  import Util from '@/common/Util'
  import Vue from 'vue'
  export default {
    name: 'contact',
    data () {
      let validEmail = (rule, value, callback) => {
        let rule1 = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        if (value === '') {
          this.personError = false
          callback()
        } else if (!rule1.test(value)) {
          // this.$refs.rulePersonForm.validateField('email')
          this.personError = true
          callback(new Error('请输入正确邮箱'))
        } else {
          this.personError = false
          callback()
        }
      }
      let validUrl = (rule, value, callback) => {
        let rule2 = /^(http|https):\/\/([a-zA-Z\d][a-zA-Z\d-_]+\.)+[a-zA-Z\d-_][^ ]*$/
        if (value === '') {
          this.compError = false
          callback()
        } else if (!rule2.test(value)) {
          this.compError = true
          callback(new Error('请输入正确官网地址'))
        } else {
          this.compError = false
          callback()
        }
      }
      let validateFristName = (rule, value, callback) => {
        if (value.trim() === '') {
          this.compError = false
          callback(new Error('firstName 不能为空'))
          callback()
        } else {
          this.compError = false
          callback()
        }
      }
      return {
        fullscreenLoading: false,
        more: 3,
        importing: false,
        importFile: [],
        companyId: '',
        uploading: false,
        text: '',
        showTags: false,
        addTags: '',
        personError: false,
        compError: false,
        rulePersonForm: {
          firstName: '',
          lastName: '',
          position: '',
          email: ''
        },
        ruleCompForm: {
          name: '',
          url: ''
        },
        rules: {
          firstName: [
            { required: true, message: '请输入firstName', trigger: 'blur' },
            { validator: validateFristName, trigger: 'blur' }
          ],
          email: [{validator: validEmail, trigger: 'blur'}],
          name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
          ],
          url: [{validator: validUrl, trigger: 'blur'}]
        },
        dialogAddPerson: false,
        dialogMerge: false,
        dialogDelete: false,
        dialogImport: false,
        dialogAddCompany: false,
        selected: 0,
        type: 0, // 当前属性 0: 联系人 1：公司
        currentPage: 1,
        filter: -1,
        size: 20,
        searchText: '',
        totalCount: 0,
        contactSearch: [], // 搜索结果
        selectContacts: [], // 选择的联系信息
        selection: [], // 选择的联系
        addTag: false, // 添加标签功能是否显示
        selectTags: [],
        curTimer: null,
        groupManagementPop: false,
        groupList: [],
        currId: -1,
        groupIsEdit: false,
        dqGroupName: '',
        groupDataIsLoad: true,
        groupEditType: '1',   // 1分组编辑2联系人分组选择
        filterCountryList: [],  // 联系人筛选国家列表
        filterCountryListTwo: [], // 公司筛选国家列表
        filterGroupId: '',
        filterCountryId: '',
        editGroupindex: '',
        oconfig: {
          visible: false,
          notice: '',
          sureText: '确定',
          cancelText: '返回',
          callback: null,
          flag: 0,
          popovercls: 'confirm-pop'
        },
        deleteIndex: '',  // 删除分组索引
        isCommit: false,  // 接口是否正在提交
        selPersonInfo: false,  // 联系人是否有权限查看
        selCompanyInfo: false   // 公司是否有权限查看
      }
    },
    mounted () {
      this.selPersonInfo = Util.hasRightByCode('DAA')
      this.selCompanyInfo = Util.hasRightByCode('DBA')
      this.getAllCountryFunc()  // 获取联系人（公司）存在国家列表
//      let _this = this
      this.companyId = this.$route.query.companyId
      this.type = parseInt(this.$route.query.type) || 0
      this.text = this.type ? '公司' : '联系人'
      this.type ? this.$store.commit('CONTACT_TYPE', {contactType: 1}) : this.$store.commit('CONTACT_TYPE', {contactType: 0})
      this.getGroupListFunc()
      this.getAllCountryTwoFunc()
      // 初始状态显示联系人列表
      // this.$store.dispatch('getContactList', {companyId: this.companyId, size: this.size, page: this.currentPage, filter: this.filter})
      this.$store.dispatch('getTags')
//      setTimeout(() => {
//        document.querySelector('.el-table__body-wrapper').addEventListener('scroll', (event) => {
//          _this.onScroll()
//        })
//      }, 1500)
    },
    components: {DialogBox},
    computed: {
      contactList () {
        return this.$store.getters.contactList
      },
      contactTotalCount () {
        return this.$store.getters.contactTotalCount
      },
      tags () {
        return this.$store.getters.tags
      },
      loadingTable () {
        return this.$store.getters.loadingTable
      },
      filterType () {
        return this.$store.getters.filterType
      },
      mindex () {
        return this.$store.state.contact.mindex
      }
    },
    watch: {
      /**
       * 监听联系人和公司切换tab
       */
      $route () {
        this.companyId = this.$route.query.companyId
        this.type = this.$route.query.type
        this.currentPage = 1
        this.filter = -1
        this.size = 20
        this.searchText = ''
        this.totalCount = 0
        this.selectTags = []
        this.selected = 0
        this.text = this.type ? '公司' : '联系人'
        // this.type ? this.$store.commit('CONTACT_TYPE', {contactType: 1}) : this.$store.commit('CONTACT_TYPE', {contactType: 0})
        this.$store.dispatch('getTags')
        this.$store.dispatch('getContactList', {
          companyId: this.companyId,
          size: this.size,
          page: this.currentPage,
          filter: this.filter
        })

//        let _this = this
//        setTimeout(() => {
//          document.querySelector('.el-table__body-wrapper').addEventListener('scroll', (event) => {
//            _this.onScroll()
//          })
//        }, 1500)
      }
    },
    methods: {
      getHomePageUrl (url) {
        return Util.checkUrl(url)
      },
      // 分组权限判断
      groupIsShow () {
        return Util.hasRightByCode('DAC') && (parseInt(this.type) === 0)
      },
      // 公司或者联系人导入权限判断
      importIsShow (type) {
        if (type === 0) {  // 联系人导入
          return Util.hasRightByCode('DAD')
        } else {  // 公司导入
          return Util.hasRightByCode('DBC')
        }
      },
      // 最近动态返回
      returnDynamics (row) {
        let lastName = row.lastName ? row.lastName : ''
        let name = row.firstName + lastName
        let obj = row.latestActionTimeLine
        if (obj === '' || obj === null) {
          return '—'
        } else {
          let socialContent = obj.socialContent
          let socialContentObj = JSON.parse(socialContent)
          if (obj.socialType === 0) {
            if (socialContentObj.mailMarketingFlag) {  // 营销邮件
              if (socialContentObj.trackType === 0) { // 打开
                return name + '打开了营销邮件“' + socialContentObj.emailTitle + '”'
              } else {  // 点击
                return name + '点击了营销邮件中的链接“' + socialContentObj.emailTitle + '”'
              }
            } else { // 普通邮件
              if (socialContentObj.trackType === 0) { // 打开
                return name + '打开了邮件“' + socialContentObj.emailTitle + '”'
              } else {  // 点击
                return name + '点击了邮件链接“' + socialContentObj.emailTitle + '”'
              }
            }
          } else if (obj.socialType === 2) {
            if (socialContentObj.source === 2) { // facebook
              return '<i class="icon-facebook logo"></i>' + name + '<@' + socialContentObj.senderAccountName + '>在Facebook上给你<@' + socialContentObj.receiverAccountName + '>发了一条信息'
            }
            if (socialContentObj.source === 3) { // Twitter  我 @提到 别人
              if ((socialContentObj.bindingAccount === socialContentObj.senderId) && (socialContentObj.senderId !== socialContentObj.receiverId)) {
                return '<i class="icon-twitter-two"></i>' + '你<@' + socialContentObj.senderAccountName + '>在Twitter上@了' + name + '<@' + socialContentObj.receiverAccountName + '>'
              }
              if ((socialContentObj.bindingAccount === socialContentObj.receiverId)) { // Twitter@提到
                return '<i class="icon-twitter-two logo"></i>' + name + '<@' + socialContentObj.senderAccountName + '>在Twitter上@了你' + '<@' + socialContentObj.receiverAccountName + '>'
              }
            } else if (socialContentObj.source === 4) {
              if (socialContentObj.bindingAccount === socialContentObj.receiverId) {  // Twitter私信 对方发我
                return '<i class="icon-twitter-two logo"></i>' + name + '<@' + socialContentObj.senderAccountName + '>在Twitter上给你<@' + socialContentObj.receiverAccountName + '>发了一条私信'
              }
              if (socialContentObj.bindingAccount === socialContentObj.senderId) {  // Twitter私信 我发对方
                return '<i class="icon-twitter-two logo"></i>' + '你<@' + socialContentObj.senderAccountName + '>在Twitter上给' + name + '<@' + socialContentObj.receiverAccountName + '>发了一条私信'
              }
            }
          } else if (obj.socialType === 3) { // 询盘信息
            return socialContentObj.detail.firstName + socialContentObj.detail.lastName + '在' + socialContentObj.source + '所在的页面提交了一份询盘'
          } else if (obj.socialType === 4) { // 备注
            return '你记录了一份关于' + socialContentObj.contactName + '的备注'
          } else if (obj.socialType === 5) {  // 合并阶段
            return socialContentObj.newName + '与' + socialContentObj.oldName + '（' + socialContentObj.oldEmail + '）合并'
          } else if (obj.socialType === 6) {  // 阶段变更
            let statusobj = {
              following: '跟进',
              won: '成功',
              potential: '潜在',
              intention: '意向',
              failed: '失败',
              demo: '样品'
            }
            let status = statusobj[socialContentObj.status]
            return socialContentObj.contactName + '状态变更为' + status
          } else if (obj.socialType === 7) { // 系统信息
            // let lastName = row.lastName ? row.lastName : ''
            if (socialContentObj.commercialOpportunityFlag === '' || socialContentObj.commercialOpportunityFlag === null) {
              return name + '通过 商机推荐 被创建'
            } else {
              return name + '通过' + socialContentObj.createSource + '被创建'
            }
          } else if (obj.socialType === 8) { // 海关信息
            return name + '有一条海关数据'
          } else if (obj.socialType === 1) {
            if (socialContentObj.emailType === 1) { // 发邮件
              return '你发送了一份邮件给' + socialContentObj.contactName + '(' + socialContentObj.contactEmail + ')'
            } else { // 收到邮件
              return '你收到了一封邮件来自' + socialContentObj.contactName + '(' + socialContentObj.contactEmail + ')'
            }
          } else if (obj.socialType === 9) { // 联系人待补全消息
            return '多个数据字段有更新数据'
          } else if (obj.socialType === 10) {  // 联系已补全消息
            return '多个数据字段补充完成'
          } else if (obj.socialType === 11) {  // 联系已补全消息
            return name + '访问了官网'
          }
        }
      },
      // 查询联系人所有国家
      getAllCountryFunc () {
        contactInfoApi.getAllCountry().then(res => {
          if (res.data.code === 0) {
            this.filterCountryList = res.data.data
          }
        })
      },
      // 查询公司所有国家
      getAllCountryTwoFunc () {
        contactInfoApi.getAllCountryTwo().then(res => {
          if (res.data.code === 0) {
            this.filterCountryListTwo = res.data.data
          }
        })
      },
      returnCommand (groupId) {
        return '' + groupId
      },
      // 选择分组筛选
      changeGroup (command) {
        this.filterGroupId = command
        let params = {companyId: this.companyId, size: this.size, page: this.currentPage, filter: this.filter}
        if (command !== '' && command !== '0') {
          params.groupIds = command
        }
        // if (this.filterCountryId !== '') {
          // params.countryId = this.filterCountryId
        // }
        this.$store.dispatch('getContactList', params)
      },
      // 选择国家筛选
      changeCountry (command) {
        this.filterCountryId = command
        let params = {companyId: this.companyId, size: this.size, page: this.currentPage, filter: this.filter}
        if (command !== '' && command !== '0') {
          params.countryId = command
        }
        // if (this.filterGroupId !== '') {
          // params.groupIds = this.filterGroupId
        // }
        this.$store.dispatch('getContactList', params)
      },
      // 联系人划分分组弹框
      contactGroupPop () {
        this.groupEditType = '2'
        this.groupManagementPop = true
        this.groupDataIsLoad = false
        this.currId = -1
        this.resetGroupEdit()
      },
      // 联系人分组归类
      contactGroupFunc () {
        if (this.currId !== -1) {
          let groupId = this.groupList[this.currId].groupId
          let params = {
            contactsId: this.selectContacts.join(','),
            groupId: groupId
          }
          contactInfoApi.updateContactGroup(params).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '联系人分组成功'
              })
              let contactsCount = this.groupList[this.currId].contactsCount
              contactsCount = contactsCount + 1
              this.groupList[this.currId].contactsCount = contactsCount
              this.freshList()
              // this.getGroupListFunc()  // 重新调用分组，获取列表数据所有分组项
            }
          })
        }
        this.groupManagementPop = false
      },
      // 重置分组
      resetGroupEdit () {
        let p = this.groupList
        if (this.editGroupindex !== '') {
          let index = parseInt(this.editGroupindex)
          if (p[index] !== '' && p[index] !== null && p[index] !== undefined) {
            if (p[index].edit && p[index].isNew) {    // 当前是新分组并且在编辑状态,删除
              p.splice(index, 1)
            } else { // 否则去除编辑状态
              p[index].editname = p[index].groupName
              p[index].edit = false
            }
          }
        }
        this.groupIsEdit = false
      },
      // 分组管理
      groupManage () {
        this.groupEditType = '1'
        this.groupManagementPop = true
        // this.groupDataIsLoad = false
        this.groupIsEdit = false
        // this.getGroupListFunc()
        this.resetGroupEdit()
        this.currId = -1
      },
      // 添加或者修改分组
      addGroupFunc (index) {
        let groupname = this.groupList[index].editname
        let isNew = this.groupList[index].isNew
        if (!this.isCommit) {
          this.isCommit = true
          if (groupname === '' || groupname === null) {
            this.$message.error('分组名称不能为空')
            return
          } else {
            if (isNew) {  // 如果是新分组，点击确认调用新增
              let params = {
                name: groupname
              }
              contactInfoApi.addGroup(params).then(res => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新增分组成功'
                  })
                  this.getGroupListFunc()
                }
                this.isCommit = false
                this.groupIsEdit = false
              })
            } else {  // 如果是旧分组，点击确认调用修改
              let groupId = this.groupList[index].groupId
              let params = {
                groupId: groupId,
                name: groupname
              }
              contactInfoApi.updateGroup(params).then(res => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改分组成功'
                  })
                  this.getGroupListFunc()
                }
                this.groupIsEdit = false
                this.isCommit = false
              })
            }
          }
        }
      },
      // 取消添加分组
      cancelAddGroupFunc (index) {
        let p = this.groupList
        p[this.editGroupindex].edit = true
        if (p[index].edit && p[index].isNew) {    // 当前是新分组并且在编辑状态,删除
          p.splice(index, 1)
        } else { // 否则去除编辑状态
          p[index].editname = p[index].groupName
          p[index].edit = false
        }
        this.groupIsEdit = false
      },
      // 获取分组列表
      getGroupListFunc () {
        contactInfoApi.getGroupList().then(res => {
          if (res.data.code === 0) {
            if (res.data.data.length > 0) {
              // this.groupList = res.data.data
              let dataList = res.data.data
              dataList.forEach((item) => {
                item.editname = item.groupName
                item.edit = false
                item.isNew = false
              })
              this.groupList = dataList
            }
          }
          this.groupDataIsLoad = false
          this.isCommit = false
        })
      },
      // 选中当前分组
      selectGroup (index) {
        this.currId = index
      },
      // 导入跳转
      leadJump () {
        this.$router.push(
          {
            path: '/uploadAttachment',
            query: {'importType': this.type}
          }
        )
      },
      // 删除分组验证
      deleteGroupFunc (index) {
        if (!this.groupIsEdit) {
          let p = this.groupList
          let contactsCount = p[index].contactsCount  // 分组内联系人数量
          if (contactsCount === 0) {    // 如果数量为空直接删除
            this.deleteGroup(index)
          } else {
            let notice = '确定删除“' + p[index].groupName + '”分组'
            let pname = '该分组包含' + contactsCount + '个联系人'
            this.deleteIndex = index
            this.groupManagementPop = false
            Object.assign(this.oconfig, {visible: true, theme: 'red', notice: notice, message: pname, flag: 0})
          }
        } else {
          this.$message.error('请先保存编辑分组')
        }
      },
      // 删除分组
      deleteGroup (index) {
        let p = this.groupList
        let groupId = p[index].groupId
        let params = {
          groupId: groupId
        }
        contactInfoApi.deleteGroup(params).then(res => {
          if (res.data.code === 0) {
            p.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除分组成功'
            })
            this.getGroupListFunc()
          }
        })
      },
      // 确定删除
      confirmOk () {
        this.deleteGroup(this.deleteIndex)
      },
      // 确认弹框关闭
      popClose () {
        this.groupManagementPop = true
      },
      // 编辑分组
      editGroup (index) {
        if (!this.groupIsEdit) {
          this.groupIsEdit = true
          let p = this.groupList
          p[index].edit = true
          this.editGroupindex = index
          console.log(p[index])
        } else {
          this.$message.error('请先保存编辑分组')
        }
      },
      // 新增分组
      addGroup () {
        if (!this.groupIsEdit) {
          let p = this.groupList
          this.groupIsEdit = true
          this.editGroupindex = p.length
          p.push({groupName: '', editname: 'New Category', edit: true, isNew: true})
          if (p.length > 6) {
            Vue.nextTick(() => {
              document.getElementsByClassName('el-dialog__body')[0].scrollTop = document.getElementsByClassName('el-dialog__body')[0].scrollHeight
            })
          }
        } else {
          this.$message.error('请先保存编辑分组')
        }
      },
      /**
       * 查看权限
       */
      viewRight () {
        if (parseInt(this.type) === 0) {  // 查看联系人
          return this.selPersonInfo
        } else {  // 查看公司
          return this.selCompanyInfo
        }
      },
      /**
       * 删除权限
       */
      deleteRight () {
        if (parseInt(this.type) === 0) {  // 联系人删除
          return Util.hasRightByCode('DAB')
        } else {  // 公司删除
          return Util.hasRightByCode('DBB')
        }
      },
      placeholdDisplay (text) {
        if (text === '联系人') {
          return '请输入联系人姓名'
        } else {
          return '请输入公司名称'
        }
      },
      onScroll () {
        let scrollEl = this.$refs.tableBox
        let scrollLeft = scrollEl.bodyWrapper.scrollLeft
        let fixedTable = document.querySelector('.el-table__fixed')
        if (scrollLeft > 0) {
          fixedTable.className = 'el-table__fixed hasShadow'
        } else {
          fixedTable.className = 'el-table__fixed'
        }
      },
      sort (column, event) {
        if (column.label === '阶段') {
          this.$store.dispatch('getContactList', {
            size: this.size,
            page: this.currentPage,
            keyword: this.searchText,
            filter: this.filter,
            tagIds: this.selectTags.join(';'),
            orderByClause: 'STAGE DESC'
          })
        }
      },
      /**
       * 显示更多
       * @param row
       */
      showMore (row) {
        let contactId = this.type ? row.companyId : row.personId
        this.$router.push({path: '/contactDetail', query: {contactId, contactType: this.type}})
      },
      removeFile (i) {
        this.$refs.importInput.value = ''
        this.importFile.splice(i, 1)
      },
      /**
       * 上传导入文件
       */
      changeFile (event) {
        let file = event.target.files[0]
        if (!file) {
          return
        }
        let reg = /^.*\.(?:xls|xlsx|csv)$/i
        this.uploading = true
        if (!reg.test(file.name)) {
          this.$message.error('选择excel文件！')
          this.uploading = false
          return
        }
        let formData = new FormData()
        formData.append('file', file)
        contactInfoApi.fileUpload(formData).then(res => {
          if (!res.data.code) {
            this.importFile.push(res.data.data.oriName)
          }
          this.uploading = false
        })
      },
      importContact () {
        this.importing = true
        contactInfoApi.importContact({fileName: this.importFile.join(';'), contactsType: this.type}).then(res => {
          if (!res.data.code) {
            this.$message.success('导入联系人成功！')
            this.dialogImport = false
            this.importing = false
            this.importFile = []
            this.freshList()
          } else {
            this.$message.error('导入联系人失败！')
          }
        })
      },
      /**
       * 新增标签
       */
      contactsTagAdd () {
        if (this.addTags.trim() === '') {
          this.$message.error('请添加标签')
          return
        }
        if (!this.type) {   // 联系人
          contactInfoApi.personTagAdd({
            contactIds: this.selectContacts.join(';'),
            tagNames: this.addTags.split(',').join(';')
          }).then(res => {
            if (!res.data.code) {
              this.addTag = false
              this.$message.success('添加标签成功')
              this.$store.dispatch('getTags')
              this.showTags = false
              this.freshList()
              this.addTags = ''
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {   // 公司
          contactInfoApi.companyTagAdd({
            contactsList: this.selectContacts.join(';'),
            tagList: this.addTags.split(',').join(';')
          }).then(res => {
            if (!res.data.code) {
              this.addTag = false
              this.$message.success('添加标签成功')
              this.$store.dispatch('getTags')
              this.showTags = false
              this.freshList()
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      },
      filterByTag (tagId, index) {
        if (!this.tags[index].active) {
          this.selectTags.push(tagId)
          this.$store.commit('CONTACT_TAGS_CHANGE', {index, active: true})
        } else {
          this.selectTags.splice(this.selectTags.indexOf(tagId), 1)
          this.$store.commit('CONTACT_TAGS_CHANGE', {index, active: false})
        }
        this.currentPage = 1
        this.freshList()
      },
      /**
       * 搜索
       */
      search () {
        console.log('search')
        this.currentPage = 1
        this.selected = 0
        this.freshList()
      },
      /**
       * 分页数目改变
       * @param size
       */
      listSizeChange (size) {
        this.size = size
        this.currentPage = 1
        this.freshList()
      },
      /**
       * 刷新列表 by shaohuan
       */
      freshList () {
        this.selected = 0
        this.$store.dispatch('getContactList', {
          size: this.size,
          page: this.currentPage,
          keyword: this.searchText,
          filter: this.filter,
          tagIds: this.selectTags.join(';')
        })
      },
      /**
       * 当前页改变
       * @param page
       */
      listCurrentChange (page) {
        this.currentPage = page
        this.freshList()
      },
      /**
       * 全部或者重要
       * @param value -1全部 1重要
       */
      changeFilter (value) {
        if (this.filter === value) {
          return
        }
        this.$store.commit('FILTER_TYPE', {filterType: value})
        let _this = this
        setTimeout(() => {
          document.querySelector('.el-table__body-wrapper').addEventListener('scroll', (event) => {
            _this.onScroll()
          })
        }, 1500)
        this.selected = 0
        this.filter = value
        this.currentPage = 1
        this.freshList()
      },
      /**
       * 联系人/公司 标记为重要
       * @param row
       */
      majorContact (row) {
        // update by shaohuan 5.11
        let params = {
          majorFlag: row.isMajor ? 0 : 1,
          contactIds: row.contactsType ? row.companyId : row.personId
        }
        if (!row.contactsType) {
          contactInfoApi.updatePersonMajor(params).then(res => {
            if (!res.data.code) {
              this.selected = 0
              row.isMajor = row.isMajor ? 0 : 1
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          contactInfoApi.updateCompanyMajor(params).then(res => {
            if (!res.data.code) {
              this.selected = 0
              row.isMajor = row.isMajor ? 0 : 1
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      },
      /**
       * 跳转到相对应的详情页
       * @param row
       * @param contactType
       */
      showDetail (row, contactType) {
        /**
         * [如果没有权限，并且是 联系人个人 ，则不跳转]
         * @param  {[type]} this.viewRight() &&            !contactType [description]
         * @return {[type]}                  [description]
         */
        if (contactType === 1 && !this.selCompanyInfo) { // 查看公司详情
          return
        }
        if (contactType === 0 && !this.selPersonInfo) { // 查看联系人详情
          return
        }
        let contactId = contactType ? row.companyId : row.personId
        if (contactId === '' || contactId === null) {
          return
        } else {
          this.fullscreenLoading = true
          this.$router.push({path: '/contactDetail', query: {contactId, contactType}})
        }
      },
      /**
       * 搜索关键字过滤
       * @param queryString
       * @param cb
       */
//      querySearchAsync (queryString, cb) {
//        if (queryString.length < 2) {
//          cb([])
//          return
//        }
//        if (this.curTimer) {
//          clearTimeout(this.curTimer)
//        }
//        this.curTimer = setTimeout(() => {
//          contactInfoApi.getContactPersonList({keyword: this.searchText}).then(res => {
//            let contactSearch = []
//            res.data.data.records.forEach(function (record) {
//              contactSearch.push({
//                value: record.name
//              })
//            })
//            let results = this.searchText ? contactSearch.filter(this.createStateFilter(this.searchText)) : contactSearch
//            cb(results)
//          })
//        }, 1000)
//      },
      /**
       * 过滤方法
       * @param queryString
       * @returns {function(*)}
       */
      createStateFilter (queryString) {
        return (state) => {
          return (state.value.indexOf(queryString.toLowerCase()) !== -1)
        }
      },
      /**
       * 选中表格一行
       * @param selection
       * @param row
       */
      selectContact (selection, row) {
        this.selectContacts = []
        this.selected = selection.length
        this.selection = selection
        selection.forEach((item) => {
          if (!this.type) {
            this.selectContacts.push(item.personId)
          } else {
            this.selectContacts.push(item.companyId)
          }
        })
      },
      /**
       * 删除联系人
       */
      // removeContact () {
      //   contactInfoApi.deletePersonList({contactIds: this.selectContacts.join(';')}).then(res => {
      //     console.log(res)
      //   })
      // },
      /**
       * 全选
       * @param selection
       */
      selectAll (selection) {
        this.selectContacts = []
        this.selected = selection.length
        this.selection = selection
        selection.forEach((item) => {
          if (!this.type) {
            this.selectContacts.push(item.personId)
          } else {
            this.selectContacts.push(item.companyId)
          }
        })
      },
      major (command) {
        if (!this.type) {
          contactInfoApi.updatePersonMajor({contactIds: this.selectContacts.join(';'), majorFlag: parseInt(command)}).then(res => {
            if (!res.data.code) {
              this.freshList()
              parseInt(command) ? this.$message.success('标记为重要成功') : this.$message.success('取消标记为重要成功')
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          contactInfoApi.updateCompanyMajor({contactIds: this.selectContacts.join(';'), majorFlag: parseInt(command)}).then(res => {
            if (!res.data.code) {
              this.freshList()
              parseInt(command) ? this.$message.success('标记为重要成功') : this.$message.success('取消标记为重要成功')
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      },
      /**
       * 合并联系人
       */
      merge () {
        contactInfoApi.mergePerson({
          contactId: this.selectContacts[0],
          mergedContactId: this.selectContacts[1]
        }).then(res => {
          if (!res.data.code) {
            this.$message.success('合并联系人成功')
            this.selected = 0
            this.dialogMerge = false
            this.freshList()
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      /**
       * 新增联系人
       */
      addPerson () {
        let _this = this
        this.$refs.rulePersonForm.validate((valid) => {
          if (valid) {
            this.rulePersonForm.mails = JSON.stringify([{'type': 0, 'mail': this.rulePersonForm.email}])
            contactInfoApi.addPerson(this.rulePersonForm).then(res => {
              if (!res.data.code) {
                this.dialogAddPerson = false
                _this.$message.success('新增联系人成功')
                this.freshList()
              } else {
                _this.$message.error(res.data.message)
              }
            })
          } else {
            return false
          }
        })
      },
      /**
       * 新增公司
       */
      addComp () {
        contactInfoApi.addComp(this.ruleCompForm).then(res => {
          if (!res.data.code) {
            this.dialogAddCompany = false
            this.$message.success('新增公司成功')
            this.freshList()
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      /**
       * 删除联系人/公司
       */
      del () {
        let deal = (res, name) => {
          if (!res.data.code) {
            this.selected = 0
            this.dialogDelete = false
            this.$message.success('删除' + name + '成功')
            this.freshList()
          } else {
            this.$message.error(res.data.message)
          }
        }
        if (this.type) { // 公司
          let arr = []
          this.selectContacts.forEach(item => {
            arr.push({'contactsId': item, 'contactsType': 1})
          })
          let params = {'contactses': JSON.stringify(arr)}
          contactInfoApi.deleteCompanyList(params).then(res => {
            deal(res, '公司')
          })
        } else {
          let params = {contactIds: this.selectContacts.join(';')}
          contactInfoApi.deletePersonList(params).then(res => {
            deal(res, '联系人')
            // if (!res.data.code) {
            //   _this.dialogDelete = false
            //   _this.$message.success('删除联系人成功')
            //   setTimeout(() => {
            //     location.reload()
            //   }, 500)
            // } else {
            //   _this.$message.error(res.data.message)
            // }
          })
        }
      }
    },
    filters: {
      tagFilter (value) {
        // if (value.length > 10) {
        //   return value.substring(0, 9) + '...'
        // } else {
        //   return value
        // }
        return value
      },
      str10Display (value) {
        if (value.length > 10) {
          return value.substring(0, 10) + '...'
        } else {
          return value
        }
      },
      str4Display (value) {
        if (value.length > 4) {
          return value.substring(0, 4) + '...'
        } else {
          return value
        }
      }
    },
    destroyed () {
      this.fullscreenLoading = false
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../assets/style/variable";
  @import '../../assets/style/page';
  .canClick{
    cursor: pointer;
  }
  .el-popover{
    input{
      height: 28px;
      margin: 10px 0 20px 0;
    }
  }
  .text-ellipsis(){
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .person-list{
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(0,0,0,.08);
    .el-table__fixed-header-wrapper{
      .is-leaf:nth-child(2){
        .cell{
          padding:0 20px 0 0;
        }
      }
    }
    .el-table__body-wrapper{
      z-index: 2;
    }
    .el-table__fixed{
      z-index: 4;
      border-right: 1px solid #DFE3EB;
      box-shadow: none;
      &.hasShadow{
        border: none;
        box-shadow: 1px 0 8px #d3d4d6;
      }
      .el-table__fixed-header-wrapper{
        background:#000;
        .is-leaf:nth-child(2){
          .cell{
            padding:0 20px 0 0;
          }
        }
      }
      .el-table__fixed-body-wrapper{
        td:nth-child(2){
          .cell{
            padding:0 20px 0 0;
          }
        }
      }
    }
    table{
      border-collapse: inherit;
      tr{
        height: 48px;
      }
    }
    .comp-table{
      tr{
        td:last-child .cell{
          padding: 0;
        }
      }
    }
    .el-table__empty-block{
      display: none;
      font-size: 13px;
      color: #33475B;
    }
    .el-table__body tr.hover-row > td{
      background: #F5F8FA;
    }
    td {
      .cell{
        white-space: nowrap;
        .contact-tag-list{
          white-space: normal;
          .tag{
            max-width: 82px;
            vertical-align: bottom;
            .text-ellipsis()
          }
        }
      }
      .logo{
        margin-right:4px;
      }
      .icon-twitter-two{
        color: #48B3FE;
      }
    }
    th{
      background: #F5F8FA;
      .cell{
        background: #F5F8FA;
      }
    }
    .group{
      .el-dialog{
        width:520px;
      }
      .el-dialog__header{
        padding: 15px 20px;
        border-bottom: 1px solid #EAF0F6;
      }
      .textCenter{
        text-align: center;
      }
      .el-dialog__body{
        padding:0 0;
        height:260px;
        overflow-y:auto;
        .loading-group{
          margin-top: 100px;
        }
        .group-list{
          .group-info{
            padding:8px 16px 8px 20px;
            font-size: 13px;
            color: #33475B;
            line-height:18px;
            overflow:hidden;
            .group-edit-box{
              .opt{
                width:28px;
                height:28px;
                background: #FFFFFF;
                border: 1px solid #CBD6E3;
                border-radius: 4px;
                padding:4px 6px;
                color: #B0C1D4;
                cursor: pointer;
              }
              .opt:hover{
                border: 1px solid #5488F9;
                color: #5488F9;
              }
              .edit-input{
                width:160px;
              }
              .el-input__inner{
                font-size: 13px;
                color: #33475B;
                height:29px;
              }
            }
            .group-option{
              display: none;
              float:right;
              .el-tooltip{
                margin-right:16px;
                display:inline-block;
                color: #DFE3EB;
              }
            }
          }
          .group-info.selected{
            background:#e6f8fa;
          }
          li:hover{
            background: #F4F6F8;
            .group-option{
              display: inline-block;
              .item{
                color: #5488F9;
              }
            }
          }
        }
        .no-data-group{
          padding:66px 0 140px 0;
          .info{
            margin-bottom:8px;
            display: inline-block;
            font-size: 13px;
            color: #7C98B6;
          }
          .uploader-container{
            .el-button{
              padding:5px 18px;
              .add{
                margin-right:5px;
              }
            }
          }
        }
      }
      .el-dialog__footer{
        border-top: 1px solid #EAF0F6;
        padding:16px 16px;
        overflow:hidden;
        .el-button{
          padding: 9px 15px;
        }
        .el-button.sure{
          padding: 9px 25px;
        }
        .el-button.cancel{
          padding: 9px 25px;
        }
        .addgroup{
          float:left;
          .add-icon{
            color: #B0C1D4;
            margin-right:5px;
          }
        }
        .addgroup:hover{
          .add-icon{
            color: #5488F9;
          }
        }
        .addgroup:focus{
          .add-icon{
            color: #5488F9;
          }
        }
      }
    }
    .merge-dialog,.delete-dialog{
      .el-dialog{
        width: 500px;
        .warning{
          font-size: 30px;
          color: @yellow;
          margin-right: 10px;
        }
        .text{
          vertical-align: text-top;
          font-weight: bold;
        }
      }
      .el-dialog__header{
        border: none;
      }
      .el-dialog__body{
        padding: 10px 40px;
        .content{
          padding-left: 44px;
          .info-text{
            display: inline-block;
            margin: 10px 0;
            font-size: 12px;
          }
          p{
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
            max-width: 250px;
            .text-ellipsis()
          }
        }
      }
      .el-dialog__footer{
        text-align: left;
        padding: 15px 84px 55px;
        button{
          padding: 10px 25px;
        }
      }
    }
    .delete-dialog{
      .el-dialog{
        .warning{
          font-size: 30px;
          color: @tipError;
          margin-right: 10px;
        }
        .el-button--primary{
          background-color: @tipError;
          border: 0;
        }
      }
    }
    .import-person{
      .el-dialog{
        width: 466px;
      }
      .el-dialog__header{
        padding: 15px 20px;
        border-bottom: 1px solid @textBorderColor;
      }
      .warning{
        font-size: 20px;
        color: @yellow;
      }
      .el-dialog__footer{
        text-align: left;
        padding-bottom: 50px;
        padding-left: 40px;
        button{
          padding: 10px 25px;
        }
      }
      .el-dialog__body{
        text-align: center;
        font-size: 13px;
        padding: 30px 20px 20px 20px;
        .uploader-container{
          position: relative;
          input{
            opacity: 0;
            display: inline-block;
            width: 186px;
            height: 33px;
            position: absolute;
            left: 119px;
            top: 30px;
            border: 1px solid;
          }
        }
        .file-container{
          padding: 10px 40px;
          background: #F5F8FA;
          text-align: left;
          width: 386px;
          margin-left: -20px;
          margin-top: 20px;
          .files:hover{
            .close {
              display: inline-block;
            }
          }
          .files{
            .type{
              color: #7BD12C;;
            }
            .close{
              float: right;
              cursor: pointer;
              display: none;
            }
            span{
              margin-left: 5px;
            }
          }
        }
        .info{
          color: #7C98B6;
        }
        .uploader{
          padding: 10px 65px;
          margin-top: 30px;
          margin-bottom: 10px;
        }
        .download{
          font-weight: normal;
          color: @activeBlue;
        }
      }
    }
    .add-dialog{
      .el-dialog{
        width: 500px;
      }
      .el-dialog__header{
        border: none;
        padding: 27px 20px;
        background: @activeBlue;
        span{
          color: @white;
          font-size: 20px;
        }
        .el-dialog__close{
          font-size: 16px;
          color: @white;
        }
      }
      .el-dialog__body{
        padding: 30px 40px 20px;
        .el-form-item{
          margin-bottom: 20px;
          input{
            height: 40px;
          }
        }
      }
      .el-dialog__footer{
        padding: 15px 30px 30px 30px;
        text-align: left;
        background: #F5F8FA;
        border-top: 1px solid #CBD6E2;
        .add-btn{
          padding: 17px 55px;
        }
      }
    }
    .el-tag{
      height: 28px;
      line-height: 26px;
    }
  }
  .addTag.el-popover{
    padding:10px;
    .el-popover__title{
      text-align: left;
    }
  }
  .tag-pop{
    .el-input{
      width: 179px;
    }
    .el-popover__title{
      margin: 10px 0 0 0;
      color: #33475B;
      font-size: 13px;
      font-weight: bold;
    }
  }
  .tag-btn{
    .el-button{
      font-size: 13px;
    }
    .el-button--text{
      color: #4F6D95;
    }
  }
  .el-dropdown-menu{
    .filter_country_logo{
      width: 24px;
      vertical-align: middle;
      margin-right: 5px;
      border-radius:4px;
      background: url('../../../static/img/ImageFlag/common.png') center no-repeat;
      background-size: 25px;
      height: 16px;
      display: inline-block;
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../assets/style/variable";
  @import "../../assets/style/base";
  .arrow{
    position: absolute;
    width: 0;
    height: 0;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    top: -10px;
    left: 574px;
  }
  .arrow-comp{
    left: 674px;
  }
  .arrow-up1 {
    border-bottom:10px solid #dfe2ec;
  }
  .arrow-up2 {
    border-bottom:10px solid #F5F8FA;
    top: -9px;
  }
  .el-dropdown-menu{
    border-radius: 4px;
  }
  .el-dropdown-menu__item{
    padding: 0 15px;
    font-size: 13px;
    &:not(.is-disabled):hover{
      background-color: #F4F6F8;
    }
  }
  .person-list{
    position: relative;
    padding-bottom: 20px;
    background: #fff;
    margin-bottom: 30px;
    .socialAccounts{
      /*margin-right: 20px;*/
      a{
        margin-right: 10px;
      }
      i{
        font-size: 14px;
      }
      .icon-gray{
        color: #ddd;
      }
      .icon-blue{
        color: #00b8cc;
      }
      .icon-message{
        transform: scale(0.81);
        display: inline-block;
      }
    }
    .textBold{
      font-weight: bold;
    }
    .contact-table{
      position: relative;
      .group_dropdownt{
        position: absolute;
        top: 20px;
        left: 81%;
        z-index: 99;
      }
      .group_dropdownt:hover{
        top:18px;
        .el-icon-caret-bottom{
          transform: rotate(180deg);
        }
      }
      .position-one{
        left: 90.6%;
      }
      .position-two{
        left: 77.1%;
      }
      .country_dropdownt{
        position: absolute;
        top: 20px;
        z-index: 99;
      }
      .country_dropdownt:hover{
        top:18px;
        .el-icon-caret-bottom{
          transform: rotate(180deg);
        }
      }
      .el-table tr{
        height: 48px;
      }
    }
    .person-table{
      .nationalflag{
        width:24px;
        height:16px;
        display:inline-block;
        vertical-align: middle;
        margin-right:5px;
        border-radius:4px;
        background: url('../../../static/img/ImageFlag/common.png') center no-repeat;
        background-size: 25px;
      }
      .info-msg{
        min-height: 70px;
        position: relative;
        .autoComplete{
          position: absolute;
          left: 185px;
          top: 18px;
          padding: 1px 5px;
          /*background: @textareaBorder;*/
          background: #5488F9;
          color: #fff;
          border-radius: 10px;
          height: 17px;
          line-height: 15px;
          font-size: 10px;
        }
        img {
          position: absolute;
          top: 15px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .name:hover{
          color:#5488F9;
        }
        .name,.companyName{
          position: absolute;
          display: inline-block;
          width: 130px;
          left: 50px;
          top: 15px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        .name{
          font-weight: bolder;
        }
        .companyName {
          top: 35px;
          color: #7C98B6;
        }
        .follow{
          font-size: 16px;
          color: #B0C1D4;
          float: right;
          margin-top: 25px;
        }
        .on{
          color: @yellow;
        }
      }
    }
    .tag{
      cursor:pointer;
      padding: 0 5px;
      color: #4F6D95;
      border: 1px solid rgb(228,236,254);
      background: rgb(228,236,254);
      border-radius: 4px;
      outline: none;
      &:hover{
        cursor:pointer;
        border: 1px solid #5488F9;
        color: #5488F9;
      }
    }
    .hidden-tags{
      position: relative;
      padding: 16px 10px 20px 10px;
      background: #F5F8FA;
      width: calc(~'100% - 20px');
      // height: 66px;
      // line-height: 66px;
      min-height: 66px;
      line-height: 28px;
      border-top: 1px solid rgb(223, 226, 236);
      border-bottom: 1px solid rgb(223, 226, 236);
      p{
        color: #7C98B6;
        font-size: 13px;
        text-align: center;
        margin-top: 20px;
      }
      .tag{
        // margin: 0 20px 0 10px;
        margin: 5px 4px;
        height: 28px;
        line-height: 28px;
      }
      .tag.active{
        border: 1px solid @activeBlue;
        color: @activeBlue;
      }
    }
    .empty-contact{
      padding: 110px 0;
      text-align: center;
      p{
        margin-top: 24px;
      }
    }
    .hidden-select{
      position: absolute;
      top: 8px;
      right: 1px;
      width: calc(~'100% - 52px');
      height: 39px;
      line-height: 39px;
      background: #F5F8FA;
      z-index: 999;
      .select-table{
        color: #7C98B6;
        font-size: 13px;
      }
      .operate{
        font-size: 14px;
        color: #45628A;
        margin-left: 40px;
        .opt-box{
          background: #fff;
          height: 28px;
          line-height: 28px;
          display: inline-block;
          border: 1px solid #CBD6E3;
          border-radius: 4px;
        }
        .icon-button{
          padding:0 20px;
          line-height: 29px;
          vertical-align: top;
        }
        i{
          margin-right: 5px;
        }
        .op-menu{
          cursor: pointer;
          margin-left: 30px;
        }
        .menu-after{
          display: inline-block;
          text-align: center;
        }
        .el-dropdown-link{
          cursor: pointer;
          color: #45628A;
        }
      }
      //border: 1px solid rgb(223, 226, 236);
    }
    .filter-contact{
      height: 36px;
      padding: 12px;
      span{
        font-size: 14px;
        cursor: pointer;
        color: #7C98B6;
      }
      .down-line{
        margin: 0 10px;
        color: #CBD6E3;
      }
      span.active{
        font-size: 16px;
        cursor: default;
        font-weight: bold;
        color: #33475B;
      }
      .left{
        float: left;
        margin-top: 10px;
        margin-bottom: 25px;
      }
      .operate-container{
        float: right;
        margin-top: 0;
        font-size:0px;
        .contact-list-search{
          background: #F5F8FA;
          padding: 7px;
        }
        .tags-btn{
          margin-right: 20px;
          i{
            margin-right: 5px;
          }
        }
        .search-two{
          width: 240px;
          .el-input-group__append{
            padding: 0 11px;
          }
        }
        .btn{
          width: 90px;
          margin-left: 8px;
        }
      }
    }
    .el-table__body-wrapper{
      .tag{
        margin: 3px;
      }
    }
  }

</style>
