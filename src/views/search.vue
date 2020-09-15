<template>
  <div>
    <section class="section">
      <b-field>
            <b-input placeholder="Search..."
                @keyup.native="doChange"
                @keyup.native.enter="doSubmit"
                type="number"
                icon="magnify" v-model="phoneNumber">
            </b-input>
            <p class="control">
                <button class="button is-primary" @click="doSubmit">Search</button>
            </p>
        </b-field>

      <br />

      <div class="card" v-if="tableData && tableData.length">
        <b-table :data="tableData">
          <template slot-scope="props">
            <b-table-column field="tagId" label="tag" sortable>
                <span :class="'tag ' + tagClass[tagList[props.row.tagId].tagRoleId] ">{{ props.row.tagId }} {{ props.row.tagRoleId }}</span>
            </b-table-column>
            <b-table-column field="description" label="description" sortable>
                {{ tagList[props.row.tagId].description }}
            </b-table-column>
            <b-table-column field="role" label="role" sortable>
                {{ tagList[props.row.tagId].tagRoleId }}
            </b-table-column>
            <b-table-column field="ts" label="since" sortable>
                {{ fromNow(props.row.ts) }}
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div v-else>
        {{ resultMessage }}
      </div>
    </section>
  </div>
</template>

<script>
// import TitleBar from '@/components/TitleBar'
import moment from 'moment'
const crypto = require('crypto')
export default {
  name: 'Tables',
  // components: { TitleBar },
  data () {
    return {
      tagClass: {
        LOC: 'is-warning',
        GEN: 'is-info',
        MED: 'is-success'
      },
      resultMessage: '',
      phoneNumber: '',
      tableData: [],
      tagList: {}
    }
  },
  mounted () {
  },
  methods: {
    sha256 (str) {
      return crypto.createHash('sha256').update(str).digest('hex')
    },
    fromNow (str) {
      return moment(parseInt(str)).fromNow()
    },
    doChange () {
      this.resultMessage = ''
    },
    doSubmit () {
    }
  }
}
</script>
