<template>
  <div>
    <section class="section">
      <title-bar>
        Import Log
        <div slot="button">
          <b-button @click="doRefresh" class="button is-primary"
            >Refresh</b-button
          >
        </div>
      </title-bar>

      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Processing</p>
        </header>
        <div v-if="tableDataProcessing && tableDataProcessing.length > 0">
          <b-table :data="tableDataProcessing">
            <template slot-scope="props">
              <b-table-column field="status" label="status">
                <span class="tag is-warning">processing</span>
              </b-table-column>
              <b-table-column field="ts" label="date">
                {{ toDate(props.row.file) }}
              </b-table-column>
              <b-table-column field="id" label="batchNo">
                {{ props.row.file }}
              </b-table-column>
            </template>
          </b-table>
        </div>
        <div v-else class="card-content">
          {{ resultMessage1 }}
        </div>
      </div>
      <br />
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">Done</p>
        </header>
        <div v-if="tableDataDone && tableDataDone.length > 0">
          <b-table :data="tableDataDone">
            <template slot-scope="props">
              <b-table-column field="status" label="status">
                <span class="tag is-info">done</span>
              </b-table-column>
              <b-table-column field="ts" label="date">
                {{ toDate(props.row.file) }}
              </b-table-column>
              <b-table-column field="id" label="batchNo">
                {{ props.row.file }}
              </b-table-column>
              <b-table-column field="total" label="total">
                {{ props.row.total }}
              </b-table-column>
              <b-table-column field="success" label="success">
                <span class="tag is-success" v-if="props.row.success">
                {{ props.row.success }}
                </span>
              </b-table-column>
              <b-table-column field="fail" label="fail">
                <span class="tag is-danger" v-if="props.row.fail">
                {{ props.row.fail }}
                </span>
              </b-table-column>
            </template>
          </b-table>
        </div>
        <div v-else class="card-content">
          {{ resultMessage2 }}
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment'
import TitleBar from '@/components/TitleBar'
export default {
  name: 'Tables',
  components: { TitleBar },
  data () {
    return {
      resultMessage1: 'Loading...',
      resultMessage2: 'Loading...',
      modalMessage: '',
      tagClass: {
        processing: 'is-warning',
        error: 'is-danger',
        done: 'is-black'
      },
      isLoading: false,
      tableDataProcessing: [],
      tableDataDone: [],
      isComponentModalActive: false,
      rowList: [],
      frm: {
        id: '',
        title: '',
        description: '',
        tagRoleId: '',
        disabled: false
      }
    }
  },
  mounted () {
    this.getBatchLog()
  },
  methods: {
    doRefresh () {
      this.resultMessage1 = 'Refreshing...'
      this.resultMessage2 = 'Refreshing...'
      this.tableDataDone = []
      this.tableDataProcessing = []
      this.getBatchLog()
    },
    toDate (str) {
      return moment(parseInt(str))
        .format()
        .replace('T', '@')
        .split('+')[0]
    },
    fromNow (str) {
      return moment(parseInt(str)).fromNow()
    },
    getBatchLog () {
      const self = this
      self.$API.get('morchanabackend', '/backend/batch', { response: true })
        .then(res => {
          self.tableDataProcessing = res.data.processing

          const rows = []
          for (let i = 0; i < res.data.done.length; i++) {
            const row = res.data.done[i]
            const col = row.file.split('-')
            row.file = col[0]
            row.success = col[2]
            row.fail = col[1] - col[2]
            row.total = col[1]
            rows.push(row)
          }
          self.tableDataDone = rows
          console.log(res.data.done)

          self.resultMessage1 = res.data.processing.length ? '' : 'No data'
          self.resultMessage2 = res.data.done.length ? '' : 'No data'
        })
        .catch(err => {
          console.log(err)
          self.resultMessage1 = err.message
          self.resultMessage2 = err.message
        })
    },
    getBatchLog2 () {
      const self = this
      self.$axios
        .get('/batch')
        .then(res => {
          self.tableDataProcessing = res.data.processing

          const rows = []
          for (let i = 0; i < res.data.done.length; i++) {
            const row = res.data.done[i]
            const col = row.file.split('-')
            row.file = col[0]
            row.success = col[2]
            row.fail = col[1] - col[2]
            row.total = col[1]
            rows.push(row)
          }
          self.tableDataDone = rows
          console.log(res.data.done)

          self.resultMessage1 = res.data.processing.length ? '' : 'No data'
          self.resultMessage2 = res.data.done.length ? '' : 'No data'
        })
        .catch(err => {
          console.log(err)
          self.resultMessage1 = err.message
          self.resultMessage2 = err.message
        })
    }
  }
}
</script>
