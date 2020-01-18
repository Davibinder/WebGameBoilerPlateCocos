var SGRegisterLoginScene = CMBaseScene.extend({
    ctor : function () {
        this._super();
        this.addChild(new SGRegisterLoginLayer());
    }
});

var SGRegisterLoginLayer = CMBaseLayer.extend({
    ctor : function () {
        this._super();
        // this.setBackground(res.rDemoBG);
        this.setupUI();
    },
    onEnter : function () {
        this._super();
        SGAppManager.setAppState(AppState.RegisterLoginScene);
        SGSocketIOManager.webSocketSetup();
    },
    onExit : function () {
        this._super();
    },
    setupUI : function () {
        var logInPanel = new SGLogInPanel();
        logInPanel.setPosition(cc.p(0.0, 0.0));
        this.addChild(logInPanel);
    },

});

//---------------------------------------------------------------
//
// Register Panel
//
//---------------------------------------------------------------

var SGRegisterPanelRef = null;
var SGRegisterPanel = CMBaseLayer.extend({
    REGISTER_TAG            :   40,
    CLOSE_TAG               :   41,
    EDITBOX_UNAME_TAG       :   44,
    EDITBOX_EMAIL_TAG       :   45,
    EDITBOX_PASS_TAG        :   46,
    EDITBOX_CPASS_TAG       :   47,
    editBoxUName            :   null,
    editBoxEmailID          :   null,
    editBoxPass             :   null,
    editBoxCPass            :   null,

    RegisterFailEmptyField      :  10,
    RegisterFailEmailNotValid   :  11,
    RegisterFailPassNotMatching :  21,
    RegsiterSuccess             :  31,
    RegisterStatus              :  0,

    isUserRegistered            : false,

    ctor : function () {
        this._super();
        this.setUpUI();
    },

    onEnter : function () {
        this._super();
        SGRegisterPanelRef = this;
    },

    onExit : function () {
        SGRegisterPanelRef = null;
        this._super();
    },

    setUpUI : function() {
        var regPanelParent  = this.createColourLayer(cc.color(0,0,0,150),this.getContentSize().width,this.getContentSize().height,cc.p(0,0),this);
        var panelBg = this.setBackground(res.rMenuPanelBg);
        this.createTTFLabel("SIGN UP",SGConstants.FontList[1],40,SGConstants.Brown,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.9),panelBg);
        /*
        var uNameLabel      = this.createTTFLabel("User Name:",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(panelBg.getContentSize().width*0.1,panelBg.getContentSize().height*0.7),panelBg);
        uNameLabel.setAnchorPoint(cc.p(0.0,0.5));
        var emailLabel      = this.createTTFLabel("Email Id:",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(panelBg.getContentSize().width*0.1,panelBg.getContentSize().height*0.6),panelBg);
        emailLabel.setAnchorPoint(cc.p(0.0,0.5));
        var pass            = this.createTTFLabel("Password:",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(panelBg.getContentSize().width*0.1,panelBg.getContentSize().height*0.5),panelBg);
        pass.setAnchorPoint(cc.p(0.0,0.5));
        var confirmPass     = this.createTTFLabel("Confirm Password:",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(panelBg.getContentSize().width*0.1,panelBg.getContentSize().height*0.4),panelBg);
        confirmPass.setAnchorPoint(cc.p(0.0,0.5));
        */
        this.addSprite(res.rEditBoxbg,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.7),panelBg);
        this.editBoxUName   = this.createEditBox(res.rEditBoxbg_1,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.7),"User Name",this.EDITBOX_UNAME_TAG,cc.EDITBOX_INPUT_MODE_SINGLELINE,panelBg);
        this.addSprite(res.rEditBoxbg,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.6),panelBg);
        this.editBoxEmailID = this.createEditBox(res.rEditBoxbg_1,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.6),"Email",this.EDITBOX_EMAIL_TAG,cc.EDITBOX_INPUT_MODE_SINGLELINE,panelBg);
        this.addSprite(res.rEditBoxbg,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.5),panelBg);
        this.editBoxPass    = this.createEditBox(res.rEditBoxbg_1,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.5),"Password",this.EDITBOX_PASS_TAG,cc.EDITBOX_INPUT_FLAG_PASSWORD,panelBg);
        this.addSprite(res.rEditBoxbg,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.4),panelBg);
        this.editBoxCPass   = this.createEditBox(res.rEditBoxbg_1,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.4),"Confirm Password",this.EDITBOX_CPASS_TAG,cc.EDITBOX_INPUT_FLAG_PASSWORD,panelBg);

        var okButton = this.createButton(res.rGeneralButton,res.rGeneralButton,"Register",40,this.REGISTER_TAG,cc.p(panelBg.getContentSize().width * 0.5,panelBg.getContentSize().height * 0.2),panelBg);
        okButton.addTouchEventListener(this.buttonCallback, this);
        okButton.setScale(0.75);

        var closeButton = this.createButton(res.rCloseBtn,res.rCloseBtn,"",40,this.CLOSE_TAG,cc.p(this.getContentSize().width * 0.96,this.getContentSize().height * 0.93),this);
    },

    validateData : function(){
        console.log(this.editBoxEmailID.getString());
        if (SGUtility.removeAllWhiteSpaces(this.editBoxUName.getString()) === '' || SGUtility.removeAllWhiteSpaces(this.editBoxEmailID.getString()) === '' || SGUtility.removeAllWhiteSpaces(this.editBoxPass.getString()) === '' || SGUtility.removeAllWhiteSpaces(this.editBoxCPass.getString()) === ''){
            this.RegisterStatus =  this.RegisterFailEmptyField;
        }else if(SGUtility.validateEmailIdText(this.editBoxEmailID.getString()) === false){
            this.RegisterStatus =  this.RegisterFailEmailNotValid;
        }else if(SGUtility.removeAllWhiteSpaces(this.editBoxPass.getString()) != SGUtility.removeAllWhiteSpaces(this.editBoxCPass.getString())){
            this.RegisterStatus =  this.RegisterFailPassNotMatching;
        }else{
            this.RegisterStatus = this.RegsiterSuccess;
        }
        return this.RegisterStatus;
    },

    hideAllChildern : function() {
        this.editBoxUName.setVisible(false);
        this.editBoxEmailID.setVisible(false);
        this.editBoxPass.setVisible(false);
        this.editBoxCPass.setVisible(false);
    },
    showAllChildern : function() {
        this.editBoxUName.setVisible(true);
        this.editBoxEmailID.setVisible(true);
        this.editBoxPass.setVisible(true);
        this.editBoxCPass.setVisible(true);
    },
    /**
     * This method is called when an edit box gains focus after keyboard is shown.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidBegin: function (sender) {
    },

    /**
     * This method is called when an edit box loses focus after keyboard is hidden.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidEnd: function (sender) {
    },

    /**
     * This method is called when the edit box text was changed.
     * @param {cc.EditBox} sender
     * @param {String} text
     */
    editBoxTextChanged: function (sender, text) {
    },

    /**
     * This method is called when the return button was pressed or the outside area of keyboard was touched.
     * @param {cc.EditBox} sender
     */
    editBoxReturn: function (sender) {
    },
    /**
     * Callback for all UIButton's in current scene
     * @param sender
     * @param type
     */
    buttonCallback : function (sender, type) {
        var button = sender;
        var buttonTag = button.tag;
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log(buttonTag);
                switch (buttonTag) {
                    case this.REGISTER_TAG:
                        cc.log('Register button pressed');
                        var result = this.validateData();
                        if (result == this.RegisterFailEmptyField){
                            this.hideAllChildern();
                            SGUtility.createAlertBox("Please enter information in all the fields.","Error!",this,false);

                        } else if(result == this.RegisterFailEmailNotValid){
                            this.hideAllChildern();
                            SGUtility.createAlertBox("Please enter a valid email Id.","Error!",this,false);

                        }else if(result == this.RegisterFailPassNotMatching) {
                            this.hideAllChildern();
                            SGUtility.createAlertBox("Password confirmation fails!","Error!",this,false);
                        }else {
                            CMProcessIndicator.addLoadingIndicator(this);
                            cc.log("api url"+SGAppManager.getAPIBaserURL()+SGConstants.APISignUp);


                            axios({
                                method: 'post',
                                url: SGAppManager.getAPIBaserURL()+SGConstants.APISignUp,
                                data : {
                                    'name': SGUtility.removeAllWhiteSpaces(this.editBoxUName.getString()),
                                    'email': SGUtility.removeAllWhiteSpaces(this.editBoxEmailID.getString().toLowerCase()),
                                    'password': this.editBoxPass.getString(),
                                    'deviceType' : 1,
                                },
                                headers: {
                                    'api_secret' :  SGConstants.API_SECRET
                                }
                            }).then(function (response) {
                                cc.log("Register Response = " + JSON.stringify(response.data));
                                SGRegisterPanelRef.hideAllChildern();
                                if(JSON.stringify(response.data.statusCode) == 200){
                                    SGRegisterPanelRef.isUserRegistered = true;
                                    SGUtility.createAlertBox("User registered successfully.","Message.",SGRegisterPanelRef,false);
                                }else{
                                    SGUtility.createAlertBox(response.data.message,"Message!",SGRegisterPanelRef,false);
                                }
                                CMProcessIndicator.removeLoadingIndicator(SGRegisterPanelRef);
                            }).catch(function (error) {
                                cc.log("Register Error = " + JSON.stringify(error));
                                CMProcessIndicator.removeLoadingIndicator(SGRegisterPanelRef);
                                SGUtility.createAlertBox(error.response.data.message,"Error.",SGRegisterPanelRef,false);
                            });
                        }
                        this.RegisterStatus = 0;
                        break;
                    case this.CLOSE_TAG:
                        this.removeFromParent(true);
                        break;
                }
        }
    },

    /**
     * CMAlertDelegate function
     * @param sender
     */
    okButtonPressed : function (sender) {
        this.showAllChildern();
        if(this.isUserRegistered){
            this.removeFromParent(true);
        }
        sender.getParent().getParent().removeFromParent(true);
    },
    /**
     * CMAlertDelegate function
     * @param sender
     */
    cancelButtonPressed : function (sender) {
        this.showAllChildern();
        sender.getParent().getParent().removeFromParent(true);
    }

});

