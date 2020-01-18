/**
 * @module
 * This class is find shortest path between two tiles of TMX file create by Tiled software
 *
 */

/**
 * This function can create user define Map equivalet to c++ Map etc
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    for (var key in obj){
        if (obj.hasOwnProperty(key)){
            return false;
        }
    }
    return true;
}

/**
 * This function can delete a JS object by matching value with property key
 * @param obj
 * @param value
 */
function deletByValue(obj,value) {
    for (var key in obj){
        if (obj.hasOwnProperty(key) && obj[key] === value){
            delete obj[key];
        }
    }
}

function addNewPair(keyNew,value,obj){
    for (var key in obj){
        if (obj.hasOwnProperty(key) && key === keyNew){
            var valueOld = obj[key];
            delete obj[key];
            obj[keyNew] = valueOld;
            return;
        }
    }
    obj[keyNew] = value;
}

/**
 * Directions for Path finding
 */
TMX_DIRECTION = {
        FOUR    : 4,
        SIX     : 6,
        EIGHT   : 8
};

function TileNode() {
    var self = this;
    self.nodeLocation = {x:0,y:0};// cc.p or Vec2
    self.costFromStart = 0;// Int
    self.costToGoal = 0;// Int
    self.totalCost = 0; // Int
    self.parent =null;// TileNode

    /**
     *
     * @returns cc.p or Vec2
     */
    self.getLocationOfTile = function () {
        return (self.nodeLocation);
    };

    self.setLocX = function(X) {
        self.nodeLocation.x = self.nodeLocation.x + X;
    };
    this.setLocY = function(Y) {
        self.nodeLocation.y = self.nodeLocation.y + Y;
    };

    /**
     *
     * @returns Int like value
     */
    self.getCostFromStart = function() {
        return self.costFromStart;
    };

    self.setCostFromStart = function(cost) {
        self.costFromStart = self.costFromStart + cost;
    };

    /**
     *
     * @returns Int like value
     */
    self.getCostToGoal = function() {
        return self.costToGoal;
    };

    self.setCostToGoal = function(cost) {
        this.costToGoal = cost;
    };

    /**
     *
     * @returns Int like value
     */
    self.getTotalCost = function() {
        return parseInt(self.totalCost);
    };

    self.setTotalCost = function(cost) {
        if (cost === undefined){
            self.totalCost = self.costFromStart + self.costToGoal;
        } else {
            self.totalCost = cost;
        }
    };

    /**
     *
     * @returns TileNode like object
     */
    self.getParent = function() {
        return self.parent;

    };
    self.setParent = function(tileNode) {
        self.parent = tileNode;
    }

}

