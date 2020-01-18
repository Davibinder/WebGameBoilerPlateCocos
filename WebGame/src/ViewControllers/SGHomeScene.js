var SGHomeScene = CMBaseScene.extend({

    ctor : function () {
        this._super();
        var layer = new SGHomeSceneLayer();
        this.addChild(layer);
    }
});

var SGHomeSceneLayerRef = null;
var SGHomeSceneLayer = CMBaseLayer.extend({
    /**
     * varibles and Constants
     */
    LOGOUT_BUTTON_TAG            :   20000,

    ctor : function () {
        this._super();
        this.setUpUI();
    },

    onEnter : function () {
        this._super();
        SGHomeSceneLayerRef = this;
        SGAppManager.setAppState(AppState.HomeScene);
        /*
        var tileMap = new cc.TMXTiledMap(res.rTileMapWaterGrassTMX);
        this.addChild(tileMap);

        var pathFind = new TMXPathFinding(tileMap,TMX_DIRECTION.SIX);
        var startPos = cc.p(5,5);
        var endPos = cc.p(25,25);
        var path = pathFind.getPathUsingWalkable(startPos,endPos,["1","2","3","4"]);
        // var path = pathFind.getPathUsingObstacles({x:5,y:5},{x:10,y:10},[],[8,9,10]);
        var pathStr = JSON.stringify(path);
        console.log(pathStr);

        var tempObj = {};
        addNewPair('a','apple',tempObj);
        addNewPair('b','boy',tempObj);
        addNewPair('c','cat',tempObj);
        addNewPair('d','dog',tempObj);
        addNewPair('a','dog',tempObj);
        addNewPair('c','c dog',tempObj);
        console.log(JSON.stringify(tempObj));*/

    },

    onExit : function () {
        SGHomeSceneLayerRef = null;
        this._super();
    },
    
    setUpUI : function () {
        // this.setBackground(res.rDemoBG1);

        this.addSprite(res.rDemoBG,cc.p(this.getContentSize().width * 0.5,this.getContentSize().height * 0.5),this);
       /*
        //Footer
        var footerBg = this.addSprite(res.rHomeFooterBg,cc.p(this.getContentSize().width * 0.5,35),this);
        this.createTTFLabel("Player :",SGConstants.FontList[1],15,SGConstants.Blue,cc.p(footerBg.getContentSize().width*0.1,footerBg.getContentSize().height*0.8),footerBg,cc.p(1.0,0.5));
        this.createTTFLabel(SGUser.getUsername(),SGConstants.FontList[1],15,SGConstants.Brown,cc.p(footerBg.getContentSize().width*0.12,footerBg.getContentSize().height*0.8),footerBg,cc.p(0.0,0.5));
        this.createTTFLabel("Email :",SGConstants.FontList[1],15,SGConstants.Blue,cc.p(footerBg.getContentSize().width*0.1,footerBg.getContentSize().height*0.55),footerBg,cc.p(1.0,0.5));
        this.createTTFLabel(SGUser.getEmailID(),SGConstants.FontList[1],15,SGConstants.Brown,cc.p(footerBg.getContentSize().width*0.12,footerBg.getContentSize().height*0.55),footerBg,cc.p(0.0,0.5));
        this.createTTFLabel("Experience :",SGConstants.FontList[1],15,SGConstants.Blue,cc.p(footerBg.getContentSize().width*0.1,footerBg.getContentSize().height*0.3),footerBg,cc.p(1.0,0.5));
        this.createTTFLabel("Beginner",SGConstants.FontList[1],15,SGConstants.Brown,cc.p(footerBg.getContentSize().width*0.12,footerBg.getContentSize().height*0.3),footerBg,cc.p(0.0,0.5));
        */

        var logoutButton = this.createButton(res.rGeneralButton,res.rGeneralButton,"Log Out",40,this.LOGOUT_BUTTON_TAG,cc.p(this.getContentSize().width * 0.92,this.getContentSize().height * 0.05),this);
        logoutButton.setScale(0.5);
        logoutButton.addTouchEventListener(this.buttonCallback, this);
    },

    /**
     * Callback for all UIButton's in current scene
     * @param sender
     * @param type
     */
    buttonCallback : function (sender, type) {
        var button      = sender;
        var buttonTag   = button.tag ;
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                cc.log(buttonTag);
                switch(buttonTag){
                    case this.LOGOUT_BUTTON_TAG:
                        CMProcessIndicator.addLoadingIndicator(this);
                        axios({
                            method: 'put',
                            url: SGAppManager.getAPIBaserURL()+SGConstants.APISignOut,
                            data : {
                            },
                            headers: {
                                'api_secret' :  SGConstants.API_SECRET,
                                'authorization' : SGUser.getAuthToken()
                            }
                        }).then(function (response) {
                            cc.log("Logout Response = " + JSON.stringify(response.data));
                            if(JSON.stringify(response.data.statusCode) == 200){
                                SGUser.logout();
                                var targetScene = new SGRegisterLoginScene();
                                cc.director.runScene(targetScene);
                                // SGUtility.createAlertBox("You are successfully logged out","Message!",targetScene,false);
                            }else {
                                SGUtility.createAlertBox(response.data.message,"Message!",SGHomeSceneLayerRef,false);
                            }
                            CMProcessIndicator.removeLoadingIndicator(SGHomeSceneLayerRef);
                        }).catch(function (error) {
                            cc.log("Logout Error = " + JSON.stringify(error));
                            CMProcessIndicator.removeLoadingIndicator(SGHomeSceneLayerRef);
                            SGUtility.createAlertBox(error.data.message,"Error!",SGHomeSceneLayerRef,false);
                        });
                        break;
                }
                break;
        }

    },

    /**
     * CMAlertDelegate function
     * @param sender
     */
    okButtonPressed : function (sender) {
        sender.getParent().getParent().removeFromParent(true);
    },
    /**
     * CMAlertDelegate function
     * @param sender
     */
    cancelButtonPressed : function (sender) {
        sender.getParent().getParent().removeFromParent(true);

    }

});

var FooterLayer = cc.LayerColor.extend({

    ctor : function (color, width, height) {
        this._super();
        var bg = new cc.Sprite(res.rHomeFooterBg);
        bg.setPosition(cc.p(this.getContentSize().width*0.5,this.getContentSize().height*0.5));
        this.addChild(bg);
    },

    onEnter : function () {
        this._super();
    },

    onExit :  function () {
        this._super();
    }
});