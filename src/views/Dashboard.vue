<template>
  <div class="HomePage">

    <div class="skewed-bg">
      <div class="content">
        <h1 class="title">Welcome to Website Builder</h1>
        <p class="text">Get started with creating new website or updating existing.</p>
        <div class="row">
          <div class="col-md-4">
          </div>
          <div class="col-md-4">
            <el-select v-model="value" @change="changeSubscription()" placeholder="Select Your Subscription" style="transform: scaleX(1); display: block;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select> 
          </div>
          <div class="col-md-4">
          </div>
        </div>
      </div>
    </div>

    <div class="start-content">
      <div class="container">
        <div class="row">
          <!-- <div class="col-md-4">
            <a href="#" class="website-add">
              <div class="website-card" style="text-align: center; padding-top: 70px;">
                  <i class="fa fa-plus fa-2x"></i>
                  <h3>Add New</h3>
              </div>
            </a>
          </div> -->


          <div class="col-md-4" v-for="items in websites">
            <a href="#" class="website-edit">
              <div class="website-card">
                <h3>{{ items.website }}</h3>
                <small>{{ items.id }}</small>
                 <el-tooltip class="item" effect="dark" content="Open Preview" placement="top">
                  <a href="#" class="btn btn-primary btn-link" @click="openLink(items.url)"><i class="fa fa-link"></i></a>
                </el-tooltip>
              </div>
            </a>
          </div>

          <!-- <div class="col-md-4">
            <a href="#" class="website-edit">
              <div class="website-card">
                <h3>Website Name 2</h3>
                <span>Desc</span>
              </div>
            </a>
          </div>

          <div class="col-md-4">
            <a href="#" class="website-edit">
              <div class="website-card">
                <h3>Website Name 3</h3>
                <span>Desc</span>
              </div>
            </a>
          </div>

          <div class="col-md-4">
            <a href="#" class="website-edit">
              <div class="website-card">
                <h3>Website Name 4</h3>
                <span>Desc</span>
              </div>
            </a>
          </div> -->

        </div>
      </div>
    </div>

    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span id="website">
          <h1 class='elegantshadow'>Websites </h1> 
        </span>

        <div class="row">
          <div class="col-md-4">
          </div>
          <div class="col-md-4">
            <el-select v-model="value" @change="changeSubscription()" placeholder="Select Your Subscription" style="transform: scaleX(1); display: block;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value" 
              :class="subscriptionSelect">
            </el-option>
            </el-select> 
          </div>
          <div class="col-md-4">
          </div>
        </div>
        
      </div>
          <div v-for="items in websites" class="list-type5"> 
        <ol>
            <a href="#" style="color:white;" @click="openLink(items.url)" target="_blank"> <li>{{ items.website }} </li></a>
        </ol>
          </div>
    </el-card> -->

  </div>
</template>

