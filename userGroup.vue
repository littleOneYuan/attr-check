<template>
  <div class="main-container">
    <div>
      <div class="filter-group">
        <RadioGroup v-model="d_group" type="button">
          <Radio label="全部"></Radio>
          <Radio label="我创建的"></Radio>
        </RadioGroup>
        <Select
          v-model="group"
          placeholder="搜索人群名称或ID"
          @on-clear="group_clear"
          @on-create="get_group_create"
          @on-open-change="get_group_select"
          allow-create
          filterable
          clearable
        >
          <Option v-for="item in groupList" :value="item.value" :key="item.value">{{
            item.label
          }}</Option>
        </Select>
        <BigCsearch
          placeholder="按人或部门搜索"
          :trans_unselList="People_List"
          :trans_selList="res_People_List"
          @func="getPeople_List"
        />
        <Button type="primary" ghost @click="query">查询</Button>
      </div>
      <div class="right-btn-group">
        <Dropdown style="margin-left: 10px" @on-click="create_handle">
          <Button type="primary" icon="md-person-add">创建人群</Button>
          <DropdownMenu slot="list">
            <DropdownItem name="rule">条件规则</DropdownItem>
            <Upload action="" :before-upload="preUpload">
              <DropdownItem name="uid">UID人群包</DropdownItem>
            </Upload>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="table-box">
        <el-table
          v-loading="tableloading"
          :data="tableData"
          :height="tableHeight"
          border
          id="table_box"
          style="width: 100%"
        >
          <el-table-column prop="groupname" label="人群名称" min-width="100">
          </el-table-column>
          <el-table-column
            prop="groupdesc"
            label="分群描述"
            min-width="130"
          ></el-table-column>
          <el-table-column prop="grouptype" label="分群类型" min-width="68">
            <template slot-scope="scope">
              {{ scope.row.grouptype === "1" ? "规则创建" : "外部创建" }}
            </template>
          </el-table-column>
          <el-table-column prop="groupnum" label="人数" min-width="50"></el-table-column>
          <el-table-column prop="founder" label="创建人" min-width="50"></el-table-column>
          <el-table-column prop="editor" label="最新编辑人" min-width="70">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="100">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="100">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '0'" class="error"
                ><Icon type="md-close-circle" /> 失败了</span
              >
              <span v-if="scope.row.status === '1'" class="wait"
                ><Icon type="md-time" /> 生成中</span
              >
              <span v-if="scope.row.status === '2'" class="success"
                ><Icon type="md-checkmark-circle" /> 已生成</span
              >
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                plain
                @click="userPicture(scope.$index, scope.row)"
                >用户画像</el-button
              >
              <el-button
                size="mini"
                type="primary"
                plain
                @click="srcAnalyze(scope.$index, scope.row)"
                >来源分析</el-button
              >
              <!-- <el-button
                size="mini"
                type="info"
                plain
                @click="handleEdit(scope.$index, scope.row)"
                >明细用户</el-button
              > -->
              <Dropdown
                style="margin-left: 10px"
                @on-click="more_handle($event, scope.row)"
              >
                <el-button size="mini" plain>
                  更多操作
                  <Icon type="ios-arrow-down"></Icon>
                </el-button>
                <DropdownMenu slot="list">
                  <DropdownItem v-if="scope.row.status === '2'" name="export"
                    >导出</DropdownItem
                  >
                  <!-- <DropdownItem
                    v-if="['1', '2'].includes(scope.row.status)"
                    name="refresh"
                    >刷新</DropdownItem
                  > -->
                  <!-- <DropdownItem name="copy">复制</DropdownItem> -->
                  <DropdownItem
                    v-if="scope.row.status === '2' && scope.row.grouptype === '1'"
                    name="copy"
                    >复制</DropdownItem
                  >
                  <!-- <DropdownItem v-if="scope.row.status === '2'">编辑</DropdownItem> -->
                  <DropdownItem v-if="['0', '2'].includes(scope.row.status)" name="delete"
                    >删除</DropdownItem
                  >
                  <DropdownItem v-if="scope.row.status === '0'" name="redo"
                    >重新执行</DropdownItem
                  >
                </DropdownMenu>
              </Dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <div class="rule-box" v-if="rule_show">
      <ruleSelect
        :rule_motion="rule_motion"
        :groupId="copy_groupId"
        @showfun="rule_show_handle"
      />
    </div>
  </div>
</template>

<script>
import {
  importUserGroup,
  getUserGroupIdAndName,
  getUserAndDepartmentName,
  getUserGroups,
  deleteUserGroup,
  retryUserGroup
} from '@/api/common.model'
import { isArray, parseTime } from '@/common/js/c_common'