//---------------------------------------------------------------
//
// Login Panel
//
//---------------------------------------------------------------
var SGLogInPanelRef = null;
var SGLogInPanel = CMBaseLayer.extend({
    LOGIN_TAG               :   50,
    CLOSE_TAG               :   51,
    EDITBOX_EMAIL_TAG       :   52,
    EDITBOX_PASS_TAG        :   53,
    FORGET_PASS_TAG         :   54,
    Register_BUTTON_TAG     :   55,

    emailEditBox            : null,
    passEditBox             : null,

    ctor : function () {
        this._super();
        this.setUpUI();
    },

    onEnter : function () {
        this._super();
        SGLogInPanelRef = this;
    },

    onExit : function () {
        SGLogInPanelRef = null;
        this._super();
    },

    setUpUI : function() {
        var regPanelParent  = this.createColourLayer(cc.color(0,0,0,150),this.getContentSize().width,this.getContentSize().height,cc.p(0,0),this);
        var panelBg = this.setBackground(res.rMenuPanelBg);
        var titleStr = "SIGN IN";
        this.createTTFLabel(titleStr,SGConstants.FontList[1],40,SGConstants.Brown,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.9),panelBg);
        /*
        var emailLabel      = this.createTTFLabel("Email Id:",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(panelBg.getContentSize().width*0.1,panelBg.getContentSize().height*0.6),panelBg);
        emailLabel.setAnchorPoint(cc.p(0.0,0.5));
        var pass            = this.createTTFLabel("Password:",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(panelBg.getContentSize().width*0.1,panelBg.getContentSize().height*0.5),panelBg);
        pass.setAnchorPoint(cc.p(0.0,0.5));
        */

        this.addSprite(res.rEditBoxbg,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.6),panelBg);
        this.emailEditBox = this.createEditBox(res.rEditBoxbg_1,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.6),"Email",this.EDITBOX_EMAIL_TAG,cc.EDITBOX_INPUT_MODE_SINGLELINE,panelBg);
        this.addSprite(res.rEditBoxbg,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.5),panelBg);
        this.passEditBox  = this.createEditBox(res.rEditBoxbg_1,cc.p(panelBg.getContentSize().width*0.5,panelBg.getContentSize().height*0.5),"Password",this.EDITBOX_PASS_TAG,cc.EDITBOX_INPUT_FLAG_PASSWORD,panelBg);

        var loginButton = this.createButton(res.rGeneralButton,res.rGeneralButton,"Login",40,this.LOGIN_TAG,cc.p(panelBg.getContentSize().width * 0.3,panelBg.getContentSize().height * 0.3),panelBg);
        loginButton.addTouchEventListener(this.buttonCallback, this);
        loginButton.setScale(0.75);

        var regButton = this.createButton(res.rGeneralButton,res.rGeneralButton,"Register",40,this.Register_BUTTON_TAG,cc.p(panelBg.getContentSize().width * 0.7,panelBg.getContentSize().height * 0.3),panelBg);
        regButton.addTouchEventListener(this.buttonCallback, this);
        regButton.setScale(0.75);

        var forgetPassMenuItem = new cc.MenuItemLabel(new cc.LabelTTF("Forgot Password?",SGConstants.FontList[1],20,cc.size(0.,0),cc.TEXT_ALIGNMENT_CENTER),this.onMenucallBack,this);
        forgetPassMenuItem.setColor(SGConstants.Brown);
        forgetPassMenuItem.setTag(this.FORGET_PASS_TAG);
        forgetPassMenuItem.setPosition(cc.p(panelBg.getContentSize().width * 0.5 ,panelBg.getContentSize().height * 0.15));
        this.createTTFLabel("______________",SGConstants.FontList[1],20,SGConstants.Brown,cc.p(forgetPassMenuItem.getContentSize().width*0.49,forgetPassMenuItem.getContentSize().height*0.4),forgetPassMenuItem);


        var menu = new cc.Menu(forgetPassMenuItem);
        menu.setPosition(cc.p(0.0,0.0));
        panelBg.addChild(menu);

        // this.createButton(res.rCloseBtn,res.rCloseBtn,"",40,this.CLOSE_TAG,cc.p(this.getContentSize().width * 0.96,this.getContentSize().height * 0.93),this);

    },

    validateData : function(){
        if(SGUtility.removeAllWhiteSpaces(this.emailEditBox.getString()) == '' || SGUtility.removeAllWhiteSpaces(this.passEditBox.getString()) == '' ){
            return false;
        }
        return true;
    },
    hideAllChildern : function(){
        this.emailEditBox.setVisible(false);
        this.passEditBox.setVisible(false);
    },
    showAllChildern : function(){
        this.emailEditBox.setVisible(true);
        this.passEditBox.setVisible(true);
    },
    /**
     * This method is called when an edit box gains focus after keyboard is shown.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidBegin: function (sender) {
    },

    /**
     * This method is called when an edit box loses focus after keyboard is hidden.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidEnd: function (sender) {
    },

    /**
     * This method is called when the edit box text was changed.
     * @param {cc.EditBox} sender
     * @param {String} text
     */
    editBoxTextChanged: function (sender, text) {
    },

    /**
     * This method is called when the return button was pressed or the outside area of keyboard was touched.
     * @param {cc.EditBox} sender
     */
    editBoxReturn: function (sender) {
    },
    /**
     * Callback for all UIButton's in current scene
     * @param sender
     * @param type
     */
    buttonCallback : function (sender, type) {
        var button = sender;
        var buttonTag = button.tag;
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log(buttonTag);
                switch (buttonTag) {
                    case this.LOGIN_TAG:
                        if (this.validateData()) {
                            CMProcessIndicator.addLoadingIndicator(this);
                            axios({
                                method: 'post',
                                url: SGAppManager.getAPIBaserURL()+SGConstants.APISignInUser,
                                data : {
                                    'email': SGUtility.removeAllWhiteSpaces(this.emailEditBox.getString().toLowerCase()),
                                    'password': this.passEditBox.getString(),
                                    'deviceType' : 1,
                                },
                                headers: {
                                    'api_secret' :  SGConstants.API_SECRET
                                }
                            }).then(function (response) {
                                cc.log("Login Response = " + JSON.stringify(response.data));
                                cc.log(''+response.data.data.name);
                                if(JSON.stringify(response.data.statusCode) == 200){
                                    SGUser.setUserName(response.data.data.name);
                                    SGUser.setEmailID(response.data.data.email);
                                    SGUser.setAuthToken(response.data.data.tokenManager[0].accessToken);
                                    cc.log('access token = '+response.data.data.tokenManager[0].accessToken);
                                    cc.director.runScene(new cc.TransitionSlideInT(0.5,new SGHomeScene()));

                                } else {
                                    SGUtility.createAlertBox(response.data.message,"Message!",SGLogInPanelRef,false);
                                }
                                CMProcessIndicator.removeLoadingIndicator(SGLogInPanelRef);
                            }).catch(function (error) {
                                cc.log("Log In Error = " + JSON.stringify(error));
                                if(JSON.stringify(error.response.data.statusCode) == 401){
                                    SGLogInPanelRef.addChild(new SGVerifyUserPanel());
                                    // SGUtility.createAlertBox("Please click on the link in the verification\nemail sent to continue login.","Warning!",SGLogInPanelRef,false);
                                }else if(JSON.stringify(error.response.data.statusCode) == 400){
                                    SGUtility.createAlertBox('User not found',"Error!",SGLogInPanelRef,false);
                                }
                                else {
                                    SGUtility.createAlertBox(error.response.data.message,"Error!",SGLogInPanelRef,false);
                                }
                                CMProcessIndicator.removeLoadingIndicator(SGLogInPanelRef);
                            });
                        }else {
                            this.hideAllChildern();
                            SGUtility.createAlertBox("Please enter information in all the fields.","Error!",this,false);
                        }
                        break;

                    case this.Register_BUTTON_TAG:
                        var registerPanel = new SGRegisterPanel();
                        registerPanel.setPosition(cc.p(0.0, this.getContentSize().height));
                        this.addChild(registerPanel);
                        registerPanel.runAction(new cc.MoveTo(0.2,cc.p(0.0,0.0)));
                        break;

                    case this.CLOSE_TAG:
                        this.removeFromParent(true);
                        break;
                }
        }
    },

    /**
     * menucall back for each MenuItemSprite/MenuItemImage/MenuItemLabel in current scene
     * @param sender
     */
    onMenucallBack : function (sender) {
        var menuItem = sender;
        cc.log(menuItem.tag);
        switch (menuItem.tag){
            case this.FORGET_PASS_TAG:
                cc.log("Forget pass label clicked");
                var forgetPassPanel = new SGForgetPassPanel();
                forgetPassPanel.setPosition(cc.p(0.0, this.getContentSize().height));
                this.addChild(forgetPassPanel);
                forgetPassPanel.runAction(new cc.MoveTo(0.2,cc.p(0.0,0.0)));
                break;
        }
    },

    /**
     * CMAlertDelegate function
     * @param sender
     */
    okButtonPressed : function (sender) {
        this.showAllChildern();
        sender.getParent().getParent().removeFromParent(true);
    },
    /**
     * CMAlertDelegate function
     * @param sender
     */
    cancelButtonPressed : function (sender) {
        this.showAllChildern();
        sender.getParent().getParent().removeFromParent(true);
    }

});

