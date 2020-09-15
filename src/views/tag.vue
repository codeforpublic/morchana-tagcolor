<template>
  <div>
    <section class="section">
      <title-bar>
        Tag List
        <div slot="button">
          <b-button @click="showModalCreateTag" class="button is-primary"
            >Create Tag</b-button
          >
        </div>
      </title-bar>

      <div class="card" v-if="tableData && tableData.length">
        <b-table :data="tableData">
          <template slot-scope="props">
            <b-table-column field="id" label="tag" sortable>
              <span :class="'tag ' + tagClass[props.row.tagRoleId]">{{
                props.row.id
              }}</span>
            </b-table-column>
            <b-table-column field="title" label="title" sortable>
              {{ props.row.title }}
            </b-table-column>
            <!-- <b-table-column field="description" label="description" sortable>
                {{ props.row.description }}
            </b-table-column> -->
            <b-table-column field="tagRoleId" label="role" sortable>
              <span :class="'tag ' + tagClass[props.row.tagRoleId]">{{
                props.row.tagRoleId
              }}</span>
            </b-table-column>
            <!-- <b-table-column custom-key="actions" class="is-actions-cell">
              <div class="buttons is-right">
                <button
                  class="button is-small is-primary"
                  type="button"
                  @click="doEdit(props.row)"
                >
                  <b-icon icon="pencil" custom-size="default" />
                </button>
              </div>
            </b-table-column> -->
          </template>
        </b-table>
      </div>
      <div v-else>
        {{ resultMessage }}
      </div>
    </section>

    <b-modal :active.sync="isComponentModalActive" trap-focus>
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Tag</p>
        </header>
        <section class="modal-card-body">
          <b-field horizontal label="Tag">
            <b-input
              :disabled="frm.disabled"
              type="text"
              v-model="frm.id"
              placeholder="A-Z 0-9 and -"
              required
              pattern="[A-Z0-9-]*"
              validation-message="Only `A-Z` `0-9` and `-` is allowed"
              @change.native="upperCase"
            >
            </b-input>
          </b-field>

          <b-field horizontal label="Title">
            <b-input
              type="text"
              v-model="frm.title"
              placeholder="คำอธิบาย tag เช่น ชื่อสถานที่ ชื่อโรงพยาบาล"
              required
            >
            </b-input>
          </b-field>
          <!--
            <b-field horizontal label="Description">
              <b-input
                type="text"
                v-model="frm.description"
                placeholder="Description"
                required
              >
              </b-input>
            </b-field> -->
          <b-field horizontal label="Role">
            <b-radio v-model="frm.tagRoleId" native-value="GEN">
              <span class="tag is-info">GEN</span>
              บุคคลทั่วไป
            </b-radio>
            <b-radio v-model="frm.tagRoleId" native-value="MED">
              <span class="tag is-success">MED</span>
              บุคคลากรทางการแพทย์
            </b-radio>
            <b-radio v-model="frm.tagRoleId" native-value="LOC">
              <span class="tag is-warning">LOC</span>
              สถานที่
            </b-radio>
            <!-- <b-select placeholder="Tag Role Id" v-model="frm.tagRoleId">
                <option value="MED">MED - บุคคลากรทางการแพทย์</option>
                <option value="LOC">LOC - สถานที่</option>
                <option value="GEN">GEN - บุคคลทั่วไป</option>
              </b-select> -->
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-primary"
            @click="doSave"
            :disabled="isLoading"
          >
            Save
          </button>
          <button
            class="button"
            type="button"
            @click="doClose"
            :disabled="isLoading"
          >
            Close
          </button>
          <p class="help-block" style="color:red">{{ modalMessage }}</p>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import TitleBar from '@/components/TitleBar'
import { mapState } from 'vuex'
export default {
  name: 'Tables',
  components: { TitleBar },
  computed: {
    ...mapState(['accessToken', 'tagList'])
  },
  data () {
    return {
      resultMessage: 'loading',
      modalMessage: '',
      tagClass: {
        LOC: 'is-warning',
        GEN: 'is-info',
        MED: 'is-success'
      },
      isLoading: false,
      tableData: [],
      isComponentModalActive: false,
      rowList: [],
      frm: {
        id: '',
        title: '',
        // description: '',
        tagRoleId: '',
        disabled: false
      }
    }
  },
  created () {
    this.getTagList()
  },
  methods: {
    upperCase () {
      this.frm.id = this.frm.id.toUpperCase()
    },
    doEdit (row) {
      this.modalMessage = ''
      this.frm = row
      this.frm.disabled = true
      this.isComponentModalActive = true
    },
    doClose () {
      this.modalMessage = ''
      this.isComponentModalActive = false
    },
    doSave () {
      const self = this

      self.isLoading = true
      if (self.frm.id && self.frm.title && self.frm.tagRoleId) {
        const postData = {
          id: self.frm.id,
          title: self.frm.title,
          tagRoleId: self.frm.tagRoleId
        }
        self.$API.post('morchanabackend', '/backend/createTag', { response: true, body: postData })
          .then(res => {
            self.$buefy.snackbar.open({
              message: res.data.error
                ? res.data.status + '! ' + res.data.error
                : res.data.status,
              type: res.data.error ? 'is-danger' : 'is-success',
              actionText: '[x]',
              queue: true
            })
          })
          .catch(err => {
            self.resultMessage = err.message
          })
          .finally(() => {
            self.frm = {}
            self.isLoading = false
            self.isComponentModalActive = false
          })

        // this.$axios
        //   .post('/createTag', postData)
        //   .then(res => {
        //     self.$buefy.snackbar.open({
        //       message: res.data.error
        //         ? res.data.status + '! ' + res.data.error
        //         : res.data.status,
        //       type: res.data.error ? 'is-danger' : 'is-success',
        //       actionText: '[x]',
        //       queue: true
        //     })
        //   })
        //   .catch(err => {
        //     self.resultMessage = err.message
        //   })
        //   .finally(() => {
        //     self.frm = {}
        //     self.isLoading = false
        //     self.isComponentModalActive = false
        //   })
        // console.log(postData)
      } else {
        this.modalMessage = 'Please fill out all fields.'
      }
    },
    showModalCreateTag () {
      this.frm = {
        tagRoleId: 'GEN',
        title: '',
        id: ''
        // description: ''
      }
      this.isComponentModalActive = true
    },
    getTagList () {
      const self = this
      self.$API.get('morchanabackend', '/backend/tags', { response: true })
        .then(res => {
          if (res.data) {
            self.tableData = res.data.tags
          } else {
            self.tableData = []
          }
        }).catch(err => {
          self.resultMessage = err.message
        })
    },
    getTagList2 () {
      const self = this
      this.$axios
        .get('/tags')
        .then(res => {
          if (res.data) {
            self.tableData = res.data.tags
          } else {
            self.tableData = []
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
