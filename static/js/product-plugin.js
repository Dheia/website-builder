// Change baseURL when going live
// const baseURL = 'http://localhost:3032';
// const baseURL = 'http://devapi.flowz.com/serverapi';
// const baseURL = 'http://api.flowz.com/serverapi';
//const baseURL = 'http://api.flowzcluster.tk/serverapi';

const baseURL = localStorage.getItem('baseURL');
// console.log("URL: " + localStorage.getItem('baseURL'));



grapesjs.plugins.add('product-plugin', function(editor, options) {

    // Reuse Component
    var folderUrl = localStorage.getItem("folderUrl");
    var useremail = localStorage.getItem("email");
    var userDetailId = localStorage.getItem("userDetailId");
    let storedTemplates;
    let configData;
    let storedTemplates_data
    let foldername = folderUrl.split('/');
    foldername = foldername[(foldername.length - 1)];

    let urlVariables = [];
    let urlVarValue = [];
    let menuOptions = [];
    var menuNames = [];
    var bannerTypes = [];

    let partialOptions = {};

    bannerTypes.push({ name: 'Select', value: '' });
    urlVarValue.push({ name: 'Select', value: '' });
    menuNames.push({ name: 'Select', value: '' });

    let configFileUrl = baseURL + '/project-configuration/' + foldername;
    $.getJSON(baseURL + '/bannertype?userId='+userDetailId+'&website_id='+foldername+'&status=true&$paginate=false', function(data) {
        // console.log('data', baseURL, data)
        for (let item of data) {
            $.getJSON(baseURL + '/banners?userId='+userDetailId+'&banner_type='+item.id+'&banner_status=true', function(res) {
                if (res.data.length > 0) {
                    bannerTypes.push({ name: item.bt_name, value: item.id})
                }
            })
        }
    })
    $.getJSON(configFileUrl, function(data) {
        configData = data.configData;
        urlVariables = configData[1].projectSettings[1].GlobalUrlVariables;
        menuOptions = configData[2].layoutOptions[0].Menu;
        storedTemplates = Object.keys(configData[2].layoutOptions[0]);

        //var partialOptions = {};

        for (var j = 0; j < menuOptions.length; j++) {
            let value = { name: menuOptions[j].label, value: menuOptions[j].label }
            menuNames.push(value);
        }

        for (var j = 0; j < urlVariables.length; j++) {

            let urlHeaders = '';

            for (var jj = 0; jj < urlVariables[j].urlHeaderVariables.length; jj++) {
                if (jj == (urlVariables[j].urlHeaderVariables.length - 1)) {
                    urlHeaders += urlVariables[j].urlHeaderVariables[jj].headerName + '="' + urlVariables[j].urlHeaderVariables[jj].headerValue;
                } else {
                    urlHeaders += urlVariables[j].urlHeaderVariables[jj].headerName + '="' + urlVariables[j].urlHeaderVariables[jj].headerValue + '" ';
                }

            }

            // console.log(urlVariables[j].finalvalue + '" ' + urlHeaders);

            let value = { name: urlVariables[j].urlId, value: urlVariables[j].finalvalue + '" ' + urlHeaders };

            urlVarValue.push(value);
        }


        for (var i = 0; i < storedTemplates.length; i++) {
            if (storedTemplates[i] == 'Layout' || storedTemplates[i] == 'pages' || storedTemplates[i] == '.git' || storedTemplates[i] == 'main-files' || storedTemplates[i] == 'assets') {
                storedTemplates = storedTemplates.splice(i, 1)
            }
        }

        for (var i = 0; i <= storedTemplates.length - 1; i++) {
            let resp2 = []
            $.getJSON(configFileUrl, function(data) {
                configData = data.configData;



                // console.log('ReUseVue co2nfigData:', configData);
                storedTemplates = Object.keys(configData[2].layoutOptions[0]);
                for (let index = 0; index < storedTemplates.length; index++) {
                    let data_ = storedTemplates[index]
                    for (let index2 = 0; index2 < configData[2].layoutOptions[0][data_].length; index2++) {
                        if (storedTemplates[index].length != 0 && storedTemplates[index] != "Menu" && storedTemplates[index] != "Layout") {
                            //console.log(11111111);
                            if (configData[2].layoutOptions[0][data_].length >= 2) {
                                for (let j = 0; j < configData[2].layoutOptions[0][data_].length; j++) {
                                    if (j == 0) {
                                        partialOptions[storedTemplates[index]] = [{
                                            'name': configData[2].layoutOptions[0][data_][j].value + '.partial'
                                        }]
                                    } else {
                                        partialOptions[storedTemplates[index]].push({
                                            'name': configData[2].layoutOptions[0][data_][j].value + '.partial'
                                        })
                                    }
                                }
                            } else {
                                partialOptions[storedTemplates[index]] = [{
                                    'name': configData[2].layoutOptions[0][data_][index2].value + '.partial'
                                }]
                            }
                        }

                    }
                }
            });
        }
    });


    var bm = editor.BlockManager;

    // bm.add('scriptingTag', {
    //     label: 'Scriptiing',
    //     category: 'Scripting',
    //     content: {
    //         script : 'alert("Hi")',
    //         content : '<a href="" class="addoCart" >Add to cart</a>'
    //     },
    //     attributes: {
    //         class: 'gjs-fonts gjs-f-hero'
    //     }
    // });

    bm.add('LoginComponent', {
        label: 'Login Component',
        content: {
            script: 'let projectID=""; let loginUrl=""; let userDetailsUrl=""; let socialLoginUrl=""; let BaseUrl = "";let baseURL=""; $(document).ready(function(){if ($.cookie("user_id") !=null && $.cookie("user_auth_token") !=null){window.location="index.html"}else{$.getJSON("./assets/project-details.json", function(data){projectID=data[0].projectID; loginUrl=data[0].login_api; userDetailsUrl=data[0].user_details_api; socialLoginUrl=data[0].social_login_api; BaseUrl = data[0].BaseURL;baseURL=data[0].builder_service_api; $(".success_url").val(data[0].BaseURL); $(".failure_url").val(data[0].BaseURL + \'error404.html\')})}}); $(".input-fields").keyup(function(e){var code=e.which; if (code==13) e.preventDefault(); if (code==32 || code==13 || code==188 || code==186){authenticateUser()}}); $(".login-submit").click(function(){authenticateUser()}); $(".socialMedCls").on("click", function(){var action_url=$(this).attr("title"); $("#form-social-icons").attr("action", socialLoginUrl + action_url); $("#form-social-icons").submit()}); function authenticateUser(){if ($(".user_email").val() !="" && $(".user_pass").val() !=""){axios.post(loginUrl,{email: $(".user_email").val(), password: $(".user_pass").val()}).then(function(response){$.cookie("user_auth_token", response.data.logintoken,{path: window.location.hostname}); axios.get(userDetailsUrl,{headers:{"Authorization": response.data.logintoken}}).then(async(resp)=>{$.cookie("user_id", resp.data.data._id,{path: window.location.hostname}); await axios.get(baseURL + "/website-users?websiteId=" + projectID + "&userEmail=" + $(".user_email").val(),{}).then(async(res)=>{if (res.data.data.length > 0){console.log("User already exist")}else{console.log("New User"); await axios.post(baseURL + "/website-users",{userEmail: resp.data.data.email, userRole: "registered", websiteId: projectID}).then((respo)=>{console.log(respo.data)}).catch((e)=>{console.log(e)})}}).catch((e)=>{console.log(e)}); if (document.referrer.trim() !=""){if (document.referrer.indexOf(BaseUrl) >=0){window.location=document.referrer}else{window.location="index.html"}}else{window.location="index.html"}}).catch((e)=>{console.log(e)})}).catch(function(error){$(".alert-box").addClass("show"); $("#error-message").text(error.response.data); setTimeout(function(){$(".alert-box").removeClass("show")}, 5000)})}else if ($(".user_email").val()=="" && $(".user_pass").val() !=""){$(".alert-box").addClass("show"); $("#error-message").text("Please enter your email"); setTimeout(function(){$(".alert-box").removeClass("show")}, 5000)}else if ($(".user_email").val() !="" && $(".user_pass").val()==""){$(".alert-box").addClass("show"); $("#error-message").text("Please enter password"); setTimeout(function(){$(".alert-box").removeClass("show")}, 5000)}else{$(".alert-box").addClass("show"); $("#error-message").text("Please enter login credentials"); setTimeout(function(){$(".alert-box").removeClass("show")}, 5000)}}',
            content: '<div> <div class="login-section"> <div class="innerpage row"> <div class="row justify-content-center"> <div class="text-center"> <div class="fdb-box fdb-touch"> <div class="row"> <div class="col"> <h1 class="mt-4">Log In</h1> </div></div><div class="row"> <div class="col-md-12"> <div class="alert alert-danger alert-dismissible alert-box"> <strong>Error! </strong><span id="error-message"></span> </div></div></div><div class="row mt-4"> <div class="col"> <input class="form-control input-fields user_email" type="text" placeholder="Email" required="true"/> </div></div><div class="row mt-4"> <div class="col"> <input class="form-control input-fields mb-1 user_pass" type="password" placeholder="Password" required="true"/> <p class="text-right"><a href="signup.html">New User?</a> </p></div></div><div class="row mt-4"> <div class="col"> <button class="btn login-submit" type="button">Submit</button> </div></div><div class="col-md-12 mt-4"> <form id="form-social-icons" name="form-google" method="get"> <ul class="social-network social-circle"><!-- <li><a class="icoFacebook socialMedCls" href="javascript:;" title="facebook"><i class="fa fa-facebook"></i></a> </li>--> <li><a class="icoTwitter socialMedCls" href="javascript:;" title="twitter"><i class="fa fa-twitter"></i></a> </li><li><a class="icoGoogle socialMedCls" href="javascript:;" title="google"><i class="fa fa-google-plus"></i></a> </li><!-- <li><a class="icoLinkedin socialMedCls" href="javascript:;" title="linkedin"><i class="fa fa-linkedin"></i></a> </li>--> <li><a class="icoRss socialMedCls" href="javascript:;" title="github"><i class="fa fa-github"></i></a> </li></ul> <input type="hidden" name="success_url" value="" class="success_url"> <input type="hidden" name="failure_url" value="" class="failure_url"> </form> </div></div></div></div></div></div></div><script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.17.1/axios.js"></script>'
        },
        attributes: {
            class: 'fa fa-sign-in',
            title: 'Login',
        },
        category: 'Ecommerce Blocks'
    });

    bm.add('RegisterComponent', {
        label: 'Register Component',
        content: {
            script: 'let projectID="";let registerURL="";let userDetailsUrl="";let baseURL="";$(document).ready(function(){if ($.cookie("auth_token") !=null){window.location="index.html";}else{$.getJSON("./assets/project-details.json", function(data){projectID=data[0].projectID; registerURL=data[0].register_api; userDetailsUrl=data[0].user_details_api; baseURL=data[0].builder_service;});}});$(".input-fields").keyup(function(e){var code=e.which; if (code==13) e.preventDefault(); if (code==32 || code==13 || code==188 || code==186){authenticateUser();}});$(".login-submit").click(function(){authenticateUser();});function authenticateUser(){if(($(".user_full_name").val() !="") && ($(".user_username").val() !="") && ($(".user_email").val() !="") && ($(".user_pass").val() !="") && ($(".c_user_pass").val() !="")){if($(".user_pass").val()==$(".c_user_pass").val()){ axios.post(registerURL,{fullname: $(".user_full_name").val(), username: $(".user_username").val(), email: $(".user_email").val(), password: $(".user_pass").val()}) .then((res)=>{window.location="index.html";}) .catch((e)=>{console.log(e); $(".alert-box").css("display", "block"); $("#error-message").text(e.response.data);})}else{$(".alert-box").css("display", "block"); $("#error-message").text("Password and confirm password did not matched");}}else{$(".alert-box").css("display", "block"); $("#error-message").text("Please enter all credentials");}}',
            content: '  <div> <div class="login-section"> <div class="innerpage"> <div class="row justify-content-center"> <div class="col-md-12 text-center"> <div class="fdb-box fdb-touch"> <div class="row"> <div class="col"> <h1>Signup </h1> </div></div><div class="row"> <div class="col-md-12"> <div class="alert alert-danger alert-dismissible alert-box"> <strong>Error! </strong> <span id="error-message"> </span> </div></div></div><form> <div class="row mt-4"> <div class="col"> <input class="form-control input-fields user_full_name" type="text" placeholder="Full Name" required/> </div></div><div class="row mt-4"> <div class="col"> <input class="form-control input-fields user_username" type="text" placeholder="Username" required/> </div></div><div class="row mt-4"> <div class="col"> <input class="form-control input-fields user_email" type="email" placeholder="Email" required/> </div></div><div class="row mt-4"> <div class="col"> <input class="form-control input-fields mb-1 user_pass" type="password" placeholder="Password" required/> </div></div><div class="row mt-4"> <div class="col"> <input class="form-control input-fields mb-1 c_user_pass" type="password" placeholder="Confirm Password" required/> <p class="text-right"> <a href="login.html">Already Registered? </a> </p></div></div><div class="row mt-4"> <div class="col"> <button class="btn login-submit" type="button">Submit </button> </div></div></form> </div></div></div></div></div></div><script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js"> </script> <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.17.1/axios.js"> </script>'
        },
        attributes: {
            class: 'fa fa-sign-in',
            title: 'Register',
        },
        category: 'Ecommerce Blocks'
    });

    bm.add('Bootstrap-Block-12', {
        label: 'Bootstrap-Block-12',
        content: '<div class="row" style="padding: 5px;"><div class="col-md-12 bootstrapblock"></div></div>',
        attributes: {
            class: 'fa fa-th',
            title: 'Bootstrap-Block-12'
        },
        category: 'Bootstrap-Block'
    });

    bm.add('Bootstrap-Block-6-6', {
        label: 'Bootstrap-Block-6-6',
        content: '<div class="row" style="padding: 5px;"><div class="col-md-6 bootstrapblock" ></div><div class="col-md-6 bootstrapblock"></div></div>',
        attributes: {
            class: 'fa fa-th',
            title: 'Bootstrap-Block-6-6'
        },
        category: 'Bootstrap-Block'
    });

    bm.add('Bootstrap-Block-4-4-4', {
        label: 'Bootstrap-Block-4-4-4',
        content: '<div class="row" style="padding: 5px;"><div class="col-md-4 bootstrapblock"></div><div class="col-md-4 bootstrapblock"></div><div class="col-md-4 bootstrapblock"></div></div>',
        attributes: {
            class: 'fa fa-th',
            title: 'Bootstrap-Block-4-4-4'
        },
        category: 'Bootstrap-Block'
    });

    bm.add('Bootstrap-Block-3-3-3-3', {
        label: 'Bootstrap-Block-3-3-3-3',
        content: '<div class="row" style="padding: 5px;"><div class="col-md-3 bootstrapblock"></div><div class="col-md-3 bootstrapblock"></div><div class="col-md-3 bootstrapblock"></div><div class="col-md-3 bootstrapblock"></div></div>',
        attributes: {
            class: 'fa fa-th',
            title: 'Bootstrap-Block-3-3-3-3'
        },
        category: 'Bootstrap-Block'
    });

    bm.add('Bootstrap-Block-2-2-2-2-2-2', {
        label: 'Bootstrap-Block-2-2-2-2-2-2',
        content: '<div class="row" style="padding: 5px;"><div class="col-md-2 bootstrapblock"></div><div class="col-md-2 bootstrapblock"></div><div class="col-md-2 bootstrapblock"></div><div class="col-md-2 bootstrapblock"></div><div class="col-md-2 bootstrapblock"></div><div class="col-md-2 bootstrapblock"></div></div>',
        attributes: {
            class: 'fa fa-th',
            title: 'Bootstrap-Block-2-2-2-2-2-2'
        },
        category: 'Bootstrap-Block'
    });

    bm.add('Bootstrap-Block-2-8-2', {
        label: 'Bootstrap-Block-2-8-2',
        content: '<div class="row" style="padding: 5px;"><div class="col-md-2 bootstrapblock"></div><div class="col-md-8 bootstrapblock"></div><div class="col-md-2 bootstrapblock"></div></div>',
        attributes: {
            class: 'fa fa-th',
            title: 'Bootstrap-Block-2-8-2'
        },
        category: 'Bootstrap-Block'
    });

    bm.add('Bootstrap-Block-4-8', {
        label: 'Bootstrap-Block-4-8',
        content: '<div class="row" style="padding: 5px;"><div class="col-md-4 bootstrapblock"></div><div class="col-md-8 bootstrapblock"></div></div>',
        attributes: {
            class: 'fa fa-th',
            title: 'Bootstrap-Block-4-8'
        },
        category: 'Bootstrap-Block'
    });

    bm.add('Bootstrap-Block-8-4', {
        label: 'Bootstrap-Block-8-4',
        content: '<div class="row" style="padding: 5px;"><div class="col-md-8 bootstrapblock"></div><div class="col-md-4 bootstrapblock"></div></div>',
        attributes: {
            class: 'fa fa-th',
            title: 'Bootstrap-Block-8-4'
        },
        category: 'Bootstrap-Block'
    });

    bm.add('Bootstrap-Block-8-4', {
        label: 'Bootstrap-Block-3-9',
        content: '<div class="row" style="padding: 5px;"><div class="col-md-3 bootstrapblock"></div><div class="col-md-9 bootstrapblock"></div></div>',
        attributes: {
            class: 'fa fa-th',
            title: 'Bootstrap-Block-3-9'
        },
        category: 'Bootstrap-Block'
    });

    bm.add('fontAwesomeIcon', {
        label: 'Font Awesome Icon',
        content: '<i class="fa fa-home"></i>',
        attributes: {
            class: 'fa fa-font-awesome',
            title: 'Font Awesome Icon'
        },
        category: 'Extra'
    });

    // bm.add('g-form-template', {
    //     label: 'Form Full',
    //     content: '<div class="g-form"> <div class="g-form-panel"> <label>name</label> <input type="text" name="name"/> <label>age</label> <input type="text" name="age"/> <label>address</label> <div attr-id="address" style="padding: 15px;"> <div class="g-form"> <div class="g-form-panel"> <label>Add 1</label> <input type="text" name="add1"/> <label> city </label> <div attr-id="cities" style="padding: 15px;"> <div class="g-form"> <div class="g-form-panel"> <label>city test</label> <input type="text" name="city"/> <button onclick="handleDelete(event)">Delete</button> </div><div class="g-form-group-button"> <button onclick="handleAdd(event)">Add</button> </div></div></div><button onclick="handleDelete(event)">Delete</button> </div><div class="g-form-group-button"> <button onclick="handleAdd(event)">Add</button> </div></div></div></div><div class="g-form-group-button"> <button onclick="handleDelete(event)">Delete</button><button onclick="handleAdd(event)">Add</button> </div></div>',
    //     attributes: {
    //         class: 'fa fa-html5',
    //         title: 'G-Form Full'
    //     },
    //     category: 'Custom Form Controls'
    // });

    // bm.add('g-form', {
    //     label: 'G-Form',
    //     content: '<gform class="g-form" style="display: block; padding: 10px;"></gform>',
    //     attributes: {
    //         class: 'fa fa-html5',
    //         title: 'G-Form'
    //     },
    //     category: 'Custom Form Controls'
    // });

    // bm.add('gformpanel', {
    //     label: 'G-Form Panel',
    //     content: '<gformpanel class="g-form-panel" style="display: block; padding: 5px;"><form class="form"><div class="form-group" style="display: block; padding: 20px; margin: 5px"></div></form></gformpanel>',
    //     attributes: {
    //         class: 'fa fa-html5',
    //         title: 'G-Form Panel'
    //     },
    //     category: 'Custom Form Controls'
    // });

    // bm.add('g-form-add-btn', {
    //     label: 'G-Form Add Button',
    //     content: '<div class="g-form-group-button"> <button type="button" onclick="handleAdd(event)">Add</button> </div>',
    //     attributes: {
    //         class: 'fa fa-html5',
    //         title: 'G-Form Add Button'
    //     },
    //     category: 'Custom Form Controls'
    // });

    // bm.add('g-form-delete-btn', {
    //     label: 'G-Form Delete Button',
    //     content: '<div class="g-form-group-button"> <button type="button" onclick="handleDelete(event)">Delete</button> </div>',
    //     attributes: {
    //         class: 'fa fa-html5',
    //         title: 'G-Form Delete Button'
    //     },
    //     category: 'Custom Form Controls'
    // });

    // bm.add('g-form-submit-btn', {
    //     label: 'G-Form Submit Button',
    //     content: '<button class="button" onclick="getValues()" type="button">Submit</button>',
    //     attributes: {
    //         class: 'fa fa-html5',
    //         title: 'G-Form Submit Button'
    //     },
    //     category: 'Custom Form Controls'
    // });

    // bm.add('formpartial', {
    //     label: 'G-Form-Partial',
    //     content: '<formpartial style="display: block; padding: 10px; min-height: 20px;"></formpartial>',
    //     attributes: {
    //         class: 'fa fa-html5',
    //         title: 'G-Form-Partial'
    //     },
    //     category: 'Custom Form Controls'
    // });


    // bm.add('g-form-template2', {
    //     label: 'Form Full2',
    //     content: '<div class="g-form"> <div class="g-form-panel"> <label>name</label> <input type="text" name="name" placeholder="name" /> <span class="error" data-validate-for="name"></span> <label>email</label> <input type="text" name="email" placeholder="email" /> <span class="error" data-validate-for="email"></span> <label>age</label> <input type="text" name="age" placeholder="age" /> <span class="error" data-validate-for="age"></span> <label>phone</label> <input type="text" name="phone" placeholder="phone" /> <span class="error" data-validate-for="phone"></span> <label>birthdate</label> <input type="date" name="birthdate" placeholder="birthdate" /> <span class="error" data-validate-for="birthdate"></span> </div> <div class="g-form-group-button"> <button onclick="handleDelete(event)">Delete</button><button onclick="handleAdd(event)">Add</button> </div> </div> <button class="button" onclick="getValues()" type="button">Submit</button>',
    //     attributes: {
    //         class: 'fa fa-html5',
    //         title: 'G-Form Full2'
    //     },
    //     category: 'Custom Form Controls'
    // });


    // // Sections
    // bm.add('hero', {
    //     label: 'Hero section',
    //     category: 'Section',
    //     content: '<header class="header-banner"> <div class="container-width">' +
    //         '<div class="logo-container"><div class="logo">Flowz</div></div>' +
    //         '<nav class="navbar">' +
    //         '<div class="menu-item">BUILDER</div><div class="menu-item">TEMPLATE</div><div class="menu-item">WEB</div>' +
    //         '</nav><div class="clearfix"></div>' +
    //         '<div class="lead-title">Build your templates without coding</div>' +
    //         '<div class="lead-btn">Try it now</div></div></header>',
    //     attributes: {
    //         class: 'gjs-fonts gjs-f-hero'
    //     }
    // });

    // bm.add('h1p', {
    //     label: 'Text section',
    //     category: 'Section',
    //     content: `<div>
    // <h1 class="heading">Insert title here</h1>
    // <p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
    // </div>`,
    //     attributes: {
    //         class: 'gjs-fonts gjs-f-h1p'
    //     }
    // });

    // bm.add('3ba', {
    //     label: 'Badges',
    //     category: 'Section',
    //     content: '<div class="badges">' +
    //         '<div class="badge">' +
    //         '<div class="badge-header"></div>' +
    //         '<img class="badge-avatar" src="https://api.adorable.io/avatars/100/kavi@officebrain.png">' +
    //         '<div class="badge-body">' +
    //         '<div class="badge-name">Adam Smith</div><div class="badge-role">CEO</div><div class="badge-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</div>' +
    //         '</div>' +
    //         '<div class="badge-foot"><span class="badge-link">f</span><span class="badge-link">t</span><span class="badge-link">ln</span></div>' +
    //         '</div>' +
    //         '<div class="badge">' +
    //         '<div class="badge-header"></div>' +
    //         '<img class="badge-avatar" src="https://api.adorable.io/avatars/100/faizan@officebrain.png">' +
    //         '<div class="badge-body">' +
    //         '<div class="badge-name">John Black</div><div class="badge-role">Software Engineer</div><div class="badge-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</div>' +
    //         '</div>' +
    //         '<div class="badge-foot"><span class="badge-link">f</span><span class="badge-link">t</span><span class="badge-link">ln</span></div>' +
    //         '</div>' +
    //         '<div class="badge">' +
    //         '<div class="badge-header"></div>' +
    //         '<img class="badge-avatar" src="https://api.adorable.io/avatars/100/john@officebrain.png">' +
    //         '<div class="badge-body">' +
    //         '<div class="badge-name">Jessica White</div><div class="badge-role">Web Designer</div><div class="badge-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</div>' +
    //         '</div>' +
    //         '<div class="badge-foot"><span class="badge-link">f</span><span class="badge-link">t</span><span class="badge-link">ln</span>' +
    //         '</div>' +
    //         '</div></div>',
    //     attributes: {
    //         class: 'gjs-fonts gjs-f-3ba'
    //     }
    // });

    // bm.add('hero', {
    //     label: 'Hero section',
    //     category: 'Section',
    //     content: '<header class="header-banner"> <div class="container-width">' +
    //         '<div class="logo-container"><div class="logo">Flowz</div></div>' +
    //         '<nav class="navbar">' +
    //         '<div class="menu-item">BUILDER</div><div class="menu-item">TEMPLATE</div><div class="menu-item">WEB</div>' +
    //         '</nav><div class="clearfix"></div>' +
    //         '<div class="lead-title">Build your templates without coding</div>' +
    //         '<div class="lead-btn">Try it now</div></div></header>',
    //     attributes: {
    //         class: 'gjs-fonts gjs-f-hero'
    //     }
    // });


    bm.add('productContents', {
        label: 'Product Content',
        content: '<productContents><section class="flex-sect"> <div class="container-width"> <div class="flex-title">Our Top Grossing Products </div><div class="cards"> <div class="card"> <div class="card-header"> </div><div class="card-body"> <div class="card-title">Title one </div><div class="card-sub-title">Subtitle one </div><div class="card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </div></div></div><div class="card"> <div class="card-header ch2"> </div><div class="card-body"> <div class="card-title">Title two </div><div class="card-sub-title">Subtitle two </div><div class="card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </div></div></div><div class="card"> <div class="card-header ch3"> </div><div class="card-body"> <div class="card-title">Title three </div><div class="card-sub-title">Subtitle three </div><div class="card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </div></div></div><div class="card"> <div class="card-header ch4"> </div><div class="card-body"> <div class="card-title">Title four </div><div class="card-sub-title">Subtitle four </div><div class="card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </div></div></div><div class="card"> <div class="card-header ch5"> </div><div class="card-body"> <div class="card-title">Title five </div><div class="card-sub-title">Subtitle five </div><div class="card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </div></div></div><div class="card"> <div class="card-header ch6"> </div><div class="card-body"> <div class="card-title">Title six </div><div class="card-sub-title">Subtitle six </div><div class="card-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </div></div></div></div></div></section><section class="am-sect"> <div class="container-width"> <div class="am-container"> <img class="img-phone" src="http://grapesjs.com/img/phone-app.png"/> <div class="am-content"> <div class="am-pre">BEST PRODUCT OF ALL TIME </div><div class="am-title"> <h1 class="a-size-large a-spacing-none" id="c3963" id="title">Apple iPhone 6s with Free Vodafone RED Plan (Gold, 16GB) </h1> </div><div class="am-desc"> <span id="c3997" >iPhone 6s - Take everything that made the previous generation great, and advance it to a new level. They’re made with 7000 Series aluminium, the strongest alloy we’ve ever used in an iPhone. They both feature Retina HD displays made from the strongest cover glass used on any smartphone in the world. And now they’re available in an elegant new rose gold ﬁnish.</span> </div><div class="am-post"> <h4 id="c4025" >A breakthrough design. Pushed even further. </h4> </div></div></div></div></section></productContents>',
        attributes: {
            class: 'fa fa-file-o',
            title: 'Content Block'
        },
        category: 'Extra'
    });

    bm.add('basicDiv', {
        label: 'Basic Division',
        content: '<div style="min-height: 20px; display: block;"></div>',
        attributes: {
            class: 'fa fa-code',
            title: 'Basic Div'
        },
        category: 'Extra'
    });

    // Copyright
    bm.add('Copyright', {
        label: 'Copyright',
        content: '<div class="footerCopyright"><p>©2017 <a href="#">Flowz</a> | All rights reserved.</p></div>',
        attributes: {
            class: 'fa fa-copyright',
            title: 'Copyright'
        },
        category: 'Extra'
    });
    // Subscribe
    bm.add('Subscribe', {
        label: 'Subscribe',
        content: '<p class="newsletter">Sign up and Save!</p><input type="email" value="" name="EMAIL" class="required email" id="" aria-required="true"><input type="submit" value="Subscribe" name="subscribe" id="" class="btn btn-default">',
        attributes: {
            class: 'fa fa-rss',
            title: 'Subscribe'
        },
        category: 'Extra'
    });

    // Social Media icons designed by gaurav
    bm.add('socialmedia', {
        label: 'Social Media Icons',
        content: '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"><style type="text/css"> @charset "UTF-8"; .social__wrap{margin: 0; padding: 0;}.social__wrap:after{content: ""; display: block; clear: both;}.social__item{list-style: none; float: left; width: 12.5%; margin: 0; padding: 0; position: relative;}.social__item a{display: block; text-decoration: none; padding: 50%; cursor: pointer; transition: all .25s ease-in-out; -webkit-font-smoothing: antialiased;}.social__item a:before{text-indent: 0; font: normal normal normal 14px/1 FontAwesome; font-size: 1.5vw; color: #fff; display: block; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);}.social__item a span{display: none;}.social__link--facebook{background: #3b5998;}.social__link--facebook:before{content: "";}.social__link--facebook:hover{background: #4c70ba;}.social__link--twitter{background: #55acee;}.social__link--twitter:before{content: "";}.social__link--twitter:hover{background: #83c3f3;}.social__link--google-plus{background: #dc4e41;}.social__link--google-plus:before{content: "";}.social__link--google-plus:hover{background: #e4766c;}.social__link--linkedin{background: #0077b5;}.social__link--linkedin:before{content: "";}.social__link--linkedin:hover{background: #0099e8;}.social__link--instagram{background: #3f729b;}.social__link--instagram:before{content: "";}.social__link--instagram:hover{background: #548cb9;}.social__link--youtube{background: #cd201f;}.social__link--youtube:before{content: "";}.social__link--youtube:hover{background: #e23e3d;}.social__link--twitch{background: #6441a5;}.social__link--twitch:before{content: "";}.social__link--twitch:hover{background: #7e5bbe;}.social__link--paypal{background: #003087;}.social__link--paypal:before{content: "";}.social__link--paypal:hover{background: #0042ba;}</style><ul class="social__wrap"> <li class="social__item"> <a class="social__link--facebook" href=""> <span>facebook</span> </a> </li><li class="social__item"> <a class="social__link--twitter" href=""> <span>twitter</span> </a> </li><li class="social__item"> <a class="social__link--google-plus" href=""> <span>google-plus</span> </a> </li><li class="social__item"> <a class="social__link--linkedin" href=""> <span>linkedin</span> </a> </li><li class="social__item"> <a class="social__link--instagram" href=""> <span>instagram</span> </a> </li><li class="social__item"> <a class="social__link--youtube" href=""> <span>youtube</span> </a> </li><li class="social__item"> <a class="social__link--twitch" href=""> <span>twitch</span> </a> </li><li class="social__item"> <a class="social__link--paypal" href=""> <span>paypal</span> </a> </li></ul>',
        attributes: {
            class: 'fa fa-facebook',
            title: 'socialmedia'
        },
        category: 'Extra'
    });

    // Image Animation Page Layout
    bm.add('imageanimation', {
        label: 'imageanimation',
        content: '<imageanimation style="display: block; width:100%; min-height:25px; padding: 5px"><title>Animated Background Gradient</title> <img class="hero-image" src="https://wallpapershome.com/images/wallpapers/polygon-2560x1600-4k-hd-wallpaper-orange-red-blue-background-pattern-225.jpg"> <div id="gradient"/></imageanimation>',
        attributes: {
            class: 'fa fa-magic',
            title: 'imageanimation'
        },
        category: 'Extra'
    });

    // Dynamic navigation menu from JSON created from menu builder
    // bm.add('navimenu', {
    //   label: 'Navbar Menu',
    //   content: '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">' +
    //     '<navimenu style="padding: 10px; display: block; min-height: 75px;"><div class="navbar navbar-default" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> </div><div class="collapse navbar-collapse" id="navigationDiv"><ul class="nav navbar-nav"><li class="active"><a href="#" target="_blank">Home</a></li></ul></li></ul></div></div></div></navimenu>',
    //   attributes: {
    //     class: 'fa fa-bars',
    //     title: 'Navigation Menu'
    //   },
    //   category: 'Ecommerce Blocks'
    // });

    bm.add('navimenu', {
        label: 'Navbar Menu',
        content: '<nav class="navbar navbar-expand-sm bg-dark navbar-dark customMenu"> <div class="container"> <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar"> <span class="navbar-toggler-icon"></span> </button> <div class="collapse navbar-collapse" id="navigationDiv"> <ul class="navbar-nav"> <li class="nav-item"> <a class="nav-link" href="index.html">Link</a> </li></ul> </div></div></nav>',
        attributes: {
            class: 'fa fa-bars',
            title: 'Navigation Menu'
        },
        category: 'Ecommerce Blocks'
    });

    // bm.add('PaymentGateway', {
    //     label: 'PaymentGateway',
    //     content: '<paymentgateway style="display: block; padding: 10px; min-height: 20px;">PaymentGateways</paymentgateway>',
    //     attributes: {
    //         class: 'fa fa-shopping-cart',
    //         title: 'Shopping cart',
    //     },
    //     category: 'Ecommerce Blocks'
    // });

    // Lisiting Page sidebar filters
    // bm.add('filters', {
    //     label: 'Product Filters',
    //     content: '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">' +
    //         '<div class="filters"><div class="categories-filter"><div class="panel-group" id="accordion"> <div class="panel panel-default"> <div class="panel-heading filter-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapse1"> Categories<span class="pull-right">+</span></a> </h4> </div><div id="collapse1" class="panel-collapse collapse"> <div class="panel-body"> <div class="list-group"> <a href="#" class="list-group-item"> <div class="checkbox"> <label><input type="checkbox" value="">All Categories</label></div></a> <a href="#" class="list-group-item"> <div class="checkbox"> <label><input type="checkbox" value="">Bags</label></div></a> <a href="#" class="list-group-item"> <div class="checkbox"> <label><input type="checkbox" value="">Pens</label></div></a> <a href="#" class="list-group-item"> <div class="checkbox"> <label><input type="checkbox" value="">Pens</label></div></a></div></div></div></div></div></div><div class="categories-filter"><div class="panel-group" id="accordion"> <div class="panel panel-default"> <div class="panel-heading filter-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapse2"> Price Range<span class="pull-right">+</span></a> </h4> </div><div id="collapse2" class="panel-collapse collapse"> <div class="panel-body"> <div class="list-group"> <a href="#" class="list-group-item"> <div class="checkbox"> <label><input type="checkbox" value="">$0 - $100</label></div></a> <a href="#" class="list-group-item"> <div class="checkbox"> <label><input type="checkbox" value="">$100 - $500</label></div></a> <a href="#" class="list-group-item"> <div class="checkbox"> <label><input type="checkbox" value="">$500 +</label></div></a></div></div></div></div></div></div><div class="categories-filter"><div class="panel-group" id="accordion"> <div class="panel panel-default"> <div class="panel-heading filter-heading"> <h4 class="panel-title"> <a data-toggle="collapse" data-parent="#accordion" href="#collapse3"> Color<span class="pull-right">+</span></a> </h4> </div><div id="collapse3" class="panel-collapse collapse"> <div class="panel-body"> <ul class="colors-list"> <li><a href="#" class="color-link"><span class="color green"></span></a></li><li><a href="#" class="color-link"><span class="color redd"></span></a></li><li><a href="#" class="color-link"><span class="color blue"></span></a></li><li><a href="#" class="color-link"><span class="color teal"></span></a></li><li><a href="#" class="color-link"><span class="color orange"></span></a></li><li><a href="#" class="color-link"><span class="color purple"></span></a></li></ul> </div></div></div></div></div></div>',
    //     attributes: {
    //         class: 'fa fa-filter',
    //         title: 'Product Filters'
    //     },
    //     category: 'Ecommerce Blocks'
    // });

    // Custom droppable block of product listing
    // bm.add('productListing', {
    //     label: 'Product Listing',
    //     content: '<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" crossorigin="anonymous"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet"><script src="https://code.jquery.com/jquery-3.2.1.js" ></script>' +
    //         '<productListing style="display: block; width: 100%;"><figure class="product-card portrait placeholderCard"> <img class="product-card-img" src="http://placehold.it/400x300"/> <figcaption> <h3 class="product-card-title">Product Title</h3> <div class="product-description">Product Description</div><p class="product-card-address"> <i class="fa fa-map-marker"></i> US</p><div class="product-card-price"> <span class="price-savings">Save 25%</span> <s class="original-price">$ 10.99</s> <p class="amount-price"> <span class="from">starting at</span> $ 10.99<!-- <span class="from">/night</span>--> </p></div><button class="btn btn-info btn-block" style="margin-bottom: 10px" id="addToCartBtn">Add To Cart</button></figcaption></figure>' +
    //         '<div class="product_grid landscape" style="visibility: hidden;"> <ul class="product_list list"> <li class="product_item"> <div class="product_sale"> <p>On Sale</p></div><div class="product_image"> <a href="#"><img src="http://placehold.it/400x300" alt="Product images"></a> <div class="product_buttons"> <button class="product_heart"><i class="fa fa-heart"></i></button> <button class="product_compare"><i class="fa fa-random"></i></button> <button class="add_to_cart"><i class="fa fa-shopping-cart"></i></button> <div class="quick_view"> <a href="#"> <h6>Quick View</h6> </a> </div></div></div><div class="product_values"> <div class="product_title"> <h5>Product Title</h5> </div><div class="product_price"> <a href="#"><span class="price_old">$79.99</span> <span class="price_new">$11.11</span></a> <span class="product_rating"></span> </div><div class="product_desc"> <p class="truncate">Product Descriptions</p></div><div class="product_buttons"> <button class="product_heart"><i class="fa fa-heart"></i></button> <button class="product_compare"><i class="fa fa-random"></i></button> <button class="add_to_cart"><i class="fa fa-shopping-cart"></i></button> </div></div></li></ul> </div>' +
    //         '<div class="listing creative" style="visibility: hidden"> <!DOCTYPE html><div> <link rel=\'stylesheet prefetch\' href=\'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\'> <style type="text/css"> @import url(https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css); .wrp-product-2{color: #000000; font-size: 16px; margin: 20px;}.wrp-product-2:hover{box-shadow: 0px 10px 25px -2px rgba(0,0,0,0.36); transition: 0.2s all linear;}.wrp-product-2 *{-webkit-box-sizing: border-box; box-sizing: border-box; -webkit-transition: all 0.3s ease-out; transition: all 0.3s ease-out;}.wrp-product-2 img{max-width: 100%; vertical-align: top; position: relative;}.wrp-product-2 .add-to-cart{position: absolute; top: 0; padding-right: 10px; color: #ffffff; font-weight: 700; text-transform: uppercase; font-size: 0.9em; opacity: 0; background-color: #409ad5; -webkit-transform: rotateX(-90deg); transform: rotateX(-90deg); -webkit-transform-origin: 100% 0; -ms-transform-origin: 100% 0; transform-origin: 100% 0; padding: 5px}.wrp-product-2 .add-to-cart i{display: inline-block; margin-right: 10px; width: 40px; line-height: 40px; text-align: center; background-color: #164666; color: #ffffff; font-size: 1.4em;}.wrp-product-2 .wrp-row{padding: 20px; background-color: #eee;}.wrp-product-2 h3, .wrp-product-2 p{margin: 0;}.wrp-product-2 h3{font-size: 1.5em; font-weight: 700; margin-bottom: 10px; text-transform: uppercase;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}.wrp-product-2 p{font-size: 0.9em; letter-spacing: 1px; font-weight: 400;}.wrp-product-2 .price{font-weight: 500; font-size: 1.5em; line-height: 48px; letter-spacing: 1px;}.wrp-product-2 .price s{margin-right: 5px; opacity: 0.5; font-size: 0.9em;}.wrp-product-2 a{position: absolute; top: 0; bottom: 0; left: 0; right: 0;}.wrp-product-2:hover .add-to-cart{opacity: 1; -webkit-transform: rotateX(0deg); transform: rotateX(0deg);}.wrp-product-2:hover .add-to-cart i{background-color: #2980b9;} .descriptionText{max-height: 70px;overflow-y: auto;}</style> <div class=""> <div class=""> <div class="col-md-3"> <div class="wrp-product-2"> <img src="http://cdn2-www.craveonline.com/assets/uploads/2015/01/Watch-business-man.png" alt="Lorem Ipsum"/> <div class="add-to-cart"><i class="ion-android-add"></i><span>Add to Cart</span></div><div class="wrp-row"> <h3>Pudol Doux</h3> <p>A small description of the product goes here.</p><div class="price"> <s>$24.00</s>$19.00 </div><p><small>Special Offer: <b>10% off</b></small></p></div><a href="#"></a> </div></div></div></div></div></productListing>',
    //     attributes: {
    //         class: 'fa fa-tags',
    //         title: 'Product Block'
    //     },
    //     category: 'Ecommerce Blocks'
    // });


    // Product Detail
    // bm.add('productDetail', {
    //     label: 'Detail Page',
    //     content: '<productDetail style="padding: 20px; display: block; width: 100%; min-height: 50px;"><link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous"><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" crossorigin="anonymous"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet"><div class="detail-card"><div class=container-fliud><div class="row wrapper"><div class="col-md-6 preview"><div class="preview-pic tab-content"><div class="tab-pane active"id=pic-1><img src=http://placehold.it/500x500></div><div class=tab-pane id=pic-2><img src=http://placehold.it/500x300></div><div class=tab-pane id=pic-3><img src=http://placehold.it/500x300></div><div class=tab-pane id=pic-4><img src=http://placehold.it/500x300></div><div class=tab-pane id=pic-5><img src=http://placehold.it/500x300></div></div><ul class="nav nav-tabs preview-thumbnail"><li class=active><a data-target=#pic-1 data-toggle=tab><img src=http://placehold.it/200x125></a><li><a data-target=#pic-2 data-toggle=tab><img src=http://placehold.it/200x125></a><li><a data-target=#pic-3 data-toggle=tab><img src=http://placehold.it/200x125></a><li><a data-target=#pic-4 data-toggle=tab><img src=http://placehold.it/200x125></a><li><a data-target=#pic-5 data-toggle=tab><img src=http://placehold.it/200x125></a></ul></div><div class="col-md-6 details"><h3 class=product-title>men\'s shoes fashion</h3><div class=rating><div class=stars><span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span></div><span class=review-no>41 reviews</span></div><p class=product-description>Suspendisse quos? Tempus cras iure temporibus? Eu laudantium cubilia sem sem! Repudiandae et! Massa senectus enim minim sociosqu delectus posuere.<h4 class=price>current price: <span>$180</span></h4><p class=vote><strong>91%</strong> of buyers enjoyed this product! <strong>(87 votes)</strong><h5 class=sizes>sizes: <span class=size data-toggle=tooltip title=small>s</span> <span class=size data-toggle=tooltip title=medium>m</span> <span class=size data-toggle=tooltip title=large>l</span> <span class=size data-toggle=tooltip title="xtra large">xl</span></h5><div class=action><button class="btn btn-default add-to-cart"type=button>add to cart</button> <button class="btn btn-default like"type=button><span class="fa fa-heart"></span></button></div></div></div></div></div></productDetail><script src="js/client-product-detail-plugin.js">',
    //     attributes: {
    //         class: 'fa fa-shopping-bag',
    //         title: 'Product Detail Page',
    //     },
    //     category: 'Ecommerce Blocks'
    // });

    // bm.add('productReactiveSearch', {
    //     label: 'Product Search',
    //     content: '<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" crossorigin="anonymous"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css">' +
    //         '<style type="text/css">.product-card{max-width:23%;font-size:12px;margin:5px;display:inline-block;box-shadow:2px 2px 15px #999}.product-card>a{background:#f2f2f2;color:#333;transition:all .1s;position:relative;display:block;z-index:0;padding-bottom:5px;text-decoration:none}.product-card>a:hover{text-decoration:none;box-shadow:0 1px 3px rgba(0,0,0,.3)}.product-card-title{min-height:70px;font-size:21px}.product-description{min-height:70px;max-height:70px;overflow-y:auto}.product-card-img{display:block;height:250px;width:100%}.product-card figcaption{display:block;padding:0 10px}.product-card .product-card-address{color:#888;line-height:1.2}.product-card .product-card-address i{font-size:14px;margin-right:2px;line-height:1.2}.product-card .product-card-price{display:block;text-align:right}.product-card .product-card-price .original-price,.product-card .product-card-price .price-savings{line-height:22px;display:inline-block;vertical-align:middle}.product-card .product-card-price .price-savings{float:left;color:#82b548}.product-card .product-card-price .original-price{color:#aaa;font-size:14px}.product-card .product-card-price .amount-price{text-align:right;font-size:20px;color:#82b548}.product-card .product-card-price .from{font-size:12px}.product_price span,.product_title h5{font-size:1.1em;line-height:1}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;font-family:"Open Sans",Arial,sans-serif}img{max-width:100%;height:auto}ul.product_list{list-style-type:none;margin:0;padding:0;width:100%;display:inline}.product_grid{text-decoration:none;display:inline}.product_item{display:inline-block;background:#fff;border:1px solid #ccc;padding:10px;position:relative;overflow:hidden}.product_sale{position:absolute;z-index:2;right:-28px;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);transform:rotate(45deg)}.product_image{position:relative;overflow:hidden}.product_image img{display:block;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;-webkit-transition:all .5s ease-in-out;-moz-transition:all .5s ease-in-out;transition:all .5s ease-in-out}.info,.product{position:relative}.product_image img:hover{-o-transform:scale(1.2,1.2);-moz-transform:scale(1.2,1.2);-webkit-transform:scale(1.2,1.2);-ms-transform:scale(1.2,1.2);transform:scale(1.2,1.2)}.product_title{float:left;width:100%;text-transform:uppercase}.product_title h5{margin:auto;font-weight:500;padding-bottom:5px}.product_price a{color:#000}.price_old{color:#ea2e49;text-decoration:line-through}.product_desc p{margin:0;line-height:1.3;padding:10px 0}.product_rating{float:right;width:100px;height:20px;overflow:hidden;background:url(https://bit.ly/1B4PjyM) 0 76% no-repeat}.product_buttons{-webkit-font-smoothing:antialiased;-moz-font-smoothing:antialiased;font-smoothing:antialiased}.product_buttons .product_heart:hover{color:#DF0404;background:rgba(255,255,255,.5)}.product_buttons .product_compare:hover{color:#129612;background:rgba(255,255,255,.5)}.product_buttons .add_to_cart:hover{color:#4DC8D3;background:rgba(255,255,255,.5)}@media only screen and (min-width:320px){.product_sale p{margin:0;color:#fff;background:red;padding:3px 25px;box-shadow:0 2px 8px 0 rgba(0,0,0,.4)}.product_values{float:left;width:calc(100% - 100px);padding:0 10px}.product_rating{margin-right:10px}.product_image{height:150px;float:left;width:100px}.product_image .product_buttons{display:none}.product_desc{overflow:hidden;auto:left;line-height:1}.product_values .product_buttons{position:relative;text-align:left;float:left;margin-top:7px}.product_values .product_buttons button{color:#252525;background:rgba(255,255,255,1);font-size:1em;border-radius:50%;width:40px;height:40px;border:1px solid #000}}@media only screen and (min-width:480px){.product_image{height:250px;width:175px}.product_values{width:calc(100% - 175px)}}@media only screen and (min-width:678px){.product_item{width:49.5%}.product_image{height:150px;width:100px}.product_values{width:calc(100% - 100px)}}@media only screen and (min-width:992px){.product_image{height:250px;width:175px}.product_values{width:calc(100% - 175px)}.product_desc{max-height:200px}}@media only screen and (min-width:1200px){.product_item{width:33%}.product_desc{max-height:131px}}@media only screen and (max-width:992px){.product_desc{max-height:67px}}@media only screen and (max-width:480px){.product_title h5{font-weight:700}}@media only screen and (max-width:320px){.product_buttons,.product_desc,.product_sale{display:none}.product_image img{position:relative}.product_price span{float:left;width:100%}}.listing{list-style:none;margin:20px;padding:0;display:inline-block}.product{width:240px}.img-wrapper,.info{width:100%;text-align:center}.product a{text-decoration:none}.img-wrapper{display:block;height:240px;border:1px solid #afafaf;border-bottom:0;overflow:hidden}.info{background:#000;color:#fff;padding:40px 10px 20px;vertical-align:middle;transform:translateZ(0);box-shadow:0 0 1px transparent;backface-visibility:hidden;transition-property:color,height;transition-duration:.3s,.4s;transition-timing-function:ease-out;height:83px}.info:after,.info:before,.note,.price{position:absolute}.info:before{content:"";z-index:-1;top:0;bottom:0;left:0;right:0;background:#fff;transform:scaleY(0);transform-origin:50%;transition:transform .3s ease-out}.info:after{visibility:hidden;pointer-events:none;z-index:-1;content:"";border-style:solid;transition-duration:.3s;transition-property:transform;left:calc(50% - 11px);bottom:0;border-width:10px 10px 0;border-color:#000 transparent transparent}.product:hover .info{height:40px}.product:hover .info:before{transform:scaleY(.7)}.product:hover .info:after{visibility:visible;transform:translateY(10px)}.slide-title{transition:transform .3s ease-out}.slide-title a{color:inherit}.product:hover .slide-title{transform:translateY(-18px);font-weight:700;color:#000}.price{background:#e32d2c;font-size:1.3em;padding:4px 13px;top:-15px;right:10px}.note.on-sale,.price.sale{background:#00ba2f}.price.old{font-size:.95em;padding:4px 6px;text-decoration:line-through;top:-43px}.actions-wrapper{margin-top:14px;display:flex;justify-content:space-around}.actions-wrapper *{width:50%;padding:2px 0;text-align:center;color:#191919;font-size:.95em;font-weight:700}.actions-wrapper :before{font-family:FontAwesome;margin-right:8px}.wishlist{border-right:1px solid #afafaf}.wishlist:hover{color:#e32d2c}.cart:hover{color:#0a75b9}.product:hover .actions-wrapper *{visibility:visible}.note{top:0;left:0;padding:4px 8px;font-size:.9em}.note.on-sale{color:#fff}.note.no-stock{background:#191919;color:#fff}</style>' +
    //         '<productReactiveSearch style="display: block;margin-top: 0px;"><figure class="product-card portrait"> <img class="product-card-img" src="http://placehold.it/400x300"/> <figcaption> <h3 class="product-card-title">Product Title</h3> <div class="product-description">Product Sescription</div><p class="product-card-address"> <i class="fa fa-map-marker"></i> US</p><div class="product-card-price"> <span class="price-savings">Save 25%</span> <s class="original-price">$ 10.99</s> <p class="amount-price"> <span class="from">starting at</span> $ 10.99<!-- <span class="from">/night</span>--> </p></div></figcaption></figure>' +
    //         '<div class="product_grid landscape" style="visibility: hidden;"> <ul class="product_list list"> <li class="product_item"> <div class="product_sale"> <p>On Sale</p></div><div class="product_image"> <a href="#"><img src="http://placehold.it/400x300" alt="Product images"></a> <div class="product_buttons"> <button class="product_heart"><i class="fa fa-heart"></i></button> <button class="product_compare"><i class="fa fa-random"></i></button> <button class="add_to_cart"><i class="fa fa-shopping-cart"></i></button> <div class="quick_view"> <a href="#"> <h6>Quick View</h6> </a> </div></div></div><div class="product_values"> <div class="product_title"> <h5>Product Title</h5> </div><div class="product_price"> <a href="#"><span class="price_old">$79.99</span> <span class="price_new">$11.11</span></a> <span class="product_rating"></span> </div><div class="product_desc"> <p class="truncate">Product Descriptions</p></div><div class="product_buttons"> <button class="product_heart"><i class="fa fa-heart"></i></button> <button class="product_compare"><i class="fa fa-random"></i></button> <button class="add_to_cart"><i class="fa fa-shopping-cart"></i></button> </div></div></li></ul> </div>' +
    //         '<div class="listing creative" style="visibility: hidden"> <div class="product"> <a class="img-wrapper" href="#"> <img src="https://hussein-alhammad.com/images/codepen/product-card/running-shoe_pink.jpg" alt="Pink running shoe"/> </a> <div class="note on-sale" style="position: absolute;top: 0;left: 0;padding: 4px 8px;font-size: 0.9em;background: #00ba2f;color: #fff;">On sale</div><div class="info"> <div class="slide-title"><a href="#">Some Product</a></div><div class="price sale">$20.50</div><div class="price old">$34.99</div></div><div class="actions-wrapper"> <a href="#" class="add-btn wishlist"><i class="fa fa-heart-o"> Wishlist</a> <a href="#" class="add-btn cart"><i class="fa fa-shopping-cart"> Cart</a> </div></div></div></productReactiveSearch>',
    //     attributes: {
    //         class: 'fa fa-search',
    //         title: 'Product Block'
    //     },
    //     category: 'Ecommerce Blocks'
    // });

    // bm.add('productCompare', {
    //     label: 'Compare Products',
    //     content: '<div style="display: block; min-height: 20px;"><link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"><link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"><style type="text/css">.buttons{margin-top: 20px;}.productCounts{color: #008080;font-size: 24px;text-align: center;}.productTitle{text-align: center;min-height: 70px;}.table td{text-align: center;}.quantityInput{width: 50px;}.checkPrice{margin-top: 5px;color: #008080;}.colors-list{list-style: none; margin-top: 5px; text-align: left;}.color-link:hover{text-decoration: none !important;}.colors-list li{display: inline;}span.color{min-width: 15px; min-height: 15px; padding: 5px 10px; border: 1px solid #aaa; margin: 1px;}.color.green{background-color: #00FF00;}.color.redd{background-color: #ff0000;}.color.blue{background-color: #0000ff;}.color.teal{background-color: #232F3E;}.color.orange{background-color: orange;}.color.purple{background-color: purple;}</style>' +
    //         '<div class="container"><div class="row"><div class="col-md-5"><h3>Compare Products</h3></div><div class="col-md-7 buttons" align="right"><a href="#" class="btn btn-danger"><i class="fa fa-times"></i> Clear</a><a href="#" class="btn btn-default"><i class="fa fa-envelope"></i> Email To Friend</a><a href="#" class="btn btn-info"><i class="fa fa-print"></i> Print</a><a href="#" class="btn btn-primary"><i class="fa fa-file-pdf-o"></i> Download PDF</a><a href="#" class="btn btn-link"><strong>Continue Shopping >></strong></a></div></div><hr><div class="row"><div class="col-md-12"><div class="table-responsive"><table class="table table-bordered table-striped"><thead><tr><th width="20%" style="border: none;"></th><th width="20%" style="border: none;"></th><th width="20%" style="border: none;"></th><th width="20%" style="border: none;"></th><th width="20%" style="border: none;"></th></tr></thead><tbody><tr><td><strong>You can add up to 4 products to compare.<br><br><br>Now you can add <br><br><span class="productCounts">2</span><br><br>more products</strong></td><td><div class="product"><img src="http://placehold.it/400x400" class="img-responsive" alt="product image"><h5 class="productTitle"><strong>Product Title</strong></h5><hr><h3>USD $15.99</h3><span>Qty. <input type="number" class="quantityInput" name="" value="6"/></span></div></td><td><div class="product"><img src="http://placehold.it/400x400" class="img-responsive" alt="product image"><h5 class="productTitle"><strong>Product Title</strong></h5><hr><h3>USD $15.99</h3><span>Qty. <input type="number" class="quantityInput" name="" value="6"/></span></div></td><td><a href="#" class="btn btn-defaut"><i class="fa fa-plus-circle"></i> Add More Product</a></td><td><a href="#" class="btn btn-defaut"><i class="fa fa-plus-circle"></i> Add More Product</a></td></tr><tr><td></td><td><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Quick View"><i class="fa fa-eye"></i></a><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to wishlist"><i class="fa fa-heart"></i></a><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Cart"><i class="fa fa-shopping-cart"></i></a><p class="checkPrice">Check Pricing</p></td><td><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Quick View"><i class="fa fa-eye"></i></a><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to wishlist"><i class="fa fa-heart"></i></a><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Cart"><i class="fa fa-shopping-cart"></i></a><p class="checkPrice">Check Pricing</p></td><td></td><td></td></tr><tr><td><strong>SKU</strong></td><td>32154</td><td>78945</td><td></td><td></td></tr><tr><td><strong>Product Colors</strong></td><td><ul class="colors-list"> <li><a href="#" class="color-link"><span class="color green"></span></a></li><li><a href="#" class="color-link"><span class="color redd"></span></a></li><li><a href="#" class="color-link"><span class="color blue"></span></a></li><li><a href="#" class="color-link"><span class="color teal"></span></a></li><li><a href="#" class="color-link"><span class="color orange"></span></a></li><li><a href="#" class="color-link"><span class="color purple"></span></a></li></ul></td><td><ul class="colors-list"> <li><a href="#" class="color-link"><span class="color green"></span></a></li><li><a href="#" class="color-link"><span class="color redd"></span></a></li><li><a href="#" class="color-link"><span class="color blue"></span></a></li><li><a href="#" class="color-link"><span class="color teal"></span></a></li><li><a href="#" class="color-link"><span class="color orange"></span></a></li><li><a href="#" class="color-link"><span class="color purple"></span></a></li></ul></td><td></td><td></td></tr><tr><td><strong>Features</strong></td><td><p align="justify">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></td><td><p align="justify">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></td><td></td><td></td></tr><tr><td><strong>Summary</strong></td><td><p align="justify">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></td><td><p align="justify">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></td><td></td><td></td></tr></tbody></table></div></div></div></div></div>',
    //     attributes: {
    //         class: 'fa fa-random',
    //         title: 'Compare Products',
    //     },
    //     category: 'Ecommerce Blocks'
    // });

    // bm.add('productWishlist', {
    //     label: 'My Wishlist',
    //     content: '<div style="display: block; min-height: 20px;"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"> <style type="text/css"> .myCartListings{background-color: #eee; transition: 0.2s all linear; margin: 20px; padding: 20px;}.myCartListings:hover{box-shadow: 0px 0px 10px #999; transition: 0.2s all linear;}#productImage{padding: 0px 0px 0px 5px;}h4{padding-top: 1%}.colorofproduct{border: solid 2px black; margin: 2px;}#comment{margin-top: 5%;}button.remove{float: right; margin-top: 1%}}</style> <div class="container" id="myCartListings"> <div class="row"><div class="col-md-5"><h3>My Wishlist</h3></div></div><hr> <div class="col-md-12 myCartListings"> <div id="productImage" class="col-md-4"><img src="http://placehold.it/500x500" width="100%" height="50%"></div><div id="Productdetails" class="col-md-8"> <button class="btn btn-danger remove"><i class="fa fa-trash-o danger" aria-hidden="true"></i></button> <h2>Product Title</h2> <h4>Item # : CODE</h4> <h4>USD ($) 99.99 (R) Qty. 0-100</h4> <h4>Product Description</h4> <hr> <h6>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h6> <br><div id="colorofproductdiv"><img src="http://www.swedausa.com/product/color/137.jpg" height="27px" width="27px" class="colorofproduct"><img src="http://www.swedausa.com/product/color/329.jpg" height="27px" width="27px" class="colorofproduct"><img src="http://www.swedausa.com/product/color/573.jpg" height="27px" width="27px" class="colorofproduct"><img src="http://www.swedausa.com/product/color/329.jpg" height="27px" width="27px" class="colorofproduct"></div></div></div><div class="col-md-12 myCartListings"> <div id="productImage" class="col-md-4"><img src="http://placehold.it/500x500" width="100%" height="50%"></div><div id="Productdetails" class="col-md-8"> <button class="btn btn-danger remove"><i class="fa fa-trash-o danger" aria-hidden="true"></i></button> <h2>Product Title</h2> <h4>Item # : CODE</h4> <h4>USD ($) 99.99 (R) Qty. 0-100</h4> <h4>Product Description</h4> <hr> <h6>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h6> <br><div id="colorofproductdiv"><img src="http://www.swedausa.com/product/color/137.jpg" height="27px" width="27px" class="colorofproduct"><img src="http://www.swedausa.com/product/color/329.jpg" height="27px" width="27px" class="colorofproduct"><img src="http://www.swedausa.com/product/color/573.jpg" height="27px" width="27px" class="colorofproduct"><img src="http://www.swedausa.com/product/color/329.jpg" height="27px" width="27px" class="colorofproduct"></div></div></div></div></div>',
    //     attributes: {
    //         class: 'fa fa-heart',
    //         title: 'My Wishlist',
    //     },
    //     category: 'Ecommerce Blocks'
    // });

    // bm.add('wishlistPopup', {
    //     label: 'Wishlist Popup',
    //     content: '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"> <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"> <style type="text/css">.dropdown{position: relative; display: inline-block; margin-bottom: 0px;}.wishlist{position: absolute; width: 350px; z-index: 1; background-color: #eee; display: none;}.arrow-up{width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-bottom: 15px solid #ECF0F1; left: 0; position: absolute; top: -10px;}.compareProducts{padding: 10px;}.productItem{margin-top: 25px;}</style><div class="upper-links dropdown"> <div id="wrap"> <div id="regbar"> <div id="navthing"> <h4><a href="#" id="wishlist" class="btn btn-link"><i class="fa fa-heart"></i></a> </h4> <div class="wishlist"> <div class="arrow-up"></div><div class="formholder"> <div class="compareProducts"> <h4>My Wishlist</h4> <div class="row productItem"> <div class="col-md-4"> <img src="http://placehold.it/100x100" class="img-responsive"> </div><div class="col-md-8"> <p><strong>Product Title</strong><a href="#" class="btn btn-xs btn-danger pull-right"><i class="fa fa-times"></i></a><br><span class="text-disabled">SKU: 1234</span><br><h4>$12.99</h4> <i>Qty. 2</i> </p><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Cart"><i class="fa fa-shopping-cart"></i></a> <a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><i class="fa fa-heart"></i></a> </div></div><div class="row productItem"> <div class="col-md-4"> <img src="http://placehold.it/100x100" class="img-responsive"> </div><div class="col-md-8"> <p><strong>Product Title</strong><a href="#" class="btn btn-xs btn-danger pull-right"><i class="fa fa-times"></i></a><br><span class="text-disabled">SKU: 1234</span><br><h4>$12.99</h4> <i>Qty. 2</i> </p><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Cart"><i class="fa fa-shopping-cart"></i></a> <a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><i class="fa fa-heart"></i></a> </div></div><div class="row" align="center"> <hr> <a href="#" class="btn btn-default">Remove All</a> <a href="#" class="btn btn-default">Go to Compare</a> </div></div></div></div></div></div></div></div></div>',
    //     attributes: {
    //         class: 'fa fa-heart-o',
    //         title: 'Wishlist Popup',
    //     },
    //     category: 'Ecommerce Blocks'
    // });

    // bm.add('comparePopup', {
    //     label: 'Compare Popup',
    //     content: '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet"> <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"> <style type="text/css">.dropdown{position: relative; display: inline-block; margin-bottom: 0px;}.compare{position: absolute; width: 350px; z-index: 1; background-color: #eee; display: none;}.arrow-up{width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-bottom: 15px solid #ECF0F1; left: 0; position: absolute; top: -10px;}.compareProducts{padding: 10px;}.productItem{margin-top: 25px;}</style><div class="upper-links dropdown"> <div id="wrap"> <div id="regbar"> <div id="navthing"> <h4><a href="#" id="compare" class="btn btn-link"><i class="fa fa-random"></i></a> </h4> <div class="compare"> <div class="arrow-up"></div><div class="formholder"> <div class="compareProducts"> <h4>Compare Products</h4> <div class="row productItem"> <div class="col-md-4"> <img src="http://placehold.it/100x100" class="img-responsive"> </div><div class="col-md-8"> <p><strong>Product Title</strong><a href="#" class="btn btn-xs btn-danger pull-right"><i class="fa fa-times"></i></a><br><span class="text-disabled">SKU: 1234</span><br><h4>$12.99</h4> <i>Qty. 2</i> </p><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Cart"><i class="fa fa-shopping-cart"></i></a> <a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><i class="fa fa-heart"></i></a> </div></div><div class="row productItem"> <div class="col-md-4"> <img src="http://placehold.it/100x100" class="img-responsive"> </div><div class="col-md-8"> <p><strong>Product Title</strong><a href="#" class="btn btn-xs btn-danger pull-right"><i class="fa fa-times"></i></a><br><span class="text-disabled">SKU: 1234</span><br><h4>$12.99</h4> <i>Qty. 2</i> </p><a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Cart"><i class="fa fa-shopping-cart"></i></a> <a href="#" class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Add to Wishlist"><i class="fa fa-heart"></i></a> </div></div><div class="row" align="center"> <hr> <a href="#" class="btn btn-default">Remove All</a> <a href="#" class="btn btn-default">Go to Compare</a> </div></div></div></div></div></div></div></div></div>',
    //     attributes: {
    //         class: 'fa fa-random',
    //         title: 'Compare Popup',
    //     },
    //     category: 'Ecommerce Blocks'
    // });

    bm.add('productSearchFilter', {
        label: 'Product Search Filter',
        content: '<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" crossorigin="anonymous"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet"><productSearchFilter  style="display: block; width: 100%;padding:15px; vertical-align: middle;"><div class="reomve-texts"> <i class="fa fa-search"></i> <label style="margin: inherit;">Product Search Filter</label></div></productSearchFilter>',
        attributes: {
            class: 'fa fa-filter',
            title: 'Product search Filter'
        },
        category: 'Ecommerce Blocks'
    });

    // bm.add('Slider', {
    //     label: 'Slider',
    //     content: '<Slider style="display: block; min-height: 50px"> <style>#slider{margin: 0 auto; width: 1146px; position: relative;}#slides{background: #fff; padding: 5px; -webkit-box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; -moz-box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; -o-box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; -ms-box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; box-shadow: 2px 2px 4px #333, inset 1px 1px 0 #ddd; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;}.inner{width: 500%;}.inner:after{display: block; height: 0; clear: both;}.page{float: left; width: 20%;}.page img{width: 100%; height: 466px;}#overflow{overflow: hidden;}#slider input{display: none;}#controls{position: absolute; width: 100%; top: 216px; left: 0; height: 50px;}#controls label{display: none; opacity: 0.3; cursor: pointer;}#controls label:hover{opacity: 0.8;}#slide1:checked ~ #controls label:nth-child(2), #slide2:checked ~ #controls label:nth-child(3), #slide3:checked ~ #controls label:nth-child(4), #slide4:checked ~ #controls label:nth-child(5), #slide5:checked ~ #controls label:nth-child(1){width: 0; height: 0; border-top: 20px solid transparent; border-left: 20px solid #333; border-bottom: 20px solid transparent; float: right; margin-right: -30px; display: block;}#slide1:checked ~ #controls label:nth-child(5), #slide2:checked ~ #controls label:nth-child(1), #slide3:checked ~ #controls label:nth-child(2), #slide4:checked ~ #controls label:nth-child(3), #slide5:checked ~ #controls label:nth-child(4){width: 0; height: 0; border-top: 20px solid transparent; border-bottom: 20px solid transparent; border-right: 20px solid rgb(51, 51, 51); float: left; display: block; margin-left: -27px;}#slide1:checked ~ #slides .inner{margin-left: 0;}#slide2:checked ~ #slides .inner{margin-left: -100%;}#slide3:checked ~ #slides .inner{margin-left: -200%;}#slide4:checked ~ #slides .inner{margin-left: -300%;}#slide5:checked ~ #slides .inner{margin-left: -400%;}#active{text-align: center; margin-top: 10px; text-align: center; vertical-align: middle; padding-right: 3px;}#active label{padding: 6px; width: 230px; height: 53px; background: #f1f1f1; display: table-cell; cursor: pointer; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; line-height: 19px; font-family: sans-serif; font-size: small;}#active label:hover{background: #c4bebe;}#slide1:checked ~ #active label:nth-child(1), #slide2:checked ~ #active label:nth-child(2), #slide3:checked ~ #active label:nth-child(3), #slide4:checked ~ #active label:nth-child(4), #slide5:checked ~ #active label:nth-child(5){background: #dddddd;}#slides .inner{-webkit-transition: all 0.8s ease-in-out; -moz-transition: all 0.8s ease-in-out; -ms-transition: all 0.8s ease-in-out; -o-transition: all 0.8s ease-in-out; transition: all 0.8s ease-in-out;}</style> <div id="slider"> <input type="radio" id="slide1" name="slider" checked/> <input type="radio" id="slide2" name="slider"/> <input type="radio" id="slide3" name="slider"/> <input type="radio" id="slide4" name="slider"/> <input type="radio" id="slide5" name="slider"/> <div id="slides"> <div id="overflow"> <div class="inner"> <div class="page"><img src="http://placehold.it/1146x466" alt=""/> </div><div class="page"><img src="http://placehold.it/1146x466" alt=""/> </div><div class="page"><img src="http://placehold.it/1146x466" alt=""/> </div><div class="page"><img src="http://placehold.it/1146x466" alt=""/> </div><div class="page"><img src="http://placehold.it/1146x466" alt=""/> </div></div></div></div><div id="controls"> <label for="slide1"></label> <label for="slide2"></label> <label for="slide3"></label> <label for="slide4"></label> <label for="slide5"></label> </div><div id="active"> <label for="slide1"> <p>IT\'S A WRAP</p></label> <label for="slide2"> <p>CHECK OUT OUR <br>Autumn Savings</p></label> <label for="slide3"> <p>New! <br>Light Up Pen!</p></label> <label for="slide4"> <p>INTRODUCING... <br>Sweda Outlet</p></label> <label for="slide5"> <p>Take 40% Off</p></label> </div></div></Slider>',
    //     attributes: {
    //         class: 'fa fa-code',
    //         title: 'Slider'
    //     },
    //     category: 'Ecommerce Blocks'
    // });




    // Full Home Page Layout
    bm.add('accordion', {
        label: 'accordion',
        content: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"><div class="container"> <div class="accordion-option"> <h3 class="title">TITLE</h3> <a href="javascript:void(0)" class="toggle-accordion active" accordion-id="#accordion"></a> </div><div class="clearfix"></div><div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true"> <div class="panel panel-default"> <div class="panel-heading" role="tab" id="headingOne"> <h4 class="panel-title"> <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne"> Collapsible Group Item #1 </a> </h4> </div><div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne"> <div class="panel-body"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS. </div></div></div><div class="panel panel-default"> <div class="panel-heading" role="tab" id="headingTwo"> <h4 class="panel-title"> <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo"> Collapsible Group Item #2 </a> </h4> </div><div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo"> <div class="panel-body"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS. </div></div></div><div class="panel panel-default"> <div class="panel-heading" role="tab" id="headingThree"> <h4 class="panel-title"> <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="true" aria-controls="collapseThree"> Collapsible Group Item #3 </a> </h4> </div><div id="collapseThree" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingThree"> <div class="panel-body"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS. </div></div></div></div></div>',
        attributes: {
            class: 'fa fa-bars',
            title: 'accordion'
        },
        category: 'Special Component'
    });

    // ReUseComponent
    bm.add('ReUseComponent', {
        label: 'ReUse Component',
        content: '<ReUseComponent style="display: block; width: 100%; min-height:20px"><div style="border:solid black 2px"></div></ReUseComponent>',
        attributes: {
            class: 'fa fa-recycle',
            title: 'ReUse Component'
        },
        category: 'Special Component'
    });

    // HandlebarComponent
    bm.add('HandlebarComponent', {
        label: 'Handlebar Component',
        content: '<HandlebarComponent id="handlebarcomponent" style="padding:10px;display: block; width: 100%; min-height:60px"></HandlebarComponent>',
        attributes: {
            class: 'fa fa-code',
            title: 'Handlebar Component'
        },
        category: 'Special Component'
    });

    // VueComponent
    // bm.add('VueComponent', {
    //   label: 'Vue Component',
    //   content: '<VueComponent style="display: block; width: 100%; min-height:20px"><div style="border:solid black 2px"></div></VueComponent>',
    //   attributes: {
    //     class: 'fa fa-home',
    //     title: 'Vue Component'
    //   },
    //   category: 'Special Component'
    // });

    bm.add('progressBar', {
        label: 'Progress Bar',
        content: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><progressBar style="display: block; width: 100%; padding: 5px"><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:40%"> 40%</div></div></progressBar>',
        attributes: {
            class: 'fa fa-spinner',
            title: 'Progress Bar',
        },
        category: 'Special Component'
    });


    bm.add('SliderCustom', {
        label: 'Custom Slider',
        content: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.carousel.min.css"/><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.theme.min.css"/><script src="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.carousel.min.js"></script><style>.row {display: flex !important;}</style><CustomSliderComponent class="c-slider" style="display: block; width: 100%; min-height:60px"><div style="border:solid black 2px"></div></CustomSliderComponent>',
        attributes: {
            class: 'fa fa-sliders',
            title: 'Custom Slider',
        },
        category: 'Special Component'
    });

    // Invoice Filters
    // bm.add('InvoiceDetail', {
    //     label: 'Invoice',
    //     content: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><InvoiceDetail style="display: block; width: 100%;padding:15px"> <h3> Invoices </h3> <table class="table table-bordered table-striped table-collapsed"> <th>Id</th> <th>Name</th> <th>Date</th> <th>Amount Paid</th> <th>Amount Due</th> <th> Total Amount </th><div class="invoiceTableBody"></div></table> </InvoiceDetail>',
    //     attributes: {
    //         class: 'fa fa-file-text-o',
    //         title: 'Invoice Page',
    //     },
    //     category: 'Accounting Components'
    // });



    // bm.add('InvoiceCustomer', {
    //     label: 'Customers',
    //     content: '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/css/bootstrap-select.min.css"></head> <InvoiceFilter style="display: block; width: 100%;padding:15px"><div class="container"><div class="form-group"> <label>status</label> <select class="form-control" id="Select1" style="width: 100px !important; min-width: 100px; max-width: 100px;"><option>Select</option><option>Paid</option><option>Unpaid</option> </select></div><div class="form-group"><div class="form-group row"><div class="col-xs-2"> <label>Amount</label> <select class="form-control" id="Select2" style="width: 150px !important; min-width: 150px; max-width: 150px;"><option>Select</option><option>Paid</option><option>Unpaid</option><option>Total</option> </select></div><div class="col-xs-2"> <label> choice</label> <select class="form-control" id="Select3" style="width: 150px !important; min-width: 150px; max-width: 150px;"><option>Select</option><option>Greater Than</option><option>less Than</option> </select></div></div></div></div> </InvoiceFilter></html>',
    //     attributes: {
    //         class: 'fa fa-users',
    //         title: 'Invoice Page',
    //     },
    //     category: 'Accounting Components'
    // });

    // bm.add('InvoiceFilter', {
    //     label: 'Invoice Filter',
    //     content: '<div><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/css/bootstrap-select.min.css"> <InvoiceFilter style="display: block; width: 100%;padding:15px"><div class="container"><div class="form-group"> <label>status</label> <select class="form-control ye no y n s" id="menu" style="width: 150px !important; min-width: 160px; max-width: 160px;" onChange="checkOption(this)"><option value="Select">Select</option><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option> </select></div><div class="form-group"><div class="form-group row"><div class="col-xs-2"> <label>Select Amount</label> <select class="form-control yes no y n s" id="Select2" style="width: 150px !important; min-width: 160px; max-width: 160px;" onChange="checkOption(this)"><option value="Select">Select</option><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option><option value="Total">Total</option> </select></div><div class="col-xs-2"> <label> choice</label> <select class="form-control yes no y n s" id="Select3" style="width: 150px !important; min-width: 160px; max-width: 160px;"><option>Select</option><option>Greater Than Or Equal To</option><option>less ThanOr Equal To</option> </select></div><div class="col-xs-2"> <label> Amount </label> <input id="input" class="form-control yes no y n s" id="text1" style="width: 150px !important; min-width: 160px; max-width: 160px;" type="text"></div></div></div><div class="form-group"><div class="form-group row"><div class="col-xs-2"> <label>Select Date</label> <select class="form-control yes ye y n s" id="Select4" style="width: 150px !important; min-width: 160px; max-width: 160px;" onChange="checkOption(this)"><option value="Select">Select</option><option value="Due_Date">Due Date</option><option value="Gen_Date">Generation Date</option> </select></div><div class="col-xs-2"> <label> choice</label> <select class="form-control yes ye y n s" id="Select5" style="width: 150px !important; min-width: 160px; max-width: 160px;"><option>Select</option><option>Greater Than Or Equal To</option><option>less ThanOr Equal To</option> </select></div><div class="col-xs-2"> <label> Choose Date </label> <input type="date" class="form-control yes ye y n s" id="date1" style="width: 100px !important; min-width: 160px; max-width: 160px;"></div></div></div><div class="form-group"><div class="form-group row"><div class="col-xs-2"> <label> Choose Date </label> <input type="date" class="form-control yes ye no n s" id="date2" style="width: 150px !important; min-width: 160px; max-width: 160px;" onChange="checkOption(this)"></div><div class="col-xs-2"> <label style="margin-top: 25px;margin-left: 50px;"> To </label></div><div class="col-xs-2"> <label> Choose Date </label> <input type="date" class="form-control yes ye no n s" id="date3" style="width: 150px !important; min-width: 160px; max-width: 160px;"></div></div></div><div class="form-group"><div class="form-group row"><div class="col-xs-2"> <label> Name </label> <input class="form-control yes ye no y s" id="text2" style="width: 150px !important; min-width: 160px; max-width: 160px;" type="text" onkeyup="check(this)"></div><div class="col-xs-2"> <label> Choose Date </label> <input type="date" class="form-control yes ye no y s" id="date4" style="width: 150px !important; min-width: 160px; max-width: 160px;"></div><div class="col-xs-2"> <label> Paid Amount </label> <input class="form-control yes ye no y s" id="text3" style="width: 150px !important; min-width: 160px; max-width: 160px;" type="text"></div><div class="col-xs-2"> <label> Total Amount </label> <input class="form-control yes ye no y s" id="text4" style="width: 150px !important; min-width: 160px; max-width: 160px;" type="text"></div></div></div><div class="form-group"><h3> Invoices</h3><table class="table table-bordered table-striped table-collapsed" id="tbdata"> <th>  </th> <th>Id</th><th>Name</th><th>Date</th><th>Amount Paid</th><th>Amount Due</th><th> Total Amount</th></table><input type="text" style="width: 100px; padding: 2px; border: 1px solid black"/></div></div> </InvoiceFilter></div>',
    //     attributes: {
    //         class: 'fa fa-filter',
    //         title: 'Invoice Filter',
    //     },
    //     category: 'Accounting Components'
    // });

    // bm.add('InvoicePayment', {
    //     label: 'Payment',
    //     content: '<InvoicePayment style="display: block; width: 100%;padding:15px"><div class="container"><div class="form-group"> <input type="submit" class="btn btn-success pull-right" value="Pay Now" style="width: 150px !important; min-width: 160px; max-width: 160px; margin-right: 2px;"></div></div></InvoicePayment>',
    //     attributes: {
    //         class: 'fa fa-cc-paypal',
    //         title: 'Invoice Payment',
    //     },
    //     category: 'Accounting Components'
    // });





    // bm.add('ShoppingCart', {
    //     label: 'Shopping Cart',
    //     content: '<ShoppingCart  style="display: block; width: 100%;padding:15px; vertical-align: middle;"><div id="ShoppingCart_append"><i class="fa fa-shopping-cart"></i> <label style="margin: inherit;">Shopping Cart</label></div></ShoppingCart>',
    //     attributes: {
    //         class: 'fa fa-shopping-cart',
    //         title: 'Shopping cart',
    //     },
    //     category: 'Payment Components'
    // });


    // Get DomComponents module
    var comps = editor.DomComponents;

    // Get the model and the view from the default Component type
    var defaultType = comps.getType('default');
    var defaultModel = defaultType.model;
    var defaultView = defaultType.view;
    var traits;


    editor.TraitManager.addType('filterall', {
        /**
        * Returns the input element
        * @return {HTMLElement}
        */
        getInputEl: function () {
            if (!this.inputEl) {
                var input = document.createElement('textarea');
                input.value = this.target.get('content');
                this.inputEl = input;
            }
            return this.inputEl;
        },

        /**
         * Triggered when the value of the model is changed
         */
        getValueForTarget: function () {
            console.log("inside getValueForTargetss")
            return 'filterAll.' + this.model.get('value');
        }
    });





    // The `input` will be the Component type ID
    comps.addType('productListing', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [
                    'id', {
                        label: 'API URL',
                        name: 'apiurl',
                        type: 'select',
                        options: urlVarValue
                    }, {
                        label: 'Items',
                        name: 'numberofitems',
                        type: 'text'
                    }, {
                        label: 'Template',
                        name: 'selecttemplate',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Template'
                        }, {
                            value: 'portrait',
                            name: 'Portrait'
                        }, {
                            value: 'landscape',
                            name: 'Landscape'
                        }, {
                            value: 'creative',
                            name: 'Creative'
                        }]
                    }
                ],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'PRODUCTLISTING') {
                    return {
                        type: 'productListing'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    // The `input` will be the Component type ID
    comps.addType('popularProducts', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [
                    'id', {
                        label: 'API URL',
                        name: 'apiurl'
                    }, {
                        label: 'Username',
                        name: 'apiusername',
                        type: 'text'
                    }, {
                        label: 'Password',
                        name: 'apipassword',
                        type: 'password'
                    }, {
                        label: 'Items',
                        name: 'numberofitems',
                        type: 'text'
                    }
                ],
            }),
        }, {
            isComponent: function(el) {
                if (el.tagName == 'POPULARPRODUCTS') {
                    return {
                        type: 'popularProducts'
                    };
                }
            },
        }),
        view: defaultType.view,
        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    comps.addType('navimenu', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'menuId',
                    name: 'menuId',
                    type: 'select',
                    options: menuNames,
                }],
            }),
        }, {
            isComponent: function(el) {
                if (el.tagName == 'NAV') {
                    return {
                        type: 'navimenu'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    comps.addType('Slider', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'Image1 URL',
                    name: 'image1',
                    type: 'text'
                }, {
                    label: 'Image2 URL',
                    name: 'image2',
                    type: 'text'
                }, {
                    label: 'Image3 URL',
                    name: 'image3',
                    type: 'text'
                }, {
                    label: 'Image4 URL',
                    name: 'image4',
                    type: 'text'
                }, {
                    label: 'Image5 URL',
                    name: 'image5',
                    type: 'text'
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'SLIDER') {
                    return {
                        type: 'Slider'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });


    comps.addType('Pagination', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'Name [A-Z] ',
                    name: 'nameaz',
                    type: 'checkbox'
                }, {
                    label: 'Name [Z-A] ',
                    name: 'nameza',
                    type: 'checkbox'
                }, {
                    label: 'Price [Low-High] ',
                    name: 'pricelh',
                    type: 'checkbox'
                }, {
                    label: 'Price [High-Low] ',
                    name: 'pricehl',
                    type: 'checkbox'
                }, {
                    label: '#Item [A-Z] ',
                    name: 'itemaz',
                    type: 'checkbox'
                }, {
                    label: '#Item [Z-A] ',
                    name: 'itemza',
                    type: 'checkbox'
                }],
            }),
        }, {
            isComponent: function(el) {
                if (el.tagName == 'PAGINATION') {
                    return {
                        type: 'Pagination'
                    };
                }
            },
        }),
        view: defaultType.view,
        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });



    comps.addType('imageanimation', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'Color 1',
                    name: 'color1',
                    type: 'color'
                }, {
                    label: 'Color 2',
                    name: 'color2',
                    type: 'color'
                }, {
                    label: 'Color 3',
                    name: 'color3',
                    type: 'color'
                }, {
                    label: 'Color 4',
                    name: 'color4',
                    type: 'color'
                }, {
                    label: 'Color 5',
                    name: 'color5',
                    type: 'color'
                }, {
                    label: 'Color 6',
                    name: 'color6',
                    type: 'color'
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'IMAGEANIMATION') {
                    return {
                        type: 'imageanimation'
                    };
                }
            },
        }),
        view: defaultType.view,
        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });




    comps.addType('productReactiveSearch', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [

                    {
                        label: 'API URL',
                        name: 'apiurl'
                    }, {
                        label: 'Username',
                        name: 'apiusername',
                        type: 'text'
                    }, {
                        label: 'Password',
                        name: 'apipassword',
                        type: 'password'
                    }, {
                        label: 'Search',
                        name: 'selectadvance_search_Filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'category',
                        name: 'selectcategory_Filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'Prices',
                        name: 'selectPrices_Filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'Colours',
                        name: 'selectColours_Filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'Brands',
                        name: 'selectBrands_Filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'Themes',
                        name: 'selecttheme_Filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'portrait',
                            name: 'Portrait'
                        }, {
                            value: 'landscape',
                            name: 'Landscape'
                        }]
                    }
                ],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'PRODUCTREACTIVESEARCH') {
                    return {
                        type: 'productReactiveSearch'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });




    comps.addType('progressBar', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'Progress %',
                    name: 'progress',
                    type: 'text'
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'PROGRESSBAR') {
                    return {
                        type: 'progressBar'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });




    // All Product Filters and Invoice Settings
    comps.addType('InvoiceDetail', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                        label: 'API URL Invoice',
                        name: 'apiurl'
                    }
                    // {
                    //   label: 'Domain',
                    //   name: 'selectdomain',
                    //   type: 'select',
                    //   // changeProp: 1,
                    //   options: [{value: 'Select', name:'Select Domain'},{value: 'QB', name:'QB'},{value: 'Xero', name:'Xero'}]
                    // }
                ],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'INVOICEDETAIL') {
                    return {
                        type: 'InvoiceDetail'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });


    comps.addType('InvoiceCustomer', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'API URL Customer',
                    name: 'apiurl'
                        //  options: [{value: 'select', name:'Select Menu Type'},{value: 'mini', name:'Mini Top'},{value: 'mainNavigation', name:'Main Navigation'},{value: 'footerNav', name:'Footer Nvigation'}]
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'INVOICECUSTOMER') {
                    return {
                        type: 'InvoiceCustomer'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    comps.addType('InvoiceFilter', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'API URL Filter',
                    name: 'apiurl'
                        //  options: [{value: 'select', name:'Select Menu Type'},{value: 'mini', name:'Mini Top'},{value: 'mainNavigation', name:'Main Navigation'},{value: 'footerNav', name:'Footer Nvigation'}]
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'INVOICEFILTER') {
                    return {
                        type: 'InvoiceFilter'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    comps.addType('InvoicePayment', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'API URL Payment',
                    name: 'apiurl'
                        //  options: [{value: 'select', name:'Select Menu Type'},{value: 'mini', name:'Mini Top'},{value: 'mainNavigation', name:'Main Navigation'},{value: 'footerNav', name:'Footer Nvigation'}]
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'INVOICEPAYMENT') {
                    return {
                        type: 'InvoicePayment'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    comps.addType('productFilters', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'API URL product filter',
                    name: 'apiurl'
                        //  options: [{value: 'select', name:'Select Menu Type'},{value: 'mini', name:'Mini Top'},{value: 'mainNavigation', name:'Main Navigation'},{value: 'footerNav', name:'Footer Nvigation'}]
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'PRODUCTFILTERS') {
                    return {
                        type: 'productFilters'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    comps.addType('productCategory', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'API URL',
                    name: 'apiurl'
                        //  options: [{value: 'select', name:'Select Menu Type'},{value: 'mini', name:'Mini Top'},{value: 'mainNavigation', name:'Main Navigation'},{value: 'footerNav', name:'Footer Nvigation'}]
                }, {
                    label: 'Username',
                    name: 'apiusername',
                    type: 'text'
                }, {
                    label: 'Password',
                    name: 'apipassword',
                    type: 'password'
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'PRODUCTCATEGORY') {
                    return {
                        type: 'productCategory'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    comps.addType('productColors', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'API URL',
                    name: 'apiurl_color'
                }, {
                    label: 'Username',
                    name: 'apiusername_color',
                    type: 'text'
                }, {
                    label: 'Password',
                    name: 'apipassword_color',
                    type: 'password'
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'PRODUCTCOLORS') {
                    return {
                        type: 'productColors'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    comps.addType('productBrand', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'API URL',
                    name: 'apiurl_brand'
                }, {
                    label: 'Username',
                    name: 'apiusername_brand',
                    type: 'text'
                }, {
                    label: 'Password',
                    name: 'apipassword_brand',
                    type: 'password'
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'PRODUCTBRAND') {
                    return {
                        type: 'productBrand'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });

    comps.addType('productTags', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'API URL',
                    name: 'apiurl_brand'
                }, {
                    label: 'Username',
                    name: 'apiusername_brand',
                    type: 'text'
                }, {
                    label: 'Password',
                    name: 'apipassword_brand',
                    type: 'password'
                }],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'PRODUCTTAGS') {
                    return {
                        type: 'productTags'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });




    comps.addType('gformpanel', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                draggable: 'gform, gform *'
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'GFORMPANEL') {
                    return {
                        type: 'gformpanel'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });









    comps.addType('productSearchFilter', {
        // Define the Model
        model: defaultModel.extend({
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [

                    {
                        label: 'API URL',
                        name: 'apiurl',
                        type: 'select',
                        options: urlVarValue
                    }, {
                        label: 'Search',
                        name: 'selectadvance_search_filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'category',
                        name: 'selectcategory_filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'Prices',
                        name: 'selectprices_filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'Colours',
                        name: 'selectcolours_filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'Brands',
                        name: 'selectbrands_filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'true',
                            name: 'True'
                        }, {
                            value: 'false',
                            name: 'False'
                        }]
                    }, {
                        label: 'Themes',
                        name: 'selecttheme_filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'portrait',
                            name: 'Portrait'
                        }, {
                            value: 'landscape',
                            name: 'Landscape'
                        }]
                    },
                    {
                        label: 'Price For Anonymous User',
                        name: 'select_anonymousUser_filter',
                        type: 'select',
                        // changeProp: 1,
                        options: [{
                            value: 'select',
                            name: 'Select Filter'
                        }, {
                            value: 'yes',
                            name: 'Yes'
                        }, {
                            value: 'no',
                            name: 'No'
                        }]
                    }
                ],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'PRODUCTSEARCHFILTER') {
                    return {
                        type: 'productSearchFilter'
                    };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });









    // dataField components

    //   var getCookiebyName = function (name) {
    //   var pair = document.cookie.match(new RegExp(name + '=([^;]+)'));
    //     return !!pair ? pair[1] : null;
    //   };

    //   let cookieValueFun =  getCookiebyName("auth_token")
    //   let arr_collection = new Array();
    //   let arr_schema = []
    //   let arr_coll_schema = new Array()
    //   let settings = {
    //     "async": true,
    //     "crossDomain": true,
    //     "url": "https://api.flowzcluster.tk/dbetl/databases",
    //     "method": "GET",
    //     "headers": {
    //       "authorization": cookieValueFun
    //     }
    //   }

    //   $.ajax(settings).done(function (response) {
    //     for (let index = 0; index < response.data.length; index++) {
    //       arr_collection.push(response.data[index].connection_name)
    //       let settings = {
    //         "async": true,
    //         "crossDomain": true,
    //         "url": "https://api.flowzcluster.tk/dbetl/schema/" + response.data[index].id,
    //         "method": "GET",
    //         "headers": {
    //           "authorization": cookieValueFun
    //         }
    //       }

    //       $.ajax(settings).done(function (response2) {
    //         for (let index2 = 0; index2 < response2.length; index2++) {
    //           collection_name = response.data[index].connection_name
    //           schema_name = response2[index2].name
    //           arr_schema.push({ collection_name: collection_name, schema_name: schema_name })
    //           console.log("arr_schema", arr_schema)
    //         }
    //         arr_coll_schema.push('');
    //         $.each(arr_schema, function (index, value) {
    //           arr_coll_schema.push(value.collection_name + ' : ' + value.schema_name);
    //         });
    //         console.log("arr_coll_schema", typeof arr_coll_schema)
    //       });
    //     }
    //   });




    editor.TraitManager.addType('customConent1', {

        getInputEl: function() {
            if (!this.inputEl) {
                var input = document.createElement('select');
                input.setAttribute("id", "Div1");
                input.setAttribute("name", "Div1");
                input.setAttribute("style", "background:#363636");
                let partialOptions = {};

                ///////////////////////////////

                //$.getJSON(configFileUrl, function(data) {
                storedTemplates = Object.keys(configData[2].layoutOptions[0]);

                for (var i = 0; i < storedTemplates.length; i++) {
                    if (storedTemplates[i] == 'Layout' || storedTemplates[i] == 'pages' || storedTemplates[i] == '.git' || storedTemplates[i] == 'main-files' || storedTemplates[i] == 'assets') {
                        storedTemplates = storedTemplates.splice(i, 1)
                    }
                }

                for (var i = 0; i <= storedTemplates.length - 1; i++) {
                    let resp2 = []
                    $.getJSON(configFileUrl, function(data) {
                        configData = data.configData;



                        // console.log('ReUseVue co2nfigData:', configData);
                        storedTemplates = Object.keys(configData[2].layoutOptions[0]);
                        let partialOptions = {};
                        for (let index = 0; index < storedTemplates.length; index++) {
                            let data_ = storedTemplates[index]
                            for (let index2 = 0; index2 < configData[2].layoutOptions[0][data_].length; index2++) {
                                if (storedTemplates[index].length != 0 && storedTemplates[index] != "Menu" && storedTemplates[index] != "Layout") {
                                    if (configData[2].layoutOptions[0][data_].length >= 2) {
                                        for (let j = 0; j < configData[2].layoutOptions[0][data_].length; j++) {
                                            if (j == 0) {
                                                partialOptions[storedTemplates[index]] = [{
                                                    'name': configData[2].layoutOptions[0][data_][j].value + '.partial'
                                                }]
                                            } else {
                                                partialOptions[storedTemplates[index]].push({
                                                    'name': configData[2].layoutOptions[0][data_][j].value + '.partial'
                                                })
                                            }
                                        }
                                    } else {
                                        partialOptions[storedTemplates[index]] = [{
                                            'name': configData[2].layoutOptions[0][data_][index2].value + '.partial'
                                        }]
                                    }
                                }

                            }
                        }



                        $('<option />').html('-- Select --').appendTo(input);
                        $.each(partialOptions, function(key, value) {
                            var group = $('<optgroup label="' + key + '" />');
                            $.each(value, function() {
                                $('<option />').html(this.name).appendTo(group);
                            });
                            group.appendTo(input);
                        });
                        //  console.log('group', group);

                    });
                }

                //        });

                //////////////////////////////
                /*
                $.each(partialOptions, function(key, value) {
                    var group = $('<optgroup label="' + key + '" />');
                    $.each(value, function() {
                        $('<option />').html(this.name).appendTo(group);
                    });
                    group.appendTo(input);
                }); */
                input.value = this.target.get('customConent1');
                this.inputEl = input;
            }
            return this.inputEl;
        },

    });

    comps.addType('ReUseComponent', {
        model: defaultModel.extend({
            init() {
                this.listenTo(this, 'change:selectPartial', this.doStuff);
            },
            doStuff() {
                var label, selected_value;
                var folderUrl = localStorage.getItem("folderUrl");
                $('#Div1').on('click', function() {
                    label = $(this.options[this.selectedIndex]).closest('optgroup').prop('label');
                    selected_value = $("#Div1 option:selected").text();
                    let model = editor.getSelected();
                    var split_selected_value = selected_value.split(".");
                    if (split_selected_value[1] == "partial") {
                        model.components("");
                        model.components("{{> " + label + " id='" + selected_value + "' }}");
                    } else if (split_selected_value[1] == "vue") {
                        model.components('<component :is="' + split_selected_value[0] + '">' + selected_value + '</component>');
                    }
                });
            },
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'PartialName',
                    name: 'selectPartial',
                    type: 'customConent1',
                    changeProp: 1,
                }],
            }),
        }, {
            isComponent: function(el) {
                if (el.tagName == 'REUSECOMPONENT') {
                    return {
                        type: 'ReUseComponent'
                    };
                }
            },
        }),
        view: defaultType.view,
        render: function() {
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here';
            return this;
        },
    });

    comps.addType('CustomSliderComponent', {
        model: defaultModel.extend({
            init() {
                this.listenTo(this, 'change:selectPartial', this.doStuff);
            },
            doStuff() {
                var label, selected_value;
                var folderUrl = localStorage.getItem("folderUrl");
                $('#Div1').on('click', function() {
                    label = $(this.options[this.selectedIndex]).closest('optgroup').prop('label');
                    selected_value = $("#Div1 option:selected").text();
                    let model = editor.getSelected();
                    var split_selected_value = selected_value.split(".");
                    if (split_selected_value[1] == "partial") {
                        model.components("");
                        model.components("{{> " + label + " id='" + selected_value + "' }}");
                    } else if (split_selected_value[1] == "vue") {
                        model.components('<component :is="' + split_selected_value[0] + '">' + selected_value + '</component>');
                    }
                });
            },
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                    label: 'Category',
                    name: 'sliderCustom',
                    type: 'select',
                    options: bannerTypes
                    // options: [{'name' : 'hello', 'value':'hello'}, {'name' : 'hello2', 'value':'hello2'}]
                },
                {
                    label: 'Type',
                    name: 'btype',
                    type: 'select',
                    options: [{'name': 'Normal Slider', 'value': 'normal'}, {'name': 'Brand Slider', 'value': 'brand'}]
                },
                {
                    label: 'Autoplay (in ms)',
                    name: 'aplay',
                    type: 'number',
                    value: 5000
                },
                {
                    label: 'Pagination',
                    name: 'pagination',
                    type: 'checkbox',
                    value: true
                },
                {
                    label: 'Navigation',
                    name: 'navigation',
                    type: 'checkbox'
                },
                {
                    label: 'Previous Button Text',
                    name: 'prev',
                    type: 'text',
                    value: 'prev'
                },
                {
                    label: 'Next Button Text',
                    name: 'next',
                    type: 'text',
                    value: 'next'
                },
                {
                    label: 'Slide Speed (in ms)',
                    name: 'slidespeed',
                    type: 'number',
                    value: '200'
                },
                {
                    label: 'Items displayed at a time (for brand slider)',
                    name: 'ditems',
                    type: 'number',
                    value: 5
                }]
            }),
        }, {
            isComponent: function(el) {
                if (el.tagName == 'CUSTOMSLIDERCOMPONENT') {
                    return {
                        type: 'CustomSliderComponent'
                    };
                }
            },
        }),
        view: defaultType.view,
        render: function() {
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here';
            return this;
        },
    });


    // // Vue Component
    // var folderUrlVue = localStorage.getItem("folderUrl");
    // var useremailVue = localStorage.getItem("email");

    // let projectName = folderUrlVue.split('/');
    // projectName = projectName[(projectName.length - 1)];

    // let configFileUrl2 = baseURL + '/project-configuration?userEmail=' + useremailVue + '&websiteName=' + projectName;
    // $.getJSON(configFileUrl2, function(data) {
    //   var configData = data.data[0].configData;;
    //   storedTemplates = Object.keys(configData[2].layoutOptions[0]);
    // });

    // var partialOptions2 = {};

    // setTimeout(function() {
    //   for (var i = 0; i < storedTemplates.length; i++) {
    //     if (storedTemplates[i] == 'Layout' || storedTemplates[i] == 'pages' || storedTemplates[i] == '.git' || storedTemplates[i] == 'main-files' || storedTemplates[i] == 'assets') {
    //       storedTemplates.splice(i, 1)
    //     }
    //   }


    //   for (var i = 0; i <= storedTemplates.length - 1; i++) {
    //     var request = new XMLHttpRequest();
    //     request.open("POST", baseURL + '/get-directory-list?folderUrl=' + folderUrlVue + '/' + "Partials", false);
    //     request.setRequestHeader("Content-type", "application/json");
    //     request.send();
    //     resp = JSON.parse(request.responseText);

    //     for (let index = 0; index < resp.length; index++) {
    //       request.open("POST", baseURL + '/get-directory-list?folderUrl=' + folderUrlVue + '/' + "Partials/" + resp[i], false);
    //       request.setRequestHeader("Content-type", "application/json");
    //       request.send();
    //       resp2 = JSON.parse(request.responseText);
    //     }

    //     if (resp.length != 0 && resp[i] != "Menu") {
    //       console.log("resp", resp)
    //       let counter = 0;
    //       if (resp2.length >= 2) {
    //         for (let j = 0; j < resp2.length; j++) {
    //           var split_selected_value = resp2[j].split(".");
    //           if (split_selected_value[1] == "vue") {
    //             console.log("inside")
    //             if (counter == 0) {
    //               partialOptions2[resp[i]] = [{
    //                 'name': resp2[j]
    //               }]
    //               counter++;
    //             } else {
    //               partialOptions2[resp[i]].push({
    //                 'name': resp2[j]
    //               })
    //             }
    //           }
    //         }
    //       } else {
    //         var resp3 = resp2.toString();
    //         var substring = "vue";
    //         if (resp3.indexOf(substring) !== -1) {
    //           partialOptions2[resp[i]] = [{
    //             'name': resp2
    //           }]
    //         }
    //       }

    //     }
    //   }
    // }, 1000);


    // editor.TraitManager.addType('customConent2', {

    //   getInputEl: function() {
    //     if (!this.inputEl) {
    //       var input = document.createElement('select');
    //       input.setAttribute("id", "Div1");
    //       input.setAttribute("name", "Div1");
    //       input.setAttribute("style", "background:#363636");
    //       $.each(partialOptions2, function(key, value) {
    //         var group = $('<optgroup label="' + key + '" />');
    //         $.each(value, function() {
    //           $('<option />').html(this.name).appendTo(group);
    //         });
    //         group.appendTo(input);
    //       });
    //       input.value = this.target.get('customConent2');
    //       this.inputEl = input;
    //     }
    //     return this.inputEl;
    //   },

    // });



    // comps.addType('VueComponent', {
    //   model: defaultModel.extend({
    //     init() {
    //       this.listenTo(this, 'change:selectPartial', this.doStuff);
    //     },
    //     doStuff() {
    //       var label, selected_value;
    //       var folderUrlVue = localStorage.getItem("folderUrl");
    //       $('#Div1').on('click', function() {
    //         label = $(this.options[this.selectedIndex]).closest('optgroup').prop('label');
    //         selected_value = $("#Div1 option:selected").text();
    //         let model = editor.getSelected();
    //         var split_selected_value = selected_value.split(".");
    //         if (split_selected_value[1] == "vue") {
    //           model.components('<div id="' + split_selected_value[0] + '"><component athname="' + label + '" :is="' + split_selected_value[0] + '">' + selected_value + '</component></div>');
    //         }
    //       });
    //     },
    //     defaults: Object.assign({}, defaultModel.prototype.defaults, {
    //       editable: true,
    //       droppable: true,
    //       traits: [{
    //         label: 'PartialName',
    //         name: 'selectPartial',
    //         type: 'customConent1',
    //         changeProp: 1,
    //       }],
    //     }),
    //   }, {
    //     isComponent: function(el) {
    //       if (el.tagName == 'VUECOMPONENT') {
    //         return {
    //           type: 'VueComponent'
    //         };
    //       }
    //     },
    //   }),
    //   view: defaultType.view,
    //   render: function() {
    //     defaultType.view.prototype.render.apply(this, arguments);
    //     this.el.placeholder = 'Text here';
    //     return this;
    //   },
    // });

    comps.addType('ShoppingCart', {
        model: defaultModel.extend({

            init() {
                this.listenTo(this, 'changeaypal', this.paypalcheck);
                this.listenTo(this, 'change:Stripe', this.stripecheck);
                this.listenTo(this, 'change:AuthorizeDotNet', this.authcheck);
            },

            paypalcheck() {
                // console.log("paypal change event function called")

                // console.log("this.get('traits').where({name:'x_api_token_paypal'})",this.get('traits').where({name:'x_api_token_paypal'})[0].get('value'))
                // console.log("this.get('traits').where({name:'x_api_login_paypal'})",this.get('traits').where({name:'x_api_login_paypal'})[0].get('value'))

                //    this.get('traits').each(function(trait) {
                //            console.log("trait",trait.get('name'));
                //            if (trait.get('name') == 'Paypal') {
                //                    console.log("Inside if paypal")
                //                    // this.get('traits').where({name:'x_api_token_paypal'}).style = "display:none"
                //            }
                //     console.log("trait value",trait.get('value'));
                // });
            },

            stripecheck() {
                // console.log("stripe change event function called")

                // console.log("this.get('traits').where({name:'x_api_token_stripe'})",this.get('traits').where({name:'x_api_token_stripe'})[0].get('value'))
            },

            authcheck() {
                // console.log("auth change event function called")

                // console.log("this.get('traits').where({name:'x_api_token_authdotnet'})",this.get('traits').where({name:'x_api_token_authdotnet'})[0].get('value'))
                // console.log("this.get('traits').where({name:'x_api_login_authdotnet'})",this.get('traits').where({name:'x_api_login_authdotnet'})[0].get('value'))
            },
            // Extend default properties
            defaults: Object.assign({}, defaultModel.prototype.defaults, {
                editable: true,
                droppable: true,
                traits: [{
                        type: 'checkbox',
                        label: 'Paypal',
                        name: 'Paypal',
                    },
                    {
                        label: 'Token',
                        name: 'x_api_token_paypal',
                    },
                    {
                        label: 'Login',
                        name: 'x_api_login_paypal',
                    },
                    {
                        type: 'checkbox',
                        label: 'Stripe',
                        name: 'Stripe',
                    },
                    {
                        label: 'Token',
                        name: 'x_api_token_stripe',
                    },
                    {
                        label: 'Authorize DotNet',
                        name: 'AuthorizeDotNet',
                        type: 'checkbox',
                    },
                    {
                        label: 'Token',
                        name: 'x_api_token_authdotnet',
                    },
                    {
                        label: 'Login',
                        name: 'x_api_login_authdotnet',
                    }
                ],
            }),

        }, {
            isComponent: function(el) {
                if (el.tagName == 'SHOPPINGCART') {
                    return { type: 'ShoppingCart' };
                }
            },
        }),

        view: defaultType.view,

        // The render() should return 'this'
        render: function() {
            // Extend the original render method
            defaultType.view.prototype.render.apply(this, arguments);
            this.el.placeholder = 'Text here'; // <- Doesn't affect the final HTML code
            return this;
        },
    });


     editor.TraitManager.addType('filterall', {
        /**
        * Returns the input element
        * @return {HTMLElement}
        */
        getInputEl: function () {
            if (!this.inputEl) {
                var input = document.createElement('textarea');
                input.value = this.target.get('content');
                this.inputEl = input;
            }
            return this.inputEl;
        },

        /**
         * Triggered when the value of the model is changed
         */
        getValueForTarget: function () {
            console.log("inside getValueForTargetss")
            return 'filterAll.' + this.model.get('value');
        }
    });




})