<script>
    import axios from 'axios'
    import Cookies from 'js-cookie';
    const config = require('../config');
    import psl from 'psl';

    export default {
        name: 'HomePage',
        props: {
        },
        data() {
            return {
                data: 'data',
                websites: [],
                projectPublicUrl: [],
                options: '',
                value:''
            }
        },
        component: {},
        methods: {
            openLink(url) {
                window.open(url);
            },
            getData() {
                let self = this;
                  if (Cookies.get('auth_token') != null && Cookies.get('auth_token') != undefined) {
                    axios.get(config.baseURL + '/flows-dir-listing?website=' + Cookies.get('userDetailId') + '&subscriptionId=' + this.value)
                        .then(async response => {
                            for (let index = 0; index < response.data.children.length; index++) {
                                this.configData = await axios.get(config.baseURL + '/project-configuration/' + response.data.children[index].name).catch((err) => {
                                    console.log(err);
                                });

                                this.repoName = this.configData.data.id;
                                let websiteName = this.configData.data.websiteName;
                                let websiteId = this.repoName;
                                console.log("websiteName", websiteName)
                                if (!(process.env.NODE_ENV == 'development')) {
                                    let url_ = 'http://' + Cookies.get('userDetailId') + '.' + this.repoName + '.' + config.domainkey + '/'
                                    this.websites.push({
                                        website: websiteName,
                                        id: websiteId,
                                        url: url_
                                    })
                                } else {
                                    let url_ = 'http://localhost/websites/' + Cookies.get('userDetailId') + '/' + this.repoName + '/public/'
                                    this.websites.push({
                                        website: websiteName,
                                        id: websiteId,
                                        url: url_
                                    });
                                }
                            }
                        })
                        .catch(e => {
                            console.log(e)
                        });
                } else {
                    localStorage.removeItem('current_sub_id');
                    let location = psl.parse(window.location.hostname)
                    location = location.domain === null ? location.input : location.domain

                    Cookies.remove('auth_token', {
                        domain: location
                    });
                    Cookies.remove('email', {
                        domain: location
                    });
                    Cookies.remove('userDetailId', {
                        domain: location
                    });
                    Cookies.remove('subscriptionId', {
                        domain: location
                    });
                    this.$message({
                        message: 'You\'re Logged Out From System. Please login again!',
                        type: 'error',
                        onClose() {
                            window.location = '/login'
                        }
                    });
                }
                
            },
            changeSubscription() {
              this.websites = []
              this.getData();

              let location = psl.parse(window.location.hostname)
              location = location.domain === null ? location.input : location.domain
              Cookies.set('subscriptionId', this.value, {
                domain: location
              });

            }
        },
        async mounted() {
            this.getData();
            let sub_id = []
            await axios.get(config.userDetail ,{ headers: { 'Authorization': Cookies.get('auth_token') } })
            .then(response => {
              let obj_val = Object.values(response.data.data.package)
              let obj_key = Object.keys(response.data.data.package)
              for (let index = 0; index < obj_val.length; index++) {
                sub_id.push({"value":obj_val[index].subscriptionId, "label":obj_val[index].name})
              }
              this.options = sub_id

              if(Cookies.get('subscriptionId')){
                this.value = Cookies.get('subscriptionId');
              } else {
                this.value = sub_id[0].value;  
              }
              
            })
            .catch((err)=>{ console.log('Error:', err); })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/* #website{
  line-height: 36px;
  font-size: 56px; 
  text-transform: uppercase; 
  color: #CCCCCC;
	text-shadow: 0 1px 0 #999999, 0 2px 0 #888888,
		     0 3px 0 #777777, 0 4px 0 #666666,
		     0 5px 0 #555555, 0 6px 0 #444444,
		     0 7px 0 #333333, 0 8px 7px rgba(0, 0, 0, 0.4),
		     0 9px 10px rgba(0, 0, 0, 0.2);
} */

/* //#0089e0 //#555  */
  h1 {
    font-family: "Avant Garde", Avantgarde, "Century Gothic", CenturyGothic, "AppleGothic", sans-serif;
    font-size: 52px;
    padding: 0px 20px;
    text-align: center;
    text-transform: uppercase;
    text-rendering: optimizeLegibility;
  }
  h1.elegantshadow {
    color: #131313;
    /* background-color: #e7e5e4; */
    letter-spacing: 0.15em;
    /* text-shadow: 1px -1px 0 #767676, -1px 2px 1px #737272, -2px 4px 1px #767474, -3px 6px 1px #787777, -4px 8px 1px #7b7a7a, -5px 10px 1px #7f7d7d, -6px 12px 1px #828181, -7px 14px 1px #868585, -8px 16px 1px #8b8a89, -9px 18px 1px #8f8e8d, -10px 20px 1px #949392, -11px 22px 1px #999897, -12px 24px 1px #9e9c9c; */
  }


  .list-type5{
    color: white;
  width:410px;
  margin:0 auto;
  }
  .list-type5 ol {
  list-style-type: none;
  list-style-type: decimal !ie; /*IE 7- hack*/
  margin: 0;
  margin-left: 1em;
  padding: 0;
  }
  .list-type5 ol li{
  position: relative;
  margin-bottom: 1.5em;
  padding: 0.5em;
  background-color: #0089e0;
  padding-left: 58px;
  }

  .list-type5 a{
  text-decoration:none;
  color:black;
  font-size:15px;
  font-family: 'Raleway', sans-serif;
  }

  .list-type5 li:hover{
  box-shadow:inset -1em 0 #555;
  -webkit-transition: box-shadow 0.5s; /* For Safari 3.1 to 6.0 */
  transition: box-shadow 0.5s;
  }

  

    /* @import url(https://fonts.googleapis.com/css?family=Lato);

    body {
        background-color: rgb(230, 230, 233);
        font-family: 'Lato', sans-serif;
    }



    .item {
        border-bottom: 1px solid fade(black, 10%);
        background-color: white;
        width: 400px;
        height: 50px;
        transition-duration: 0.5s;
        position: relative;

        padding-top: 30px;
        text-align: center;


        &.active {
            box-shadow: 0px 5px 10px fade(black, 20%);
            border-bottom: none;
            color: black;

            transition-delay: 0.5s;
            transform: scale(1.1, 1.1);

            -webkit-transition-delay: 0.5s;
            -webkit-transform: scale(1.1, 1.1);
        }
    } */


    .HomePage {
      background: #fff;
      color: #FFF;
    }

    .skewed-bg {
      background: #58ADFF;
      padding-top: 150px;
      padding-bottom: 100px;
      -webkit-transform: skew(0deg, -5deg);
      transform: skew(0deg, -5deg);
      margin-top: -200px;
    }
    .skewed-bg .content {
      -webkit-transform: skew(0deg, 5deg);
      transform: skew(0deg, 5deg);
      text-align: center;
    }
    .skewed-bg .content .title {
      padding-top: 100px;
      font-weight: normal;
    }
    .skewed-bg .content .text {
      width: 60%;
      margin: 25px auto;
      color: #ccfff2;
    }

    .start-content {
      padding-bottom:30px;
      text-align: center;
      color: #666;
      margin-top: -80px;
    }

    .website-card{
      background-color: #fff;
      box-shadow: 0px 12px 35px #ccc;
      border-radius: 5px;
      padding: 25px 15px;
      text-align: left;
      height: 200px;
      transition: 0.2s all linear;
      margin-top: 25px;
    }

    .website-card:hover{
      box-shadow: 0px 5px 15px #ccc;
    }

    a.website-add, a.website-edit{
      text-decoration: none; 
      color: #292929;
    }

    a.website-add{
      color: #58ADFF;
    }

    a.website-add:hover .website-card{
      color: #58ADFF;
      transition: 0.2s all linear;
      transform: translate3d(0px, 5px, 0px);
    }

    a.website-edit:hover .website-card {
      background-color: #f0f0f0;
      transition: 0.2s all linear;
      transform: translate3d(0px, 5px, 0px);
    }

    .btn-link{
      /*position: absolute;
      bottom: 10px;
      right: 25px;*/
      float: right;
      margin-top: 95px;
    }


</style>

<style>
.subscriptionSelect{
  width:300px !important;  
  margin: auto !important;
}
</style>
