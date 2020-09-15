<template>
  <section class="section">
    <title-bar>
      Import Excel
      <!-- <router-link to="/" class="button is-primary" slot="button">
        Dashboard
      </router-link> -->
    </title-bar>

    <b-steps
      v-model="activeStep"
      :animated="true"
      :rounded="true"
      :has-navigation="false"
      label-position="right"
    >
      <b-step-item step="1" label="อัพโหลด" :clickable="true">
        <div class="card">
          <div class="card-content has-text-centered">
            <div v-if="resultMessage">
              {{ resultMessage }}
            </div>
            <div v-else>
              <p>
                กรุณาเตรียมข้อมูล ตามไฟล์
                <b-button @click="onExport" class="button is-primary is-small"
                  ><b-icon
                    icon="download"
                    size="is-small"
                    style="margin:0"
                  />template.xlsx</b-button
                >
                <!-- <a href="/template.xlsx" class="button is-primary is-small"
                  ><b-icon
                    icon="download"
                    size="is-small"
                    style="margin:0"
                  />template.xlsx</a
                > -->
                นี้ แล้วมาอัพโหลด โดยกดปุ่ม upload ด้านล่าง
              </p>
              <br />
              <br />
              <br />
              <!-- <b-button
                native-type="submit"
                type="is-primary"
                @click="confirmStep1"
                >Upload Excel</b-button
              > -->
              <vue-xlsx-table @on-select-file="handleSelectedFile"
                ><div style="padding:2px 4px; font-size:1rem">
                  Upload XLSX
                </div></vue-xlsx-table
              >
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </b-step-item>

      <b-step-item
        step="2"
        label="ตรวจสอบ"
        :clickable="false"
        :type="{ 'is-success': true }"
      >
        <div
          :class="'notification ' + (resultSuccess ? 'is-info' : 'is-danger')"
        >
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <div>
                  <span class="icon"
                    ><i class="mdi mdi-buffer default"></i></span
                  >{{ resultStep2 }}
                </div>
              </div>
            </div>
            <div class="level-right">
              <div v-if="resultSuccess">
                <button
                  type="button"
                  class="button is-large is-white"
                  style="margin-left:1em"
                  @click="confirmStep2"
                >
                  บันทึก
                </button>
              </div>
              <div v-else>
                <button
                  type="button"
                  class="button is-large is-white"
                  style="margin-left:1em"
                  @click="confirmReset"
                >
                  ย้อนกลับ
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- <b-table :data="tableData" :columns="tableColumns"></b-table> -->

        <b-table :data="tableData">
          <template slot-scope="props">
            <b-table-column field="phoneNumber" label="phoneNumber" sortable>
              <span
                :class="
                  'tag ' + (props.row.isValidPhone ? 'is-success' : 'is-danger')
                "
                >{{ props.row.phoneNumber }}</span
              >
            </b-table-column>
            <b-table-column field="tagId" label="tagId" sortable>
              <span
                v-show="props.row.tagId"
                :class="
                  'tag ' + (props.row.isValidTag ? 'is-success' : 'is-danger')
                "
                >{{ props.row.tagId }}</span
              >
            </b-table-column>
            <b-table-column field="isValid" label="isValid" sortable>
              <b-icon
                type="is-success"
                icon="check"
                v-show="props.row.isValid"
              />
              <b-icon
                type="is-danger"
                icon="close"
                v-show="!props.row.isValid"
              />
            </b-table-column>
          </template>
        </b-table>
      </b-step-item>

      <b-step-item step="3" label="เสร็จสิ้น" :clickable="false">
        <div class="card">
          <div class="card-content has-text-centered">
            <h1>{{ resultStep3 }}</h1>
            <br /><br />
            <p>
              <router-link to="/badge-log" class="button is-primary"
                >ดูสถานะการทำงาน</router-link
              >
            </p>
          </div>
        </div>
      </b-step-item>
    </b-steps>
  </section>
</template>

