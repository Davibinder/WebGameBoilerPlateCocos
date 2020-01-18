AppState = {
    None                        : 500,
    HomeScene                   : 501,
    RegisterLoginScene          : 502,
};
AppMode = {
    Development             : 600,
    Production              : 601
};

AppStateKey = "kAppStateKey";

var SGAppManager = new function () {

    this.appRunMode     = AppMode.Development;
    this.appState       = AppState.None;

    this.setAppState = function (state) {
        cc.sys.localStorage.setItem(AppStateKey,state);
        this.appState = state;
    };

    this.getAppState = function () {
        this.appState = cc.sys.localStorage.getItem(AppStateKey);
        return this.appState;
    };

    this.getAppStateOnPageLoad = function () {
        var scene = null;
        switch (parseInt(this.getAppState())){
            case AppState.None:
                 scene = new SGRegisterLoginScene();
                break;
            case AppState.HomeScene:
                scene = new SGHomeScene();
                break;
            case AppState.RegisterLoginScene:
                scene = new SGRegisterLoginScene();
                break;
            default:
                scene = new SGRegisterLoginScene();
        }
        return scene;

    };

    this.getAPIBaserURL = function () {
        if (this.appRunMode == AppMode.Development){
            return SGConstants.APIDevBaseUrl;
        } else {
            return SGConstants.APIProBaseUrl;
        }
    };

}