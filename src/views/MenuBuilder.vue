<template>
	<div class="root">
		<section class="container" style="margin-top: 2%;">
		  <h3 id="user-menu">Customize Menu:</h3>

		  	<!-- <div class="well">
		  		<div class="row">
		  			<div class="col-md-12">
                	<div class="row">
                		<!-- <div class="col-md-5">
                			<input type="text" class="form-control" placeholder="Enter API URL" name="apiUrl" v-model="apiUrl">		
                		</div> --
                		<div class="col-md-10">
                			<input type="text" class="form-control" placeholder="Enter Base URL" name="menuBaseUrl" v-model="menuBaseUrl">		
                		</div>
                		<div class="col-md-2">
                			<el-button type="primary" @click="updateMenuData()" :loading="fetchDataLoader">Fetch Data</el-button>
                			<!-- <button class="btn btn-primary" @click="updateMenuData()">Fetch Data</button> --
                		</div>
                	</div>
                	
		  			</div>
		  		</div>
		  	</div> -->
		  	
		  	<div class="row" style="margin-bottom: 70px;">
		  		<div class="col-md-12">
		  			<div class="dd" id="domenu-1">
					    <button id="domenu-add-item-btn" class="dd-new-item">+</button>
					    <!-- .dd-item-blueprint is a template for all .dd-item's -->

					    <li class="dd-item-blueprint">

					      <!-- @migrating-from 0.48.59 button container -->
					      <button class="collapse" data-action="collapse" type="button" style="display: none;">–</button>
					      <button class="expand" data-action="expand" type="button" style="display: none;">+</button>
					      <div class="dd-handle dd3-handle">Drag</div>
					      <div class="dd3-content">
					        <span class="item-name">[item_name]</span>
					      	<!-- <span><input type="checkbox" name="" /></span> -->
					        <!-- @migrating-from 0.13.29 button container-->
					        <!-- .dd-button-container will hide once an item enters the edit mode -->
					        <div class="dd-button-container">
					          <!-- @migrating-from 0.13.29 add button-->
					          <button class="menu-btn custom-button-example">&#x270E;</button>
					          <button class="menu-btn item-add">+</button>
					          <button class="menu-btn item-remove" data-confirm-class="item-remove-confirm">&times;</button>
					        </div>
					        <!-- Inside of .dd-edit-box you can add your custom input fields -->
					        <div class="dd-edit-box" style="display: none;">
					          <!-- data-placeholder has a higher priority than placeholder -->
					          <!-- data-placeholder can use token-values; when not present will be set to "" -->
					          <!-- data-default-value specifies a default value for the input; when not present will be set to "" -->
					          <input type="text" name="title" autocomplete="off" placeholder="Item"
					                 data-placeholder="Any nice idea for the title?"
					                 data-default-value="doMenu List Item. {?numeric.increment}">
					          <select name="custom-select" id="customSelect">
					            <!-- <option>select something...</option> -->
					            <optgroup label="Pages">
					              <option v-bind:value="item.pageLink" v-for="item in pageList">{{item.pageName}}</option>
					            </optgroup>
					            <optgroup label="Categories">
					              <option v-bind:value="item.categoryLink" v-for="item in categoriesList">{{item.categoryName}}</option>
					            </optgroup>
					          </select>
					          <!-- @migrating-from 0.13.29 an element ".end-edit" within ".dd-edit-box" exists the edit mode on click -->
					          <i class="end-edit">Save</i>
					        </div>
					      </div>
					    </li>

					    <ol class="dd-list"></ol>
					  </div>
		  		</div>





		  		<div class="">
		  			<div id="domenu-1-output" class="output-preview-container">
					    <!-- <h4>JSON Output Preview (User menu)</h4> -->
					    <textarea style="width: 100%; min-height: 300px; display: none;" name="jsonOutput" class="jsonOutput"></textarea>
					    <!-- <codemirror v-model="outputJson" :options="editorOption"></codemirror> -->
					    <!-- <vue-json-editor v-model="outputJson" :showBtns="false" @json-change="onJsonChange"></vue-json-editor> -->
					    <input style="display: none;" type="checkbox" name="keepchages" class="keepChanges" checked>
					    <!-- <br><br> -->
					    <!-- <input style="display:none;" type="button" name="clearLocalStorage" class="clearLocalStorage" value="Reset demo"> -->
					  </div>
		  		</div>
		  	</div>
		</section>
	</div>
</template>

<script>
// let domenu = null;
// import $ from 'jquery'

