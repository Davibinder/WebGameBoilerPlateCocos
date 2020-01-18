var CMBaseLayer = cc.Layer.extend({
    _size : null,

    ctor : function(){
        this._super();
        this._size = cc.winSize;
        //==== Preventive Touch button
        var button  = new ccui.Button();
        button.loadTextures(res.rDemoBG, res.rDemoBG);
        button.setPosition(cc.p(cc.winSize.width*0.5,cc.winSize.height*0.5));
        button.setOpacity(0.0);
        this.addChild(button);

    },

    onEnter : function(){
        this._super();

    },

    onExit : function(){
        this._super();

    },
    /**
     * add background to layer
     * @param imageName
     */
    setBackground : function(imageName) {
        this.mBackgroundSprite       =   cc.Sprite.create(imageName);
        this.mBackgroundSprite.setPosition(this._size.width * 0.5, this._size.height * 0.5);
        this.mBackgroundSprite.setAnchorPoint(0.5, 0.5);
        this.addChild(this.mBackgroundSprite);
        return this.mBackgroundSprite;
    },

    addSprite : function(fileName,position,parent){
        var mSprite = new cc.Sprite(fileName);
        mSprite.setPosition(position);
        parent.addChild(mSprite);
        return mSprite;
    },
    /**
     * createButton() will create and return Button() Instance
     * @param normalImage
     * @param selectedImage
     * @param title
     * @param titleSize
     * @param tag
     * @param position
     * @param parent
     * @returns {*}
     */
    createButton : function(normalImage,selectedImage,title,titleSize,tag,position,parent) {

        var button  = new ccui.Button();
        button.loadTextures(normalImage, selectedImage);
        button.setPosition(position);
        button.setTag(tag);
        button.setTitleText(title);
        button.setTitleColor(SGConstants.White);
        button.setTitleFontName(SGConstants.FontList[0]);
        button.setTitleFontSize(titleSize);
        button.addTouchEventListener(parent.buttonCallback, parent);
        parent.addChild(button);
        return button;
    },
    /**
     * createMenuItemSprite() return menuitem of sprite
     * @param normalSpName
     * @param selectedSpName
     * @param disabledSpName
     * @param tag
     * @param position
     * @param parent
     * @returns {*}
     */
    createMenuItemSprite : function (normalSpName,selectedSpName,disabledSpName,tag,position,parent) {

        var normalSp        = new cc.Sprite(normalSpName);
        var selectedSp      = new cc.Sprite(selectedSpName);
        var disabledSp      = new cc.Sprite(disabledSpName);

        var menuItemSp      = new cc.MenuItemSprite(normalSp,selectedSp,disabledSp,parent.onMenucallBack,parent);
        menuItemSp.setPosition(position);
        menuItemSp.setTag(tag);
        return menuItemSp;
        
    },
    /**
     * create LabelTTF instance and returns same
     * @param text
     * @param font
     * @param fontSize
     * @param textColour
     * @param position
     * @param parent
     * @returns {text}
     */
    createTTFLabel : function (text,font,fontSize,textColour,position,parent,anchor) {
        var label   = cc.LabelTTF.create(text,font,fontSize,cc.size(0.,0),cc.TEXT_ALIGNMENT_CENTER);
        label.setPosition(position);
        label.setColor(textColour);
        if(anchor !== undefined){label.setAnchorPoint(anchor);}
        parent.addChild(label);
        return label;
    },
    /**
     * create LabelBMFont instance and returns same
     * @param text
     * @param fontName
     * @param fontSize
     * @param position
     * @param parent
     * @returns {*}
     */
    createBMFLabel : function (text,fontName,fontSize,position,parent) {
        var label   = new cc.LabelBMFont(text,fontName,fontSize.width,cc.TEXT_ALIGNMENT_CENTER);
        label.setPosition(position);
        parent.addChild(label);
        return label;
    },
    /**
     * create and return LayerColor
     * @param colour
     * @param width
     * @param height
     * @param position
     * @param parent
     * @param zorder
     * @returns {*}
     */
    createColourLayer : function (colour,width,height,position,parent,zorder) {
        var colourLayer = new cc.LayerColor(colour, width, height);
        colourLayer.setPosition(position);
        parent.addChild(colourLayer,zorder);
        return colourLayer;
    },

    createEditBox : function (bgSpriteName,position,placeHolderText,tag,inputFlagType,parent) {
        var editBoxSprite       =   new cc.Scale9Sprite(bgSpriteName);
        var  mEditBox           =   new cc.EditBox(editBoxSprite.getContentSize(), editBoxSprite);
        mEditBox.setPosition(position);
        mEditBox.setTag(tag);
        mEditBox.setFontName(SGConstants.FontList[1]);
        mEditBox.setPlaceholderFontName(SGConstants.FontList[1]);
        mEditBox.setPlaceholderFontColor(cc.color(255,255,255));
        mEditBox.setFontSize(25);
        mEditBox.setPlaceholderFontSize(25);
        // mEditBox.setMaxLength(this.mMaxLengthCharacter);
        mEditBox.setPlaceHolder(placeHolderText);
        mEditBox.setFontColor(cc.color(255, 255, 255));
        mEditBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        mEditBox.setInputFlag(inputFlagType);
        mEditBox.setDelegate(parent);
        parent.addChild(mEditBox);
        return mEditBox;
    }

});