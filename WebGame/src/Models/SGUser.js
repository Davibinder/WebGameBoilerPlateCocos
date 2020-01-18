UserDataKeys = {
    UserNameKey             : "kUserNameKey",
    EmailIdKey              : "kEmailIdKey",
    UserAuthKey             : "kUserAuthKey"

};

var SGUser = new function ()  {
    //
    //
    this.firstName      = null,
    this.lastName       = null,
    this.userName       = null,
    this.emailID        = null,

    this.setFirstName = function(name) {
        this.firstName = name;
    },
    this.getFirstname = function() {
        return this.firstName;
    },

    this.setLastName = function(name) {
        this.lastName = name;
    },
    this.getLastname = function() {
        return this.lastName;
    },

    this.setUserName = function(name) {
        this.userName = name;
        localStorage.setItem(UserDataKeys.UserNameKey,this.userName);

    },
    this.getUsername = function() {
        this.userName = localStorage.getItem(UserDataKeys.UserNameKey);
        return this.userName;
    },

    this.setEmailID = function(id) {
        this.emailID = id;
        localStorage.setItem(UserDataKeys.EmailIdKey,this.emailID);
    },

    this.getEmailID = function() {
        this.emailID = localStorage.getItem(UserDataKeys.EmailIdKey);
        return this.emailID;
    },

    this.setAuthToken = function (token) {
        localStorage.setItem(UserDataKeys.UserAuthKey,token);
    },

    this.getAuthToken = function () {
        return localStorage.getItem(UserDataKeys.UserAuthKey);
    },

    this.logout = function () {
        localStorage.removeItem(UserDataKeys.UserAuthKey);
        localStorage.removeItem(UserDataKeys.EmailIdKey);
        localStorage.removeItem(UserDataKeys.UserNameKey);
        this.setAuthToken('');
        this.setUserName('');
        this.setEmailID('');
    }
};