<script>
// import Notification from '@/components/Notification'
// import ClientsTableSample from '@/components/ClientsTableSample'
// import CardComponent from '@/components/CardComponent'
import XLSX from 'xlsx'
import TitleBar from '@/components/TitleBar'
import { mapState } from 'vuex'
const crypto = require('crypto')
export default {
  name: 'Tables',
  components: { TitleBar },
  computed: {
    ...mapState(['userName'])
  },
  data () {
    return {
      tableData: [],
      tableColumns: [],
      activeStep: 0,
      tagList: {},
      resultStep2: '',
      resultSuccess: false,
      resultStep3: '',
      resultMessage: 'Loading...'
    }
  },
  mounted () {
    this.getTagList()
  },
  methods: {
    sha256 (str) {
      return crypto.createHash('sha256').update(str).digest('hex')
    },
    onExport () {
      const self = this
      const sheet1 = [
        { phoneNumber: '08xxxxxxxx', tagId: 'fill-in tagId from sheet2' }
      ]
      const sheet2 = []
      for (const key in self.tagList) {
        sheet2.push({
          tagId: key,
          title: self.tagList[key]
        })
      }
      const sheet1WS = XLSX.utils.json_to_sheet(sheet1)
      const sheet2WS = XLSX.utils.json_to_sheet(sheet2)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, sheet1WS)
      XLSX.utils.book_append_sheet(wb, sheet2WS)
      XLSX.writeFile(wb, 'template.xlsx')
    },
    getTagList () {
      const self = this
      self.$API.get('morchanabackend', '/backend/tags', { response: true })
        .then(res => {
          self.tagList = []
          if (res.data) {
            for (let i = 0; i < res.data.tags.length; i++) {
              self.tagList[res.data.tags[i].id] = res.data.tags[i].title
            }
          }
          self.resultMessage = ''
        }).catch(err => {
          self.resultMessage = err.message
        })
    },
    getTagList2 () {
      const self = this
      this.$axios
        .get('/tags')
        .then(res => {
          self.tagList = []
          if (res.data) {
            for (let i = 0; i < res.data.tags.length; i++) {
              self.tagList[res.data.tags[i].id] = res.data.tags[i].title
            }
          }
          self.resultMessage = ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    convertPhoneNumber (phoneNumber) {
      while (phoneNumber.length < 10) {
        phoneNumber = '0' + phoneNumber
      }
      return phoneNumber
    },
    handleSelectedFile (convertedData) {
      if (convertedData.body.length === 0) {
        this.$buefy.dialog.alert('Everything looks fine!')
      } else {
        this.resultMessage = ''

        /* parser columns */
        // const thisColumns = []
        // for (let i = 0; i < convertedData.header.length; i++) {
        //   thisColumns.push({
        //     field: convertedData.header[i],
        //     label: convertedData.header[i]
        //   })
        // }
        // this.tableColumns = thisColumns

        /* parse body */
        const noTagObj = {}
        const thisData = []
        let isSuccess = true
        for (let j = 0; j < convertedData.body.length; j++) {
          const row = {}
          for (let i = 0; i < convertedData.header.length; i++) {
            const key = convertedData.header[i]
            const val = convertedData.body[j][key]

            if (key === 'phoneNumber') {
              const phoneNumber = this.convertPhoneNumber(val)
              const pattern = /0\d{9}/
              const re = phoneNumber.match(pattern)
              if (phoneNumber.length !== 10) {
                row.isValid = false
                row.isValidPhone = false
              } else if (!re) {
                row.isValid = false
                row.isValidPhone = false
              } else {
                row.isValid = true
                row.isValidPhone = true
              }
              row[key] = phoneNumber
            } else if (key === 'tagId') {
              row[key] = val
              if (!this.tagList[val]) {
                noTagObj[val] = val
                row.isValid = false
                row.isValidTag = false
              } else {
                row.isValid = true
                row.isValidTag = true
              }
              if (!row.isValid) {
                isSuccess = false
              }
            } else {
              isSuccess = false
            }
            // const val = convertedData.body[j][key]

            // if (key === 'tagId') {
            //   if (!this.tagList[val]) {
            //     row[key] = val
            //     noTagObj[val] = val
            //   } else {
            //     row[key] = val
            //   }
            // } else {
            //   row[key] = val
            // }
          }
          thisData.push(row)
        }
        this.tableData = thisData

        this.activeStep = 1

        // const noTagList = []
        // for (const key in noTagObj) {
        //   noTagList.push(key)
        // }
        // if (noTagList.length) {
        //   this.resultSuccess = false
        //   this.resultStep2 =
        //     'ไม่พบ tagId = "' +
        //     noTagList.join(',') +
        //     '" กรุณาเพิ่ม tagId ดังกล่าวก่อน หรือ แก้ไข excel ให้ถูกต้อง'
        // } else {
        //   this.resultSuccess = true
        //   this.resultStep2 = 'ไม่พบปัญหา หากพร้อมแล้ว กรุณากด "บันทึก"'
        // }
        if (isSuccess) {
          this.resultSuccess = true
          this.resultStep2 = 'ไม่พบปัญหา หากพร้อมแล้ว กรุณากด "บันทึก"'
        } else {
          this.resultSuccess = false
          this.resultStep2 =
            'พบข้อผิดพลาด กรุณาแก้ไข และ upload excel ใหม่อีกครั้ง'
        }
      }
    },
    confirmReset () {
      this.activeStep = 0
    },
    confirmStep1 () {
      this.activeStep = 1
    },
    confirmStep2 () {
      const self = this
      let postData = 'hashedPhoneNumber,tagId'
      for (let i = 0; i < self.tableData.length; i++) {
        postData += '\n' + self.sha256(self.tableData[i].phoneNumber) + ',' + self.tableData[i].tagId
      }
      self.$API.post('morchanabackend', '/backend/batch', { response: true, body: postData })
        .then(res => {
          const file = res.data.file
          self.activeStep = 2
          self.resultStep3 = 'บันทึกข้อมูลเรียบร้อย (batchNo: ' + file + ')'
        })
        .catch(err => {
          self.activeStep = 2
          self.resultStep3 = err.message
        })
    },
    confirmStep22 () {
      const self = this
      let postData = 'hashedPhoneNumber,tagId'
      for (let i = 0; i < self.tableData.length; i++) {
        postData += '\n' + self.sha256(self.tableData[i].phoneNumber) + ',' + self.tableData[i].tagId
      }
      self.$axios
        .post('/batch', postData)
        .then(res => {
          const file = res.data.file
          self.activeStep = 2
          self.resultStep3 = 'บันทึกข้อมูลเรียบร้อย (batchNo: ' + file + ')'
        })
        .catch(err => {
          self.activeStep = 2
          self.resultStep3 = err.message
        })
    }
  }
}
</script>

<style scoped>
.b-table .table-wrapper + .level {
  background: transparent !important;
}
</style>