import axios from 'axios'

const config = require('../config');
import Cookies from 'js-cookie';

import domenu from 'domenu'

	export default {
		name: 'menuBuilder',
		data: () => ({
      outputJson: [],
      MenuJSON: [],
      menuBaseUrl: 'search.html?Category=',
      fetchDataLoader: false,
      pageList: [],
      categoriesList: []
    }),
    components: {
    },
		async created () {
			let configFileUrl = this.$store.state.fileUrl.replace(/\\/g, "\/");
			let urlparts = configFileUrl.split("/");
			let fileNameOrginal = urlparts[urlparts.length - 1];
			let fileName = '/' + urlparts[urlparts.length - 3] + '/' + urlparts[urlparts.length - 2] + '/' + urlparts[urlparts.length - 1];
			let fileNameParts = fileNameOrginal.split('.');
			let actualFileNameOnly = fileNameParts[0];
			var folderUrl = configFileUrl.replace(fileName, '');

			let configData = await axios.get( config.baseURL + '/project-configuration/' + urlparts[6], )
			.catch(function (error) {
			    console.log(error);
			});

			let allPages = configData.data.configData[1].pageSettings;
			for(let i = 0; i < allPages.length; i++){
				this.pageList.push({
					pageName: allPages[i].PageName,
					pageLink: allPages[i].PageName
				})
			}

			await this.fetchMenuData();

			let menuData;

			try {
		    	let responseConfig = await axios.get(config.baseURL + '/flows-dir-listing/0?path=' + folderUrl + '/public/assets/' + actualFileNameOnly + '.json').catch((err)=>{ console.log('Error:', err); });
		    	console.log(responseConfig.data)
				if(responseConfig.data){
					menuData = responseConfig.data;
					this.initMenu(menuData);
				} else {
					menuData = [{"id":1,"title":"Home","customSelect":"index.html","__domenu_params":{},"select2ScrollPosition":{"x":0,"y":0}}];
					this.initMenu(menuData);	
				}
			}
			catch(err) {
				menuData = '[{"id":1,"title":"Home","customSelect":"index.html","__domenu_params":{},"select2ScrollPosition":{"x":0,"y":0}}]';
				this.initMenu(menuData);
			}

			
		},

		methods: {
			initMenu(menuData){

				let montedself = this;

				var $domenu        = $('#domenu-1'),
		        domenu             = $('#domenu-1').domenu(),
		        $outputContainer   = $('#domenu-1-output'),
		        $jsonOutput        = $outputContainer.find('.jsonOutput'),
		        $keepChanges       = $outputContainer.find('.keepChanges'),
		        $clearLocalStorage = $outputContainer.find('.clearLocalStorage');

				    $domenu.domenu({
			        slideAnimationDuration: 0,
			        allowListMerging: ['domenu-2'],
			        select2:                {
			          support: true,
			          params:  {
			            tags: true
			          }
			        },
			        data: menuData
			      })
			      // Example: initializing functionality of a custom button #21
			      .onCreateItem(function(blueprint) {
			        // We look with jQuery for our custom button we denoted with class "custom-button-example"
			        // Note 1: blueprint holds a reference of the element which is about to be added the list
			        var customButton = $(blueprint).find('.custom-button-example');

			        // Here we define our custom functionality for the button,
			        // we will forward the click to .dd3-content span and let
			        // doMenu handle the rest
			        customButton.click(function() {
			          blueprint.find('.dd3-content span').first().click();
			        });
			      })
			      // Now every element which will be parsed will go through our onCreateItem event listener, and therefore
			      // initialize the functionality our custom button
			      .parseJson()
			      .on(['onItemCollapsed', 'onItemExpanded', 'onItemAdded', 'onSaveEditBoxInput', 'onItemDrop', 'onItemDrag', 'onItemRemoved', 'onItemEndEdit'], function(a, b, c) {
			        $jsonOutput.val(domenu.toJson());
			        montedself.outputJson = JSON.parse(domenu.toJson());
			      })
			      .onToJson(function() {
			      });

			    // Init textarea
			    $jsonOutput.val(domenu.toJson());

			    // var $optionGroup = $("#customSelect").find('optgroup[label="Categories"]');

			    // if(this.categoriesList.length > 0){
			    // 	for(var i = 0; i < this.categoriesList.length; i++){
			    // 		console.log(this.categoriesList[i].categoryLink)
					  //   $optionGroup.append('<option value="' + this.categoriesList[i].categoryLink + '">' + this.categoriesList[i].categoryName + '</option>');
				   //  }
			    // }
			  
			},
			
			getMenuJson: function () {
				this.$store.state.content = $('.jsonOutput').val();
			},

			async fetchMenuData () {

				// this.fetchDataLoader = true;

				let menuData;
				let vid = '';

				let folderPath = this.$store.state.fileUrl.replace(/\\/g, "\/");
				let folderName = folderPath.split('/')[6];

				await axios.get(config.baseURL + '/project-configuration/' + folderName , {
				})
				.then(function (response) {
				    let configs = response.data.configData;
				    vid = configs[1].projectSettings[0].ProjectVId.vid;
				})
				.catch(function (error) {
				    console.log(error);
				    // this.fetchDataLoader = false;
				});

				if(vid){
					await axios.get(config.menuCategoriesUrl, {
				    headers: {
				    	Authorization: Cookies.get('auth_token'),
				    	vid: vid
				    }
					})
					.then((res) => {
						let menuJson = [];
				    let categories = res.data.aggregations.group_by_category.buckets;

				    for(let i = 0; i < categories.length; i++){
				    	let urlName = categories[i].key.toLowerCase().replace(/ /g, '-');

				    	this.categoriesList.push({
				    		categoryName: categories[i].key.toUpperCase(),
				    		categoryLink: this.menuBaseUrl + urlName
				    	});

				      //let menuItem = {
							// 			    "id": i,
							// 			    "title": categories[i].key.toUpperCase(),
							// 			    "customSelect": this.menuBaseUrl + urlName,
							// 			    "__domenu_params": {}
							// 			    ,
							// 			    "select2ScrollPosition": {
							// 			        "x": 0, "y": 0
							// 			    }
							// 			};

							// menuJson.push(menuItem);								
			    	}

			    	// menuData = JSON.stringify(menuJson);
			    	// this.fetchDataLoader = false;
			    	// this.initMenu(menuData);
					})
					.catch((e) => {
				    this.$message({
				        showClose: true,
				        message: 'Failed! Please try again.',
				        type: 'error'
				    });
				    console.log(e);
				    // this.fetchDataLoader = false;
					})
				} else {
					this.$message({
				        showClose: true,
				        message: 'Please set "VID" in Project settings to get all of your category list.',
				        type: 'info'
				    });
				}
			}
		}
	}