import BigCsearch from '@/components/c-search-big/index.vue'
import ruleSelect from '@/components/rule-select'
import { Table, TableColumn, Button, Pagination } from 'element-ui'
// import group_table_res from '@/data/user/group_table_res'
export default {
  name: 'usergroup',
  components: {
    BigCsearch,
    ruleSelect,
    ElTable: Table,
    ElButton: Button,
    ElPagination: Pagination,
    ElTableColumn: TableColumn
  },
  props: {},
  computed: {
    tableHeight () {
      return `${this.screenHeight - 180}px`
    }
  },
  data () {
    return {
      group: '',
      rule_motion: 'create',
      copy_groupId: '',
      groupId: '',
      groupName: '',
      groupFlag: 'select',
      createId: -1,
      rule_show: false,
      People_List: [],
      res_People_List: [],
      sel_People_List: [],
      groupList: [],
      d_group: '全部',
      peopleList: [],
      tableloading: false,
      tableData: [],
      flag: false, // 非当前页转换传入pageIndex应为1
      pageSize: 15,
      total: 20,
      screenHeight: window.innerHeight,
      currentPage: 1
    }
  },
  // 注册局部过滤器
  filters: {
    timefilters (val) {
      if (val === null || val === '') {
        return '暂无时间'
      } else {
        const d = new Date(val) // val 为表格内取到的后台时间
        const month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
        const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
        const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
        const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
        const sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
        const times =
          d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec
        return times
      }
    }
  },
  methods: {
    create_handle (option) {
      if (option === 'rule') {
        this.rule_motion = 'create'
        this.rule_show = true
      }
    },
    // 用户画像
    userPicture (idx, row) {},
    // 来源分析
    srcAnalyze (idx, row) {},
    more_handle (option, row) {
      console.log(option)
      console.log(row)
      // window.open(`http://${path}`, '_blank')
      if (option === 'export') {
        // 导出
        window.open(`http://${row.filePath}`, '_blank')
      } else if (option === 'refresh') {
        // 刷新
      } else if (option === 'copy') {
        // 复制
        this.rule_motion = 'copy'
        this.copy_groupId = row.groupId
        this.rule_show = true
      } else if (option === 'delete') {
        // 删除
        this.copy_groupId = row.groupId
        this.deleteUserGroup()
      } else if (option === 'redo') {
        // 重新执行
        this.copy_groupId = row.groupId
        this.retryUserGroup()
      }
    },
    retryUserGroup () {
      retryUserGroup({ group_id: this.copy_groupId }).then((data) => {
        if (data) {
          this.$Message.success(data)
          this.query()
        }
      })
    },
    deleteUserGroup () {
      deleteUserGroup({ group_id: this.copy_groupId }).then((data) => {
        if (data) {
          this.$Message.success(data)
          this.query()
        }
      })
    },
    rule_show_handle (show) {
      this.rule_show = show.status
      if (show.msg !== '') {
        this.$Message.success(show.msg)
        this.query()
      }
    },
    // 切换每页总条数
    handleSizeChange (val) {
      this.pageSize = val
      this.query()
    },
    // 切换当前页
    handleCurrentChange (val) {
      this.flag = true
      this.currentPage = val
      this.query()
      this.flag = false
    },
    getTableList (data) {
      // 拿到查询结果
      if (data) {
        this.tableData = data
      }
    },
    // 清空group
    group_clear () {
      this.groupId = null
      this.groupName = ''
    },
    // 拿到创建的group
    get_group_create (val) {
      this.groupList.push({
        value: this.createId,
        label: val
      })
      this.group = this.createId
      this.groupId = this.createId
      this.groupName = val
      this.createId--
      this.groupFlag = 'create'
    },
    // 拿到选择的group
    get_group_select (open) {
      if (!open && typeof this.group === 'number') {
        console.log(this.group, '---this.group')
        // 在关闭的时候操作
        if (this.groupFlag === 'select') {
          this.groupId = this.group
          this.groupName = this.groupList.find((item) => item.value === this.group).label
        }
        this.groupFlag = 'select'
      }
    },
    // 拿到选择的people
    getPeople_List (list, first) {
      this.sel_People_List = list
      console.log(this.sel_People_List, '---this.sel_People_List')
      // if (list && !first) {
      // setTimeout(() => {
      //   this.query()
      // }, 500)
      // }
    },
    handleClick (row) {
      console.log(row)
    },
    // 查询
    query () {
      this.tableLoading = true
      if (!this.flag) {
        this.currentPage = 1
      }
      getUserGroups({
        userId: this.sel_People_List,
        groupId: this.groupId,
        groupName: this.groupName,
        searchAll: this.d_group === '全部' ? 1 : 0,
        pageNum: this.flag ? this.currentPage : 1,
        pageSize: this.pageSize
      }).then((data) => {
        // console.log(data, '---getUserGroups')
        if (data && data.row && data.row.length > 0) {
          data.row.forEach((r) => {
            r.createTime = r.createTime ? parseTime(r.createTime, '{y}-{m}-{d}') : ''
            r.updateTime = r.updateTime ? parseTime(r.updateTime, '{y}-{m}-{d}') : ''
          })
          this.total = data.total
          this.tableData = data.row
        }
        this.tableLoading = false
      })
    },
    // 导入模拟数据
    preUpload (file) {
      const { size, name, type } = file

      console.log(size)
      console.log(name)
      console.log(type)
      // if (
      //   ![
      //     'application/vnd.ms-excel',
      //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      //   ].includes(type)
      // ) {
      //   // if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(type)) {
      //   this.$Message.error({
      //     closable: true,
      //     duration: 5,
      //     content: `${name} 格式错误！仅支持后缀.xlsx`
      //   })
      //   return false
      // }
      // if (size > 10 * 1024 * 1024) {
      //   this.$Message.error({
      //     closable: true,
      //     duration: 5,
      //     content: `上传的文件名 ${name} 超过限制大小10M~`
      //   })
      //   return false
      // }
      this.uploadFile(file)
      return false
    },
    uploadFile (file) {
      importUserGroup({ file }).then((data) => {
        if (data && typeof data !== 'symbol') {
          // console.log(data,'---data')
        }
      })
    },
    // 查询分群列表条件：用户和部门条件
    getUserAndDepartmentName () {
      getUserAndDepartmentName().then((data) => {
        if (data && typeof data !== 'symbol') {
          // console.log(data, '---peopledata')
          this.People_List = this.selectedList_handle(data)
        }
      })
    },
    // 查询分群列表条件：分群id和分群名字条件
    getUserGroupIdAndName () {
      getUserGroupIdAndName().then((data) => {
        if (data && typeof data !== 'symbol') {
          // console.log(data, '---groupdata')
          data.forEach((item) => {
            this.groupList.push({
              value: item.id,
              label: item.name
            })
          })
        }
      })
    },
    // 处理选项数组
    selectedList_handle (list) {
      if (isArray(list) && list.length > 0) {
        var res_list = []
        list.forEach((item) => {
          var k_arr = Object.keys(item)
          var o = {}
          o.label = item[k_arr[0]]
          o.value = item[k_arr[1]]
          res_list.push(o)
        })
        return res_list
      }
    }
  },
  watch: {},
  mounted () {
    this.$nextTick(() => {
      this.screenHeight = window.innerHeight
    })
    window.onresize = () => {
      return (() => {
        window.screenHeight = window.innerHeight
        this.screenHeight = window.screenHeight
      })()
    }
  },
  created () {
    // this.getTableList(group_table_res.data)
    this.query()
    this.getUserGroupIdAndName()
    this.getUserAndDepartmentName()
  }
}
</script>

