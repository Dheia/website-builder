<template>
  <div class="bannertypenew">
   <Row >
      <div style="padding-bottom: 10px;">
        <h2 v-if="formItem.id">Edit Category</h2>
        <h2 v-else>Add Category</h2>
      </div>
   </Row>
   <Row style="border: 1px solid #C0C0C0; padding: 20px">
     <Form :model="formItem" :label-width="300" ref="formItem" :rules="rulesformItem">
        <FormItem label="Website" prop="website_id" filterable>
            <Select v-model="formItem.website_id" placeholder="Select Website" :disabled="isdisable">
                <Option v-for="item in webOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>      
        <FormItem label="Category Name" prop="bt_name">
            <Input v-model.trim="formItem.bt_name" placeholder="Category Name"></Input>
        </FormItem>
        <!-- <FormItem label="Select Banner Type Category">
            <Select v-model="formItem.bt_category">
                <Option value="search_page">Search Page</Option>
                <Option value="home_page">Home Page</Option>
                <Option value="detail_page">Detail Page</Option>
                <Option value="brand_slider">Brand Slider</Option>
            </Select>
        </FormItem> -->
        <FormItem  v-if="formItem.id" label="Status">
            <i-switch v-model="formItem.status" size="large">
                <span slot="open">On</span>
                <span slot="close">Off</span>
            </i-switch>
        </FormItem>
        <FormItem>
            <Button v-if="formItem.id" type="primary" @click="handleEdit('formItem')">Update</Button>
            <Button v-else type="primary" @click="handleSubmit('formItem')">Submit</Button>
            <Button type="ghost" style="margin-left: 8px" @click="handleCancel">Cancel</Button>
        </FormItem>
    </Form>
   </Row>
  </div>
</template>

<script>
import axios from 'axios'
import config from '../../config'
import Cookies from 'js-cookie';
import _ from 'lodash'

let baseUrl = config.baseURL
let bannertypeUrl = baseUrl + '/bannertype'
let bannersUrl = config.baseURL + '/banners'

export default {
  name: 'bannertypenew',
  props: {
    bdata: Object
  },
  data () {
    const validateBtname = async(rule, value, callback) => {
      let userId = Cookies.get('userDetailId')
      if (value !== '' && this.formItem.website_id !== '') {
        let resp = await (axios.get(bannertypeUrl + '?userId=' + userId +'&website_id=' + this.formItem.website_id + '&bt_name=' + value).then(res => {
          if (this.formItem.id) {
            let arr = _.reject(res.data.data, {bt_name: this.btname})
            return arr
          } else {
            return res.data.data
          }
        }).catch(err => {
          return []
        }))
        if (resp.length > 0) {
          callback(new Error('Banner Type Name already Exist in Selected Website. Please try another.'))
        } else {
          callback();
        }
      }
    };
    return {
      formItem: {
          website_id: '',
          bt_name: '',
          bt_category: '',
          status: true,
          createdAt: '',
          userId: Cookies.get('userDetailId')
      },
      rulesformItem: {
        website_id: [
          { required: true, message: 'Please select the Website', trigger: 'change' }
        ],
        bt_name: [
          { required: true, message: 'Please fill in the Banner Category Name', trigger: 'blur' },
          { validator: validateBtname, trigger: 'blur' }
        ]
      },
      webOptions: [],
      isdisable: false,
      btname: '',
      status: false
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formItem.createdAt = new Date()
          axios.post(bannertypeUrl, this.formItem).then(res => {
            this.$Notice.success({title: 'Success', desc: 'Successfully saved.', duration: 3})
            this.$emit('updateBanner', {type: 'bannertypelist'})
          }).catch(err => {
            console.log('error', err)
            this.$Notice.error({title: 'Error', desc: 'Not saved.', duration: 3})
          })
        }
      })
    },
    handleEdit (name) {
      let item = _.cloneDeep(this.formItem)
      delete item.id
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          item.createdAt = new Date()
          if (this.status === item.status) {
            console.log('No Status Change')
            axios.put(bannertypeUrl + '/' + this.formItem.id, item).then(res => {
              this.$Notice.success({title: 'Success!!', desc: 'Successfully Edited.', duration: 3})
              this.$emit('updateBanner', {type: 'bannertypelist'})
            }).catch(err => {
              console.log('Error', err)
            })
          } else {
            let res = await this.handleTagClick(this.formItem.id, item.status)
            if (res.status === 'success') {
              if (res.msg === 'found') {
                console.log('item.status', item.status, this.formItem.status)
                this.$Modal.confirm({
                  title: 'Confirm',
                  content: '<p><b style="color: #f90;">'+ res.data.length + ((res.data.length === 1) ? ' Banner' : ' Banners') +' </b> found with <b>'+ item.bt_name +'</b>. </p><p>Are you sure you want to '+(item.status ? 'ACTIVE': 'INACTIVE')+' all?</p>',
                  loading: true,
                  onOk: async () => {
                    for (let item1 of res.data) {
                      let s = await axios.patch(bannersUrl + '/' + item1.id, {banner_status: item.status})
                    }
                    await axios.patch(bannertypeUrl + '/' + this.formItem.id, {status: item.status}).then(res => {
                      this.$Notice.success({ title: 'Success!', desc: '', duration: 3})
                      this.$Modal.remove()
                      this.$emit('updateBanner', {type: 'bannertypelist'})
                    }).catch(err => {
                      console.log('Error', err)
                      this.$Notice.error({ title: 'Error', desc: '', duration: 3})
                      this.$Modal.remove()
                    })
                  }
                })
              } else {
                await axios.patch(bannertypeUrl + '/' + this.formItem.id, {status: item.status}).then(res => {
                  this.$Notice.success({ title: 'Success!', desc: '', duration: 3})
                  this.$emit('updateBanner', {type: 'bannertypelist'})
                }).catch(err => {
                  console.log('Error', err)
                  this.$Notice.error({ title: 'Error', desc: '', duration: 3})
                })
              }
            } else {
              this.$Notice.error({ title: 'Error', desc: '', duration: 3})
            }
          }
        }
      })
    },
    handleCancel () {
      this.$emit('updateBanner', {type: 'bannertypelist'})
    },
    async handleTagClick(id, status) {
      let userId = Cookies.get('userDetailId')
      let resp = await axios.get(bannersUrl + '?userId=' + userId + '&banner_type=' + id).then(res => {
        if (res.data.data.length > 0) {
          return {status: 'success', msg: 'found', data: res.data.data}
        } else {
          return {status: 'success', msg: 'notfound'}
        }
      }).catch(err => {
        return {status: 'error'}
      })
      return resp
    }
  },
  mounted () {
    let userId = Cookies.get('userDetailId')
    if (userId !== '' && userId !== undefined) {
      this.$Spin.show();
      axios.get(baseUrl + '/project-configuration?userId=' + userId).then(res => {
        for (let item of res.data.data) {
          this.webOptions.push({label: item.websiteName, value: item.id})
        }
        this.$Spin.hide();
      }).catch(err => {
        this.$Spin.hide();
      })
    }
    if (!_.isEmpty(this.bdata)) {
      if (this.bdata.type === 'bannertype' && this.bdata.id !== '') {
        axios.get(bannertypeUrl + '/' + this.bdata.id).then(res => {
          this.formItem = res.data
          this.btname = res.data.bt_name
          this.isdisable = true
          this.status = res.data.status
        }).catch(err => {
          console.log('Error::', err)
        })
      }
    }
  }
}
</script>

<style scoped>
.bannertypenew {
  padding: 40px;
}
</style>