//---------------------------------------------------------------
//
// Forget Password Panel
//
//---------------------------------------------------------------

var SGForgetPassPanelRef = null;
var SGForgetPassPanel = CMBaseLayer.extend({
    DONE_TAG                :   60,
    CLOSE_TAG               :   61,
    RESET_TAG               :   62,
    emailEditBox            :   null,
    nPassEditBox            :   null,
    panelBg                 :   null,
    isResetState            :   false,
    isResetDone             :   false,

    ctor : function () {
        this._super();
        this.createColourLayer(cc.color(0,0,0,150),this.getContentSize().width,this.getContentSize().height,cc.p(0,0),this);
        this.panelBg = this.setBackground(res.rMenuPanelBg);
        this.setUpUI();

    },
    onEnter : function () {
        this._super();
        SGForgetPassPanelRef = this;
    },
    onExit : function () {
        SGForgetPassPanelRef = null;
        this._super();
    },

    setUpUI : function () {
        this.panelBg.removeAllChildrenWithCleanup(true);
        this.createTTFLabel("Get OTP",SGConstants.FontList[1],40,SGConstants.Brown,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.9),this.panelBg);
        var emailLabel      = this.createTTFLabel("Enter your registered email address to\nreceive the OTP",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.7),this.panelBg);

        // var emailLabel      = this.createTTFLabel("Email Id:",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(this.panelBg.getContentSize().width*0.1,this.panelBg.getContentSize().height*0.5),this.panelBg);
        // emailLabel.setAnchorPoint(cc.p(0.0,0.5));

        this.addSprite(res.rEditBoxbg,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.5),this.panelBg);
        this.emailEditBox = this.createEditBox(res.rEditBoxbg_1,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.5),"Email",0,cc.EDITBOX_INPUT_MODE_SINGLELINE,this.panelBg);

        var okButton = this.createButton(res.rGeneralButton,res.rGeneralButton,"Done",40,this.DONE_TAG,cc.p(this.panelBg.getContentSize().width * 0.5,this.panelBg.getContentSize().height * 0.2),this.panelBg);
        okButton.addTouchEventListener(this.buttonCallback, this);
        okButton.setScale(0.6);

        this.createButton(res.rCloseBtn,res.rCloseBtn,"",40,this.CLOSE_TAG,cc.p(this.getContentSize().width * 0.96,this.getContentSize().height * 0.93),this);

        var resetPassMenuItem = new cc.MenuItemLabel(new cc.LabelTTF("Have OTP?",SGConstants.FontList[1],20,cc.size(0.,0),cc.TEXT_ALIGNMENT_CENTER),this.onMenucallBack,this);
        resetPassMenuItem.setColor(SGConstants.Brown);
        resetPassMenuItem.setTag(this.RESET_TAG);
        resetPassMenuItem.setPosition(cc.p(this.panelBg.getContentSize().width * 0.82 ,this.panelBg.getContentSize().height * 0.42));

        this.createTTFLabel("_________",SGConstants.FontList[1],20,SGConstants.Brown,cc.p(resetPassMenuItem.getContentSize().width*0.49,resetPassMenuItem.getContentSize().height*0.4),resetPassMenuItem);

        var menu = new cc.Menu(resetPassMenuItem);
        menu.setPosition(cc.p(0.0,0.0));
        this.panelBg.addChild(menu);

    },
    resetPasswordUI : function() {
        this.isResetState = true;
        this.panelBg.removeAllChildrenWithCleanup(true);
        this.createTTFLabel("Reset Password",SGConstants.FontList[1],40,SGConstants.Brown,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.9),this.panelBg);

        // var emailLabel      = this.createTTFLabel("OTP:",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(this.panelBg.getContentSize().width*0.1,this.panelBg.getContentSize().height*0.6),this.panelBg);
        // emailLabel.setAnchorPoint(cc.p(0.0,0.5));
        this.addSprite(res.rEditBoxbg,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.6),this.panelBg);
        this.emailEditBox = this.createEditBox(res.rEditBoxbg_1,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.6),"OTP",0,cc.EDITBOX_INPUT_MODE_SINGLELINE,this.panelBg);

        // var otpLabel      = this.createTTFLabel("New Password:",SGConstants.FontList[1],30,SGConstants.Brown,cc.p(this.panelBg.getContentSize().width*0.1,this.panelBg.getContentSize().height*0.5),this.panelBg);
        // otpLabel.setAnchorPoint(cc.p(0.0,0.5));
        this.addSprite(res.rEditBoxbg,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.5),this.panelBg);
        this.nPassEditBox = this.createEditBox(res.rEditBoxbg_1,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.5),"New Password",0,cc.EDITBOX_INPUT_FLAG_PASSWORD,this.panelBg);

        var okButton = this.createButton(res.rGeneralButton,res.rGeneralButton,"Done",40,this.DONE_TAG,cc.p(this.panelBg.getContentSize().width * 0.5,this.panelBg.getContentSize().height * 0.2),this.panelBg);
        okButton.addTouchEventListener(this.buttonCallback, this);
        okButton.setScale(0.6);

        this.createButton(res.rCloseBtn,res.rCloseBtn,"",40,this.CLOSE_TAG,cc.p(this.getContentSize().width * 0.96,this.getContentSize().height * 0.93),this);
    },

    hideComponents : function(){
        this.panelBg.setVisible(false);
    },

    showComponents : function(){
        this.panelBg.setVisible(true);
    },
    /**
     * Callback for all UIButton's in current scene
     * @param sender
     * @param type
     */
    buttonCallback : function (sender, type) {
        var button = sender;
        var buttonTag = button.tag;
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                switch (buttonTag) {
                    case this.DONE_TAG:
                        this.hideComponents();
                        if (this.isResetState){
                            CMProcessIndicator.addLoadingIndicator(this);
                            axios({
                                method: 'post',
                                url: SGAppManager.getAPIBaserURL()+SGConstants.APIResetPassword,
                                data : {
                                    'otp': SGUtility.removeAllWhiteSpaces(this.emailEditBox.getString()),
                                    'newPassword': this.nPassEditBox.getString(),
                                },
                                headers: {
                                    'api_secret' :  SGConstants.API_SECRET
                                }
                            }).then(function (response) {
                                cc.log("Reset Response = " + JSON.stringify(response.data));
                                if(JSON.stringify(response.data.statusCode) == 200){
                                    SGForgetPassPanelRef.isResetDone = true;
                                    SGUtility.createAlertBox("Your password has been updated","Message!",SGForgetPassPanelRef,false);
                                }else {
                                    SGForgetPassPanelRef.isResetDone = false;
                                    SGUtility.createAlertBox(response.data.message,"Message!",SGForgetPassPanelRef,false);
                                }
                                CMProcessIndicator.removeLoadingIndicator(SGForgetPassPanelRef);
                            }).catch(function (error) {
                                SGForgetPassPanelRef.isResetDone = false;
                                cc.log("Reset Error = " + JSON.stringify(error));
                                CMProcessIndicator.removeLoadingIndicator(SGForgetPassPanelRef);
                                SGUtility.createAlertBox(error.response.data.message,"Error!",SGForgetPassPanelRef,false);
                            });

                        } else {
                            if(SGUtility.validateEmailIdText(this.emailEditBox.getString()) == false){
                                SGUtility.createAlertBox("Please enter a valid email Id.","Error!",this,false);
                            }else if(SGUtility.removeAllWhiteSpaces(this.emailEditBox.getString()) == ''){
                                SGUtility.createAlertBox("Please enter information in all the fields.","Error!",this,false);
                            }else{
                                CMProcessIndicator.addLoadingIndicator(this);
                                // cc.log("User email -==> "+SGUtility.removeAllWhiteSpaces(this.emailEditBox.getString()));

                                axios.get(SGAppManager.getAPIBaserURL()+SGConstants.APIForgotPassword, {
                                    params :{
                                        "email": SGUtility.removeAllWhiteSpaces(this.emailEditBox.getString().toLowerCase())
                                    },
                                    headers : {
                                        "api_secret" : SGConstants.API_SECRET
                                    }
                                }).then(function (response) {
                                    CMProcessIndicator.removeLoadingIndicator(SGForgetPassPanelRef);
                                    cc.log("APIForgotPassword response =" + JSON.stringify(response));
                                    if(JSON.stringify(response.data.statusCode) == 200){
                                        SGUtility.createAlertBox("A OTP has been sent to\nyour registered email address.","Message!",SGForgetPassPanelRef,false);
                                    }else {
                                        SGUtility.createAlertBox(response.data.message,"Message!",SGForgetPassPanelRef,false);
                                    }
                                }).catch(function (error) {
                                    CMProcessIndicator.removeLoadingIndicator(SGForgetPassPanelRef);
                                    cc.log("APIForgotPassword error = " + JSON.stringify(error));
                                    SGUtility.createAlertBox(error.response.data.message,"Error!",SGForgetPassPanelRef,false);
                                });

                            }
                        }

                        break;
                    case this.CLOSE_TAG:
                        if (this.isResetState){
                            this.setUpUI();
                            this.isResetState = !this.isResetState;
                        }else {
                            this.removeFromParent(true);
                        }
                        break;
                }
        }
    },
    /**
     * menucall back for each MenuItemSprite/MenuItemImage/MenuItemLabel in current scene
     * @param sender
     */
    onMenucallBack : function (sender) {
        var menuItem = sender;
        cc.log('resetPasswordUI'+menuItem.tag);
        switch (menuItem.tag){
            case this.RESET_TAG:
                cc.log('resetPasswordUI');
                this.resetPasswordUI();
                break;
        }
    },
    /**
     * CMAlertDelegate function
     * @param sender
     */
    okButtonPressed : function (sender) {
        this.showComponents();
        sender.getParent().getParent().removeFromParent(true);
        if(SGForgetPassPanelRef.isResetDone && SGForgetPassPanelRef.isResetState){
            cc.director.runScene(new SGRegisterLoginScene());
        }
    },
    /**
     * CMAlertDelegate function
     * @param sender
     */
    cancelButtonPressed : function (sender) {
        this.showComponents();
        sender.getParent().getParent().removeFromParent(true);

    }
});