<style lang="stylus" scoped>
// 状态
span.success {
  color: #50b144
}
span.error {
  color: #d48a8a
}
span.wait {
  color: #a1a6ab
}
.ivu-select {
    width: 160px;
}
.right-btn-group {
  top: 8px;
  right: 9px
}
.table-box {
  margin-top: 8px;
  overflow-y: auto;
  overflow-x: auto;
  position: relative
  height: 900px;
}
.el-table {
  overflow-y: auto !important;
}
#app .el-table th {
  background-color: $cBlue;
}
.el-pagination {
  margin-top: 2px;
}
.el-button.is-plain:focus, .el-button.is-plain:hover {
    background: #FFF;
    border-color: #7da3c7;
    color: #7da3c7;
}
.el-button--primary.is-plain:focus, .el-button--primary.is-plain:hover {
    background: #7da3c7;
    border-color: #7da3c7;
    color: #FFF;
}
.el-button--primary.is-plain {
    color: #7da3c7;
}
.el-button--success.is-plain {
    color: #7fc377;
    background: #f0f9eb;
    border-color: #b4d4a5;
}
.el-button--success.is-plain:focus, .el-button--success.is-plain:hover {
    background: #71b58f;
    border-color: #71b58f;
    color: #fff;
}
.el-button--info.is-plain:focus, .el-button--info.is-plain:hover {
    background: #909399;
    border-color: #909399;
    color: #FFF;
}
// rule
div.rule-box {
  position: absolute
  top: 0
  z-index: 4
  padding: 0px
}
.ivu-select-dropdown-list {
  width: 200px
}
.ivu-select {
  width: 200px;
}
.ivu-select-dropdown-list li {
  width: 195px
  height: 35px;
  line-height: 35px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 6px;
}
</style>