var TMXPathFinding = cc.Class.extend({
    //Internal
    _tileMap : null, // TMXTiledMap
    _tileLayers : [], // TMXLayer Array
    _modifiedNode : new TileNode(), // TileNode
    _extractNode : new TileNode(), // TileNode
    _startNode : new TileNode(), // TileNode
    _goalNode : new TileNode(),// TileNode
    _newNode : new TileNode(),// TileNode

    // Int
    _dir : 0, _iCost : 0, _min : 0, _costToOpen : 0, _costToClose : 0,

    // bool
    _inOpen : false, _inClose : false,

    //std::unordered_map<TileNode*, int>
    _open : {},
    _close : {},


    /** Creates a TMXPathFinding with TMX map.
     *
     * @param map A TMX tiled map obj.
     * @param noOfDirection TMXPathFinding::DIRECTION::FOUR, SIX or EIGHT
     * @return An object.
     */

    ctor : function (map, noOfDirection) {
        this._tileMap = map;
        this._dir = noOfDirection;
        switch (this._tileMap.getMapOrientation()){
            case 0:// Orthogonal
                if(this._dir != TMX_DIRECTION.SIX) {console.log('For Orthogonal Maps SIX direction is not possible');}
                break;
            case 1:// Hexagonal
                if(this._dir != TMX_DIRECTION.SIX) {console.log('For Hexagonal Maps only SIX direction is accepted');}
                break;
            case 2:// Isometric
                if(this._dir != TMX_DIRECTION.SIX) {console.log('For Isometric Maps SIX direction is not possible');}
                break;

        }
        this._iCost = 0;
        this._min = 10000;
        this._tileLayers = [];
        this.setTileLayers();
        this._extractNode = new TileNode();
    },

    /** Set Tile Layer names
     *
     * @param layerNames Required layer names while finding Path.
     * example :
     *		setTileLayers(["Layer_1", "Layer_2"]);
     *		setTileLayers( { } ); // Default, this will check for all layers inside TMXTiledMap
     */

    setTileLayers : function (layersNames) {
        this._tileLayers = [];
        console.log("Temp");
        console.log(JSON.decycle(this._tileMap.allLayers()));
        this._tileLayers = this._tileMap.allLayers();
        // console.log("chec now");
        // var layer = this._tileLayers[0];
        // console.log(layer.getTileGIDAt(cc.p(0,0)));
        /*
        // console.log(JSON.decycle(this._tileMap.getChildren()));
        if (layersNames === undefined) {
            for (var layerNode in this._tileMap.allLayers()){
                if (layerNode){
                    console.log('layer found');
                    console.log(JSON.stringify(layerNode));
                    this._tileLayers.push(layerNode);
                }

            }

        } else {
            for (var layerNode in layersNames){
                if (layerNode){
                    this._tileLayers.push(layerNode);
                }

            }
        }*/
        console.log(JSON.decycle(this._tileLayers));
    },

    /** Get shortest Path between Start & Goal Tile/cell avoiding Obstacles
     *
     * @param startPos Starting Tile/cell pos
     * @param endPos Goal Tile/cell pos
     * @param obstacleGIDs Give all obstacle GIDs
     * @return if succeed then route from startPos to endPos o/w empty vector
     */

    getPathUsingObstacles : function (startPos, endPos, obstacleGIDs) {
        return this.getPath(startPos, endPos, [], obstacleGIDs);
    },

    /** Get shortest Path between Start & Goal Tile/cell using Walkable
     *
     * @param startPos Starting Tile/cell pos
     * @param endPos Goal Tile/cell pos
     * @param walkableGIDs Give all walkable GIDs
     * @return if succeed then route from startPos to endPos o/w empty vector
     */

    getPathUsingWalkable : function (startPos, endPos, walkableGIDs) {
        return this.getPath(startPos, endPos, walkableGIDs, []);
    },

    /**
     * INTERNAL functions and properties
     * following function and nodes will be internal for TMXpathFinding module
     */

    /**
     *
     * @param start is type of TileNode
     * @param end is type of TileNode
     */
    getDistance : function (start, end) {
        //return this.euclideanDistance(start, end);
        return this.manhattanDistance(start, end);
    },

    euclideanDistance : function (start, end) {
        var dx = end.getLocationOfTile().x - start.getLocationOfTile().x;
        var dy = end.getLocationOfTile().y - start.getLocationOfTile().y;
        var ans =  Math.sqrt(dx * dx + dy * dy);
        return ans;
    },
    manhattanDistance : function (start, end) {
        var dx = end.getLocationOfTile().x - start.getLocationOfTile().x;
        var dy = end.getLocationOfTile().y - start.getLocationOfTile().y;
        var ans =  Math.abs(dx) + Math.abs(dy);
        return ans;
    },



    getPath : function(startPos, endPos, walkableGIDs, obstacleGIDs) {
        this._open = {};
        this._close = {};
        // inizialize a goal node
        this._goalNode = new TileNode();
        this._goalNode.setLocX(endPos.x);
        this._goalNode.setLocY(endPos.y);

        // inizialize a start node
        this._startNode = new TileNode();
        this._startNode.setLocX(startPos.x);
        this._startNode.setLocY(startPos.y);
        this._startNode.setCostFromStart(0);
        this._startNode.setParent(null);

        var cost = this.getDistance(this._startNode, this._goalNode);

        this._startNode.setCostToGoal(cost);
        this._startNode.setTotalCost();
        // this._open[this._startNode.getTotalCost()] = this._startNode;
        addNewPair(this._startNode.getTotalCost(),this._startNode,this._open);
        while (!isEmpty(this._open)) {
            console.log('in while loop');
            // Fix a Cost to check the values
            this._min = 32767;
            var minNode = new TileNode();

            // Find minNode from open QUEUE
            for (var key in this._open) {
                console.log(JSON.stringify(key));
                this._extractNode =  this._open[key];
                console.log(JSON.stringify(this._extractNode));
                this._iCost = key;
                if (this._iCost < this._min) {
                    this._min = this._iCost;        // Change min to the New Cost got from the open QUEUE
                    minNode = this._extractNode;
                }
            }
            this._extractNode = minNode;
            deletByValue(this._open,minNode);
            // if it's a goal, we're done
            if (this._extractNode.getLocationOfTile() === this._goalNode.getLocationOfTile()) {
                // 1- retrieve all extractNode's parents
                // 2- save into Vec2 vector
                // 3- reverse Vec2 vector
                // 4- return Vec2 vector
                var points = [];
                points.push(this._extractNode.getLocationOfTile());
                var size = this._extractNode.getCostFromStart();
                for (var i = 0; i < size; i++) {
                    points.push(cc.p(this._extractNode.getParent().getLocationOfTile().x, this._extractNode.getParent().getLocationOfTile().y));
                    this._extractNode = this._extractNode.getParent();
                }
                points.reverse();
                console.log("points");
                return points;

            } else {
                for (var i = 0; i < this._dir; i++) {
                    this._costToOpen = 0;
                    this._costToClose = 0;
                    this._inOpen = false;
                    this._inClose = false;
                    var newNode = new TileNode();
                    newNode.setLocX(this._extractNode.getLocationOfTile().x);
                    newNode.setLocY(this._extractNode.getLocationOfTile().y);

                    switch (i) {
                        case 0: // left
                            newNode.setLocX(-1);
                            newNode.setLocY(0);
                            break;
                        case 1: // right
                            newNode.setLocX(1);
                            newNode.setLocY(0);
                            break;
                        case 2: // up
                            newNode.setLocX(0);
                            newNode.setLocY(1);
                            break;
                        case 3: // down
                            newNode.setLocX(0);
                            newNode.setLocY(-1);
                            break;
                        case 4: // top-left
                            newNode.setLocX(-1);
                            newNode.setLocY(1);
                            break;
                        case 5: // bottom-left
                            newNode.setLocX(-1);
                            newNode.setLocY(-1);
                            break;
                        case 6: // bottom-right
                            newNode.setLocX(1);
                            newNode.setLocY(-1);
                            break;
                        case 7: // top-right
                            newNode.setLocX(1);
                            newNode.setLocY(1);
                            break;

                    }

                    if (newNode.getLocationOfTile() != this._goalNode.getLocationOfTile()) {
                        if (newNode.getLocationOfTile().x < 0 || newNode.getLocationOfTile().y < 0 ||
                            newNode.getLocationOfTile().x >= this._tileMap.getMapSize().width ||
                            newNode.getLocationOfTile().y >= this._tileMap.getMapSize().height) {
                            // newNode is invalid, outside tileMap so ignore
                            continue;
                        }

                        var isNeedToContinue = false;
                        // check newNode in given/all layers
                        for (var index in this._tileLayers) {
                            var layer = this._tileLayers[index];
                            for (var gid in obstacleGIDs) {
                                if (layer.getTileGIDAt(newNode.getLocationOfTile()) === gid) {
                                    // newNode is obstacle so ignore
                                    isNeedToContinue = true;
                                    break;
                                }
                            }
                            if (isNeedToContinue)
                                break;
                            if (walkableGIDs.length > 0) {
                                isNeedToContinue = true;
                                for (var gid in walkableGIDs) {
                                    if (layer.getTileGIDAt(newNode.getLocationOfTile()) === gid) {
                                        // newNode is walkable
                                        isNeedToContinue = false;
                                        break;
                                    }
                                }
                                if (isNeedToContinue) // newNode is not walkable so ignore
                                    break;
                            }
                        }
                        if (isNeedToContinue)
                            continue;
                    }
                    cost = this.getDistance(newNode, this._goalNode);
                    newNode.setCostFromStart(this._extractNode.getCostFromStart() + 1);
                    newNode.setCostToGoal(cost);
                    newNode.setParent(this._extractNode);
                    newNode.setTotalCost();
                    this._inOpen = false;
                    this._inClose = false;

                    for (var kv in this._open) {
                        var node = this._open[kv];
                        if (newNode.getLocationOfTile() === node.getLocationOfTile()) {
                            this._costToOpen = node.getTotalCost();
                            this._inOpen = true;
                            break;
                        }
                    }
                    for (var kv in this._close) {
                        var node = this._close[kv];
                        if (newNode.getLocationOfTile() === node.getLocationOfTile()) {
                            this._costToOpen = node.getTotalCost();
                            this._inClose = true;
                            break;
                        }
                    }

                    if ((this._inOpen && (newNode.getTotalCost() >= this._costToOpen)) || (this._inClose && (newNode.getTotalCost() >= this._costToClose))) {
                        // newNode is already in open or close QUEUE with lower cost so ignore
                        continue;
                    }
                    else {
                        if (this._inClose) {
                            deletByValue(this._close,newNode);
                            // reinsert newNode in open
                            // this._open[newNode.getTotalCost()] = newNode;
                            addNewPair(newNode.getTotalCost(),newNode,this._open);
                        }

                        if (this._inOpen) {
                            // adjust newNode's location in Open
                            this._iCost = this._costToOpen;
                            this._modifiedNode = newNode;
                            // remove from open
                            deletByValue(this._open,newNode);

                            this._modifiedNode.setTotalCost(newNode.getTotalCost());
                            // updated node reinsert in open
                            // this._open[this._modifiedNode.getTotalCost()] = this._modifiedNode;
                            addNewPair(this._modifiedNode.getTotalCost(),this._modifiedNode,this._open);
                        }
                        else {
                            // if its neither in OPEN nor in CLOSE insert it in OPEN
                            // this._open[newNode.getTotalCost()] = newNode;
                            addNewPair(newNode.getTotalCost(),newNode,this._open);
                        }
                    }
                }


            }
            // this._close[this._extractNode.getTotalCost()] = this._extractNode;
            addNewPair(this._extractNode.getTotalCost(),this._extractNode,this._close);
        }
        var dummy = [];
        console.log("Return Dummy");
        return dummy;
    }

});