var SGVerifyUserPanelRef = null;
var SGVerifyUserPanel = CMBaseLayer.extend({
    DONE_TAG                :   60,
    CLOSE_TAG               :   61,
    otpEditBox              :   null,
    panelBg                 :   null,
    isUserVerified          :   false,

    ctor : function () {
        this._super();
        this.setUpUI();

    },
    onEnter : function () {
        this._super();
        SGVerifyUserPanelRef = this;
        this.isUserVerified = false;
    },
    onExit : function () {
        SGVerifyUserPanelRef = null;
        this._super();
    },

    setUpUI : function () {
        this.createColourLayer(cc.color(0,0,0,150),this.getContentSize().width,this.getContentSize().height,cc.p(0,0),this);
        this.panelBg = this.setBackground(res.rMenuPanelBg);
        this.createTTFLabel("Verify User",SGConstants.FontList[1],35,SGConstants.Brown,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.9),this.panelBg);
        this.createTTFLabel("Enter verification code you have received\nin your registered E-mail id.",SGConstants.FontList[1],25,SGConstants.Brown,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.65),this.panelBg);
        // var emailLabel      = this.createTTFLabel("OTP:",SGConstants.FontList[1],30,SGConstants.Blue,cc.p(this.panelBg.getContentSize().width*0.1,this.panelBg.getContentSize().height*0.5),this.panelBg);        emailLabel.setAnchorPoint(cc.p(0.0,0.5));

        this.addSprite(res.rEditBoxbg,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.5),this.panelBg);
        this.otpEditBox = this.createEditBox(res.rEditBoxbg_1,cc.p(this.panelBg.getContentSize().width*0.5,this.panelBg.getContentSize().height*0.5),"OTP",this.EDITBOX_EMAIL_TAG,cc.EDITBOX_INPUT_MODE_SINGLELINE,this.panelBg);
        this.otpEditBox.setMaxLength(100);

        var okButton = this.createButton(res.rGeneralButton,res.rGeneralButton,"Done",40,this.DONE_TAG,cc.p(this.panelBg.getContentSize().width * 0.5,this.panelBg.getContentSize().height * 0.2),this.panelBg);
        okButton.addTouchEventListener(this.buttonCallback, this);
        okButton.setScale(0.6);

        this.createButton(res.rCloseBtn,res.rCloseBtn,"",40,this.CLOSE_TAG,cc.p(this.getContentSize().width * 0.96,this.getContentSize().height * 0.93),this);

    },

    hideComponents : function(){
        this.panelBg.setVisible(false);
    },

    showComponents : function(){
        this.panelBg.setVisible(true);
    },
    /**
     * Callback for all UIButton's in current scene
     * @param sender
     * @param type
     */
    buttonCallback : function (sender, type) {
        var button = sender;
        var buttonTag = button.tag;
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                switch (buttonTag) {
                    case this.DONE_TAG:
                        this.hideComponents();
                        if(SGUtility.removeAllWhiteSpaces(this.otpEditBox.getString()) == ''){
                            SGUtility.createAlertBox("OTP field can't be empty.","Error!",this,false);
                        }else{
                            CMProcessIndicator.addLoadingIndicator(this);

                            axios({
                                method: 'get',
                                url: SGAppManager.getAPIBaserURL()+SGConstants.APIVerifyUser,
                                params : {
                                    "eVToken": SGUtility.removeAllWhiteSpaces(this.otpEditBox.getString()),
                                }
                            }).then(function (response) {
                                cc.log("verify Response = " + JSON.stringify(response.data));
                                if(JSON.stringify(response.data.statusCode) == 200){
                                    SGVerifyUserPanelRef.isUserVerified = true;
                                    SGUtility.createAlertBox("User verified successfully","Message!",SGVerifyUserPanelRef,false);

                                } else {
                                    SGVerifyUserPanelRef.isUserVerified = false;
                                    SGUtility.createAlertBox(response.data.message,"Message!",SGVerifyUserPanelRef,false);
                                }
                                CMProcessIndicator.removeLoadingIndicator(SGVerifyUserPanelRef);
                            }).catch(function (error) {
                                SGVerifyUserPanelRef.isUserVerified = false;
                                cc.log("user verify Error = " + JSON.stringify(error));
                                CMProcessIndicator.removeLoadingIndicator(SGVerifyUserPanelRef);
                                SGUtility.createAlertBox("Something went wrong.\nPlease try after sometime.","Error!",SGVerifyUserPanelRef,false);
                            });

                        }
                        break;
                    case this.CLOSE_TAG:
                        this.removeFromParent(true);
                        break;
                }
        }
    },
    /**
     * CMAlertDelegate function
     * @param sender
     */
    okButtonPressed : function (sender) {
        this.showComponents();
        sender.getParent().getParent().removeFromParent(true);
        if(this.isUserVerified){
            cc.director.runScene(new SGRegisterLoginScene());
        }

    },
    /**
     * CMAlertDelegate function
     * @param sender
     */
    cancelButtonPressed : function (sender) {
        this.showComponents();
        sender.getParent().getParent().removeFromParent(true);

    }
});