
var SGUtility =  {

    /**
     * following function will return multidimentional array i.e createArray(4,2),createArray(4,2,4) etc
     * @param length
     * @returns {any[]}
     */

    createArray : function (length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
        }

        return arr;
    },
    /**
     *
     */

    checkIfThereIsOnlyOneElement : function(arr) {
        arr.sort();
        return arr[0] == arr[arr.length -1]
    },

    /**
     * will create alert box with option of single or Dual button
     * @param message
     * @param title
     * @param parent
     * @param isDualButton
     */
    createAlertBox : function (message,title,parent,isDualButton,cancelTexture,oktexture) {
        var alertBox = new CMAlertBox(cc.color(169,169,169,200),parent.getContentSize().width,parent.getContentSize().height);
        alertBox.addAlertBG(res.rAlertBG);
        alertBox.createAlertBox(message,title,isDualButton);
        alertBox._delegate = parent;
        if (typeof(cancelTexture) !=='undefined'){alertBox._bg.getChildByTag(alertBox.CANCEL_TAG).loadTextures(cancelTexture,cancelTexture);}
        if (typeof(oktexture) !=='undefined') {alertBox._bg.getChildByTag(alertBox.OK_TAG).loadTextures(oktexture,oktexture);}
        parent.addChild(alertBox,1000);
    },
    /**
     * following function will validate email ID text
     *
     * @param emailField
     * @returns {boolean}
     */
    validateEmailIdText : function (emailText) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(emailText).toLowerCase());
    },



    /**
     * will remove all white spaces from given string/text
     * @param string
     */
    removeAllWhiteSpaces : function (string) {
        return string.replace(/\s/g,'');
    },

    /**
     * Remove a specified attribute/value from given array
     * @param arr
     * @param attr
     * @param value
     * @returns {*}
     */
    removeByAttr : function(arr, attr, value){
        var i = arr.length;
        while(i--){
            if( arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value ) ){
                arr.splice(i,1);
            }
        }
        return arr;
    },

    isEmpty : function (obj) {
        for (var key in obj){
            if (obj.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    },

}