var SGConstants = {
    /**
     * Regular Constants for Throughout the App
     */
    LightGray          : cc.color(169,169,169,100),
    Black              : cc.color(0,0,0,255),
    Blue               : cc.color(79,156,228,255),
    White              : cc.color(255,255,255,255),
    Brown              : cc.color(97,45,27,255),

    /**
     * Global keys
     */
    UserLoggedInKey         : "kUserLoggedInKey",
    UserLoggedInJWTKey      : "kUserLoggedInJWTKey",
    AdminWalletAddressKey   : "kAdminWalletAddressKey",

    /**
     * REST URLs
     */
    API_SECRET              : 'fSwbQm0imW0:APA91bECZh5Egm2',

    APIDevBaseUrl           : 'http://192.168.2.67:3000/v1/',
    APIProBaseUrl           : 'http://18.221.143.224:5000/api/',

    APISignInUser               : 'user/signin',//
    APISignUp                   : 'user/signup',
    APIVerifyUser               : 'user/verifyemail',
    APISignOut                  : 'user/signout',
    APIForgotPassword           : 'user/forgetpassword',
    APIResetPassword            : 'user/resetpassword',

    /**
     * Fonts array Constant i.e FontList[0] etc
     *
     */
    FontList : [
        // System Fonts
        "sans-serif", // 0
        "sans-serif-light",//1
        "Verdana",//2
        "Lucida Sans Unicode",// 3
        "Bookman Old Style",// 4
        "Symbol",// 5
        "Georgia",// 6
        "Trebuchet MS",// 7
        "Comic Sans MS",// 8
        "Arial Black",// 9
        "Tahoma",// 10
        "Impact",// 11

        // custom TTF
        "American Typewriter",// 12
        "Marker Felt",// 13
        "A Damn Mess",// 14
        "Abberancy",// 15
        "Abduction",// 16
        "Paint Boy",// 17
        "Schwarzwald",// 18
        "Scissor Cuts",// 19
    ],

    /**
     * Base64 constants
     */

    LogoBase64 : "",
};