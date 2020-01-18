var CMAlertDelegate = cc.Class.extend({
    okButtonPressed : function (sender) {

    },
    cancelButtonPressed : function (sender) {

    }
});

var CMAlertBox  =   cc.LayerColor.extend({

    OK_TAG      :   10021,
    CANCEL_TAG  :   10022,

    _delegate   :   null,
    _bg         :   null,

    ctor  :  function (color, width, height) {
        this._super(color, width, height);

        //==== Preventive Touch button
        var button  = new ccui.Button();
        button.loadTextures(res.rDemoBG, res.rDemoBG);
        button.setPosition(cc.p(cc.winSize.width*0.5,cc.winSize.height*0.5));
        button.setOpacity(0.0);
        this.addChild(button);

    },
    onEnter : function () {
        this._super();
    },
    onExit : function () {
        this._super();
    },
    /**
     * add background to alert
     * @param imageName
     */
    addAlertBG : function (imageName) {
        this._bg = cc.Sprite.create(imageName);
        this._bg.setPosition(cc.p(this.getContentSize().width * 0.5,this.getContentSize().height * 0.5));
        this.addChild(this._bg,100);
    },
    /**
     * create alert Box
     * @param message
     * @param title
     * @param isDualButton
     */
    createAlertBox : function (message,title,isDualButton) {

        var titleLabel   = cc.LabelTTF.create(title,SGConstants.FontList[0],40,cc.size(0.,0),cc.TEXT_ALIGNMENT_CENTER);
        titleLabel.setPosition(cc.p(this._bg.getContentSize().width * 0.5,this._bg.getContentSize().height*0.89));
        titleLabel.setColor(SGConstants.Brown);
        this._bg.addChild(titleLabel);

        var mesLabel   = cc.LabelTTF.create(message,SGConstants.FontList[0],25,cc.size(0.,0),cc.TEXT_ALIGNMENT_CENTER);
        mesLabel.setPosition(cc.p(this._bg.getContentSize().width * 0.5,this._bg.getContentSize().height*0.65));
        mesLabel.setColor(SGConstants.Brown);
        this._bg.addChild(mesLabel);

        var okButton  = new ccui.Button();
        okButton.loadTextures(res.rGeneralButton, res.rGeneralButton);
        okButton.setPosition(cc.p(this._bg.getContentSize().width * 0.5,this._bg.getContentSize().height*0.2));
        okButton.setTag(this.OK_TAG);
        okButton.setTitleText("OK");
        okButton.setTitleColor(SGConstants.White);
        okButton.setTitleFontName(SGConstants.FontList[1]);
        okButton.setTitleFontSize(40);
        okButton.addTouchEventListener(this.buttonCallback, this);
        okButton.setScale(0.6);
        this._bg.addChild(okButton);

        if (isDualButton == true){
            //===Update Position of OK button
            okButton.setPosition(cc.p(this._bg.getContentSize().width * 0.7,this._bg.getContentSize().height*0.2));
            //===Cancel Button
            var cancelButton  = new ccui.Button();
            cancelButton.loadTextures(res.rGeneralButton, res.rGeneralButton);
            cancelButton.setPosition(cc.p(this._bg.getContentSize().width * 0.3,this._bg.getContentSize().height*0.2));
            cancelButton.setTag(this.CANCEL_TAG);
            cancelButton.setTitleText("CANCEL");
            cancelButton.setTitleColor(SGConstants.White);
            cancelButton.setTitleFontName(SGConstants.FontList[1]);
            cancelButton.setTitleFontSize(40);
            cancelButton.addTouchEventListener(this.buttonCallback, this);
            cancelButton.setScale(0.6);
            this._bg.addChild(cancelButton);
        }

    },
    /**
     * Buttons call back
     * @param sender
     * @param type
     */
    buttonCallback : function (sender, type) {
        var button = sender;
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if (sender.tag == this.OK_TAG){
                    this._delegate.okButtonPressed(sender);

                }else if (sender.tag == this.CANCEL_TAG){
                    this._delegate.cancelButtonPressed(sender);
                }
                break;
        }
    }
});