</script>






<style>
	/**
	 * @license Copyright © 2016 Mateusz Zawartka
	 * @version 0.99.77
	 */
	.dd {
	  position: relative;
	  display: inline-block;
	  margin: 0;
	  padding: 0;
	  width: 100%;
	  list-style:  none;
	  font-family: 'Helvetica Neue', Arial, sans-serif;
	  font-size:   13px;
	  line-height: 20px;
	}

	.dd-edit-box input,
	  /*.dd-edit-box select,*/
	.dd-edit-box textarea {
	  border:             none;
	  -webkit-box-shadow: none;
	  -moz-box-shadow:    none;
	  box-shadow:         none;
	  background:         transparent;
	  text-overflow:      ellipsis;
	  outline:            none;
	  font-size:          13px;
	  color:              #444;
	  text-shadow:        0 1px 0 #fff;
	  width:              30%;
	}

	.dd-edit-box input::selection,
	.dd-edit-box textarea::selection {
	  color: #fff;
	  background: #0e90d2;
	}

	.dd-edit-box input:focus,
	.dd-edit-box textarea:focus {
	  text-shadow: none;
	}
	.dd-button-container .custom-button-example {
	  color: #000;
	  text-align: center;
	  padding: 1px 4px;
	}

	.dd-edit-box select {
	  width: 30%;
	}

	.dd-edit-box > * {
	  vertical-align: top;
	}

	.dd-edit-box input, .dd-edit-box select, .dd-edit-box textarea {
	  margin-bottom: 0;
	}

	.dd-edit-box {
	  position: relative;
	}

	.dd-edit-box i {
	  right:    0;
	  overflow: hidden;
	  cursor:   pointer;
	  position: absolute;
	  font-style: normal;
	}

	.dd-item-blueprint {
	  display: none;
	}

	.dd > .dd-list {
	  min-height: 80px;
	}

	.dd-list {
	  display:    block;
	  position:   relative;
	  margin:     0;
	  padding:    0;
	  list-style: none;
	}

	.dd-list .dd-list {
	  left: 30px;
	  margin-right: 30px;
	}

	.dd-collapsed .dd-list {
	  display: none;
	}

	.dd-item,
	.dd-empty,
	.dd-placeholder {
	  text-shadow: 0 1px 0 #fff;
	  display:     block;
	  position:    relative;
	  margin:      0;
	  padding:     0;
	  min-height:  20px;
	  font-size:   13px;
	  line-height: 20px;
	}

	.dd-handle {
	  cursor:                move;
	  display:               block;
	  margin:                5px 0;
	  padding:               5px 10px;
	  color:                 #333;
	  text-decoration:       none;
	  font-weight:           bold;
	  border:                1px solid #aaa;
	  background:            #c8c8c8;
	  background:            -webkit-linear-gradient(top, #c8c8c8 0%, #8c8c8c 100%);
	  background:            -moz-linear-gradient(top, #c8c8c8 0%, #8c8c8c 100%);
	  background:            linear-gradient(top, #c8c8c8 0%, #8c8c8c 100%);
	  -webkit-border-radius: 3px;
	  border-radius:         3px;
	  box-sizing:            border-box;
	  -moz-box-sizing:       border-box;
	}

	.dd-handle:hover {
	  color:      #2ea8e5;
	  background: #fff;
	}

	.dd-item > button {
	  display:     inline-block;
	  position:    relative;
	  cursor:      pointer;
	  float:       left;
	  width:       24px;
	  height:      20px;
	  margin:      5px 5px 5px 30px;
	  padding:     0;
	  white-space: nowrap;
	  overflow:    hidden;
	  border:      0;
	  background:  transparent;
	  font-size:   12px;
	  line-height: 1;
	  text-align:  center;
	  font-weight: bold;
	  color:       black;
	}

	.dd.domenu .dd-new-item {
	    background: transparent;
	    border: 3px dotted #8F8F8F;
	    border-radius: 11px;
	    width: 100%;
	    height: 35px;
	    font-size: 29px;
	    color: #8F8F8F;
	    outline: none;
	}

	/* @since > 0.13.29 */
	.dd-item .item-remove,
	.dd-item .item-remove-confirm,
	.dd-item .item-add {
	  outline: none;
	}

	.dd-item .dd-button-container button {
	  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.51), rgba(0, 0, 0, 0.14));
	  border:           1px solid #898989;
	  border-radius:    2px;
	  font:             normal 12px/18px Helvetica, Lato, Arial sans-serif;
	  cursor:           pointer;
	}

	.dd-item .dd-button-container .item-add {
	  background-color: #55b3ff;
	  border-color:     #376f9c;
	  color:            #ffffff;
	  text-shadow:      0 1px 0 #2b77b5;
	  box-shadow:       inset 0 1px 0 #cfe9ff;
	}

	.dd-item .dd-button-container .item-add:active {
	  box-shadow: inset 0 1px 3px #376f9c;
	}

	.dd-item .dd-button-container .item-remove {
	  background-color: #ff5555;
	  border-color:     #a54b4b;
	  color:            #5a1111;
	  text-shadow:      0 1px 0 #ffc0c0;
	  box-shadow:       inset 0 1px 0 #ffc0c0;
	  transition:       background-color 0.35s;
	}

	.dd-item .dd-button-container .item-remove:active {

	  box-shadow: inset 0 1px 5px #a54b4b;
	}

	.dd-item .dd-button-container .item-remove-confirm {

	  background-color: #ffa155;

	  transition:       background-color 0.35s;

	  border-color:     #ad7232;
	}

	.dd-item .dd-button-container .item-remove-confirm:active {

	}

	.item-remove-confirm {
	  background: #ffce66;
	}

	.dd-item .dd-button-container {
	  position: absolute;
	  height:   19px;
	  padding:  0 5px;
	  top:      4px;
	  overflow: visible;
	  display:  none;
	  right:    0;
	}

	/* end @since > 0.13.29 */

	.dd3-item > button:first-child {
	  margin-left: 30px;
	}

	.dd-item > button:before {
	  display:     block;
	  position:    absolute;
	  width:       100%;
	  text-align:  center;
	  text-indent: 0;
	}

	.dd-placeholder,
	.dd-empty {
	  margin:          5px 0;
	  padding:         0;
	  min-height:      30px;
	  background: #D6F2FF;
	  border: 1px dashed #6C9AB1;
	  box-sizing:      border-box;
	  -moz-box-sizing: border-box;
	}

	.dd-placeholder.max-depth {
	  background: #ffb3b7;
	  border: 1px dashed #b14444;
	}

	.dd-empty {
	  border:              1px dashed #bbb;
	  min-height:          100px;
	  background-color:    #e5e5e5;
	  background-image:    -webkit-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff),
	                       -webkit-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
	  background-image:    -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff),
	                       -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
	  background-image:    linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff),
	                       linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
	  background-size:     60px 60px;
	  background-position: 0 0, 30px 30px;
	}

	.dd-dragel {
	  height:         60px;
	  position:       absolute;
	  pointer-events: none;
	  z-index:        9999;
	}

	.dd-dragel > .dd-item .dd-handle {
	  margin-top: 0;
	}

	.dd-dragel .dd-handle {
	  -webkit-box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, .1);
	  box-shadow:         2px 4px 6px 0 rgba(0, 0, 0, .1);
	}

	/**
	 * doMenu Draggable Handles
	 */
	.dd3-content {
	  display:               block;
	  height:                100%;
	  margin:                5px 0;
	  padding:               5px 10px 5px 40px;
	  color:                 #333;
	  text-decoration:       none;
	  font-weight:           bold;
	  border:                1px solid #ccc;
	  border:                1px solid #898989;
	  background:            #fafafa;
	  background:            -webkit-linear-gradient(top, #f4f4f4 10%, #c9c9c9 100%);
	  background:            -moz-linear-gradient(top, #f4f4f4 10%, #c9c9c9 100%);
	  background:            linear-gradient(top, #f4f4f4 10%, #c9c9c9 100%);
	  -webkit-border-radius: 3px;
	  border-radius:         3px;
	  box-sizing:            border-box;
	  -moz-box-sizing:       border-box;
	}

	.dd3-content:hover {
	  color:      #2ea8e5;
	  background: #c8c8c8;
	  background: -webkit-linear-gradient(top, #e5e5e5 10%, #ffffff 100%);
	  background: -moz-linear-gradient(top, #e5e5e5 10%, #ffffff 100%);
	  background: linear-gradient(top, #e5e5e5 10%, #ffffff 100%);
	}

	.dd-dragel > .dd3-item > .dd3-content {
	  margin: 0;
	}

	.dd3-handle {
	  position:                   absolute;
	  margin:                     0;
	  left:                       0;
	  top:                        0;
	  cursor:                     move;
	  width:                      30px;
	  text-indent:                100%;
	  white-space:                nowrap;
	  overflow:                   hidden;
	  border:                     1px solid #807b7b;
	  text-shadow:                0 1px 0 #807b7b;
	  background:                 #c8c8c8;
	  background:                 -webkit-linear-gradient(top, #c8c8c8 0%, #8c8c8c 100%);
	  background:                 -moz-linear-gradient(top, #c8c8c8 0%, #8c8c8c 100%);
	  background:                 linear-gradient(top, #c8c8c8 0%, #8c8c8c 100%);
	  border-top-right-radius:    0;
	  border-bottom-right-radius: 0;
	}

	.dd3-handle:before {
	  content:     '\2263';
	  display:     block;
	  position:    absolute;
	  left:        0;
	  top:         3px;
	  width:       100%;
	  text-align:  center;
	  text-indent: 0;
	  color:       #fff;
	  font-size:   20px;
	  font-weight: normal;
	}

	.dd3-handle:hover {
	  background: #c8c8c8;
	  background: -webkit-linear-gradient(top, #c8c8c8 0%, #8c8c8c 100%);
	  background: -moz-linear-gradient(top, #c8c8c8 0%, #8c8c8c 100%);
	  background: linear-gradient(top, #c8c8c8 0%, #8c8c8c 100%);
	}

	.dd3-content:hover .dd-button-container {
	  display:    block;
	  transition: display 2s;
	}

	.dd .dd-new-item {
	    width: 100%;
	    border: 2px dashed #BDBDBD;
	    background: transparent;
	    border-radius: 3px;
	    font-size: 21px;
	    color: #BDBDBD;
	    cursor: pointer;
	    transition: border 0.35s ease 0s, color 0.35s ease 0s;
	    outline: none;
	}

	.dd .dd-new-item:hover {
	    border: 2px dashed #595858;
	    color: #595858;
	    transition: border 0.35s ease 0s, color 0.35s ease 0s;
	}

	.end-edit{
		background-color: #2095F2;
		padding: 3px 10px;
		color: #fff;
		font-weight: normal;
		text-shadow: none;
		border-radius: 3px;
		border: 1px solid #999;
	}

	.menu-btn{
		width: 20px;
		height: 20px;
		font-weight: bolder;
	}
</style>