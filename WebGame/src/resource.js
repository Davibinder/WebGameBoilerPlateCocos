/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var res = {
    rDemoBG              : "res/demoBg.png",
    rDemoBG1             : "res/demoBg1.jpg",
    //Common
    rLoadingSp           : "res/Common/loading.png",
    rAlertBG             : "res/Common/AlertBg.png",
    rMenuPanelBg         : "res/Common/MenuPanelBg.png",
    rEditBoxbg           : "res/Common/EditBoxBg.png",
    rEditBoxbg_1         : "res/Common/EditBoxBg_1.png",
    rCloseBtn            : "res/Common/Close.png",
    rGeneralButton       : "res/Common/GeneralButton.png",

    // Register/Login Scene resources

    // Home
    rHomeDemoRoom           : "res/HomeScene/DemoRoom.png",
    rHomeFooterBg           : "res/HomeScene/FooterBg.jpg",

    // Tile Maps
    rTileMapWaterGrassPNG   : "res/TileMaps/isometric_grass_and_water.png",
    rTileMapWaterGrassTMX   : "res/TileMaps/isometric_grass_and_water.tmx",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
