<template>
	<div>
		<div class="settings_header">
			<Button @click="goToSettingsList">All Account Settings</Button>
		</div>
		<div class="container" style="background: white;min-height: 320px;padding:10px">
			<div class="row">
				<div class="col-md-12" style="margin-top: 20px;">
					<Form class="form" label-position="left" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
						<FormItem label="Custom Configuration" prop="configuration">
							<Input v-model="formValidate.configuration" placeholder="Enter Name"></Input>
						</FormItem>
						</FormItem>
						<FormItem label="Gateway" prop="gateway">
							<Select v-model="formValidate.gateway" style="width:100%;text-align:left">
							<Option  value='stripe'>Stripe</Option>
							<Option  value='auth'>AuthrizedDotNet</Option>
							<Option value='paypal'>PayPal</Option>
							</Select>
						</FormItem>
						<!-- <FormItem label="Secret" v-if="formValidate.gateway=='stripe'" prop='x_api_token'>
							<Input v-model="formValidate.x_api_token" placeholder="Enter secret"></Input>
						</FormItem>
						<FormItem label="Api_Login_id" v-if="formValidate.gateway=='auth'" prop='x_api_token'>
							<Input v-model="formValidate.x_api_token" placeholder="Enter Api_Login_id"></Input>
						</FormItem>
						<FormItem label="Api_Client_Id" v-if="formValidate.gateway=='paypal'" prop='x_api_token'>
							<Input v-model="formValidate.x_api_token" placeholder="Enter Api_Client_Id"></Input>
						</FormItem>


						<FormItem label="Transaction_key" v-if="formValidate.gateway == 'auth' "  prop='x_api_login'>
							<Input v-model="formValidate.x_api_login" placeholder="Enter Transaction_key"></Input>
						</FormItem>
						<FormItem label="Secret" v-if="formValidate.gateway == 'paypal'"  prop='x_api_login'>
							<Input v-model="formValidate.x_api_login" placeholder="Enter Secret"></Input>
						</FormItem> -->


						<FormItem label="Secret key" v-if="formValidate.gateway == 'stripe'" prop="Secret_Key">
							<Input v-model="formValidate.Secret_Key" placeholder="Enter Secret key"></Input>
						</FormItem>
						<!--<FormItem label="x_api_token" v-if="formValidate.gateway">
							<Input v-model="formValidate.x_api_token" placeholder="Enter x_api_token"></Input>
						</FormItem>-->
						<FormItem label="Transaction Key" v-if="formValidate.gateway == 'auth'" prop="Transaction_Key">
							<Input v-model="formValidate.Transaction_Key" placeholder="Enter Transaction Key"></Input>
						</FormItem>
						<FormItem label="Signature Key" v-if="formValidate.gateway == 'auth'" prop="Signature_Key">
							<Input v-model="formValidate.Signature_Key" placeholder="Enter Signature Key"></Input>
						</FormItem>
						<FormItem label="Client Id" v-if="formValidate.gateway == 'paypal'" prop="Client_Id">
							<Input v-model="formValidate.Client_Id" placeholder="Enter Client Id"></Input>
						</FormItem>
						<FormItem label="Secret" v-if="formValidate.gateway == 'paypal'" prop="Secret">
							<Input v-model="formValidate.Secret" placeholder="Enter Secret"></Input>
						</FormItem>
						<!--<FormItem label="x_api_login" v-if="formValidate.gateway == 'auth' || formValidate.gateway == 'paypal'">
							<Input v-model="formValidate.x_api_login" placeholder="Enter x_api_login"></Input>
						</FormItem>-->
						<div style="text-align:center;">
							<Button type="primary" @click="handleSubmit('formValidate')" :loading="loading">Submit</Button>
							<Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px;">Reset</Button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	let feathersUrl =  config.default.serviceUrl;
	import Cookies from 'js-cookie';
	import config from './../../config.js'
	import _ from 'lodash'
	import Vue from 'vue'
	import axios from "axios"
	import swal from 'sweetalert';

	export default {
		data () {
			return {
				loading: false,
				formValidate:{
					configuration:'',
					gateway:'',
					Secret_Key: '',
					Transaction_Key: '',
					Signature_Key: '',
					Client_Id: '',
					Secret: ''
					// x_api_token:'',
					// x_api_login:''
				},
				configs: [],
				ruleValidate: {
					gateway: [
						{ required: true, message: 'Please select gateway', trigger: 'blur' }
					],
					Secret_Key: [
						{ required: true, message: 'The Secret_Key cannot be empty', trigger: 'blur' }
					],
					Transaction_Key: [
						{ required: true, message: 'The Transaction_Key cannot be empty', trigger: 'blur' }
					],
					Signature_Key: [
						{ required: true, message: 'The Signature_Key cannot be empty', trigger: 'blur' }
					],
					Client_Id: [
						{ required: true, message: 'The Client_Id cannot be empty', trigger: 'blur' }
					],
					Secret: [
						{ required: true, message: 'The Secret cannot be empty', trigger: 'blur' }
					],
					// x_api_login: [
					// 	{ required: true, message: 'The x_api_login cannot be empty', trigger: 'blur' }
					// ],
					// x_api_token: [
					// 	{ required: true, message: 'The x_api_token cannot be empty', trigger: 'blur' }
					// ]
				}
			}
		},
		methods: {
			goToSettingsList(){
				this.$emit('addNewConfig','settings');
				// this.$router.push({
				// 	name: 'Settings'
				// 	// params: { tabName: 'Online Payment' }

				// });
			},
			handleSubmit (name) {
				var self = this
				this.$refs[name].validate((valid) => {
					if (valid) {
							self.loading = true;
							var data000 =this.formValidate.configuration;
							// console.log("data000----------------------------->",data000)
							var checkConfig;
							this.$Modal.confirm({
								title: '',
								content: '',
								width: 500,
								okText: 'Agree',
								cancelText: 'Disagree',
								render: (h) => {
									return h('div', {
									}, [
										h('span', {
											style:{
											fontSize:'25px'
											},
										props: {
										},
										on: {
											input: (val) => {
											}
										}
										},'This Payment Credential will be configured for ' + data000),
										h('div', {
										style:{
											height:'50px'
											}
									})
									])
								},
								onOk: () => {
									var configId = this.formValidate.configuration
									let patchData = _.cloneDeep(this.formValidate)
									delete patchData.configuration;
									if (this.formValidate.gateway == 'stripe') {
										delete patchData.Transaction_Key
										delete patchData.Signature_Key
										delete patchData.Client_Id
										delete patchData.Secret
									}
									if (this.formValidate.gateway == 'auth') {
										delete patchData.Secret_Key
										delete patchData.Client_Id
										delete patchData.Secret
									}
									if (this.formValidate.gateway == 'paypal') {
										delete patchData.Secret_Key
										delete patchData.Transaction_Key
										delete patchData.Signature_Key
									}
									let gateway = this.formValidate.gateway;
									// console.log("gateway",gateway);
									var params = {'online_payment': {}}
									delete patchData.gateway;
									patchData['isDefault'] = true;
									patchData['isDeleted'] = false;
									params.online_payment[gateway] = [patchData];
									 let  data = {
                                    // "configName": "Custom Configuration",
                                    "configName":configId,
                                    "domain" : 'custom',
                                    "isActive":true,
                                    "isDeleated":false,
                                    "online_payment":params.online_payment,
                                    "subscriptionId":Cookies.get('subscriptionId'),
                                    "customer_url":'https://api.'+config.domainkey+'/crm/customcustomer',
                                    "invoice_url": 'https://api.'+config.domainkey+'/crm/custominvoice',

                            		}
                            		// console.log('data',data)
									axios({
										method: 'post',
										url: feathersUrl +'buildersettings',
										headers:{
											'Authorization' : Cookies.get('auth_token'),
                        					'subscriptionId' : Cookies.get('subscriptionId')
										},
										data: data
									})  
									.then(function (response) {
										console.log('response',response)
										if(response.data=='Custom Config is already available for this user'){
											swal("Warning", "Custom Config is already available for this user");
										}
										self.handleReset(name);
										self.loading = false;
										self.$emit('addNewConfig','settings');
									})
									.catch(function (error) {
										self.loading = false;
										console.log('error',error)
									})
						
									
								},
								onCancel: () => {
									self.loading = false;
								}
							})
					} 
					else {
						self.loading = false;
						this.$Message.error('Please fill up all the fields correctly');
					}
				})
			},
			handleReset (name) {
			    this.$refs[name].resetFields();
				this.formValidate.gateway = '',
				this.formValidate.x_api_login = '',
				this.formValidate.x_api_token = ''
				this.formValidate.configuration = ''
			},
			async settingData () {
				let self = this
				await axios.get(config.default.serviceUrl + 'settings?isActive=true', {
					headers:{
						'Authorization' : Cookies.get('auth_token'),
						'subscriptionId' : Cookies.get('subscriptionId')
					}
				})
				.then(function (response) {
					// console.log("response >>>>>>>>>>>>>>>>",response)
					if (response.data.data.length != 0)
					{
						var newConf = [];
						// console.log("self.configs---------------->before",newConf)
						response.data.data.forEach(item => {
							newConf.push(item);
						})
						self.configs = _.sortBy(newConf, ['configName']);
						// console.log("self.configs---------------->after",self.configs)
					}
					else{

					// self.$Modal.warning({
					// title: 'No Configuration available',
					// okText : "Go to Settings",
					// content: '<h3 style="font-family: initial;">Please navigate to settings and configure or activate at least one Xero or Quickbook account </h3>',
					// onOk: () => {
					//   self.$router.push({

					}
				})
				.catch(function (error) {
					console.log("error",error.response);
					if(error.response.status == 401){
						let location = psl.parse(window.location.hostname)
						location = location.domain === null ? location.input : location.domain
						
						Cookies.remove('auth_token' ,{domain: location}) 
						this.$store.commit('logout', this);
						
						// this.$router.push({
						// 	name: 'login'
						// });
						this.$emit('addNewConfig','settings');
					}else if(error.response.status == 403){
						self.$Notice.error(
						{duration:0, 
						title: error.response.statusText,
						desc:error.response.data.message+'. Please <a href="'+config.default.flowzDashboardUrl+'/subscription-list" target="_blank">Subscribe</a>'}
						);
					}
				});
			
			},
		},
		computed: {
		},
		mounted() {
			this.settingData();
		}
}
</script>

<style scoped>
	.settings_header{
		padding : 10px;
		text-align:right;
		background: #cacaca;
		width:100%;
		margin:14px 2px;
	}
</style>