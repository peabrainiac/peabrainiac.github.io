const ColorQuantizer = function(){
    var exports = {};

    var debugConsole;

    exports.logDebugData = function(consoleObject){
        debugConsole = consoleObject;
    };

    exports.quantize = function(imgData,mode="uniform"){
        if (!(imgData instanceof ImageData)){
            throw new Error("Invalid argument: \"imgData\" must be an ImageData!");
        }else if(mode=="grayscale"){
            let colors = new Uint8Array(256*3);
            for (let i=0;i<256;i++){
                colors[i*3] = i;
                colors[i*3+1] = i;
                colors[i*3+2] = i; 
            }
            return colors;
        }else if(mode=="uniform"){
            let colors = new Uint8Array(256*3);
            let i=0;
            for (let r=0;r<6;r++){
                for (let g=0;g<7;g++){
                    for (let b=0;b<6;b++){
                        colors[i++] = r*255/5;
                        colors[i++] = g*255/6;
                        colors[i++] = b*255/5;
                    }
                }
            }
            return colors;
        }else if(mode=="octree"){
            return quantizeUsingOctree(imgData);
        }else{
            throw new Error("Invalid argument: \"mode\" must be one of \"grayscale\",\"uniform\" and \"octree\", not \""+mode+"\"!");
        }
    };

    function debugLog(){
        if (debugConsole){
            debugConsole.log(...arguments);
        }
    }

    function quantizeUsingOctree(imgData){
        debugLog("Quantizing using octree...");
        const MAX_DEPTH = 6;
        var root = {r:0,g:0,b:0,refs:0,childs:[],childCount:0};
        for (let pixel=0,l=imgData.data.length/4;pixel<l;pixel++){
            let r = imgData.data[pixel*4];
            let g = imgData.data[pixel*4+1];
            let b = imgData.data[pixel*4+2];
            var node = root;
            var index = 0; 
            for (let i=0;i<MAX_DEPTH;i++){
                index = ((r>>(5-i))&4)|((g>>(6-i))&2)|((b>>(7-i))&1);
                if (!node.childs[index]){
                    node.childs[index] = {r:0,g:0,b:0,refs:0,childs:[],childCount:0};
                    node.childCount++;
                }
                node = node.childs[index];
                node.refs++;
                node.r += r;
                node.g += g;
                node.b += b;
            }
        }
        for (let i=0;i<8;i++){
            if (root.childs[i]){
                root.r += root.childs[i].r;
                root.g += root.childs[i].g;
                root.b += root.childs[i].b;
                root.refs += root.childs[i].refs;
            }
        }
        collapseChains(root);
        debugLog("Tree:",root);
        var leafCount = countLeaves(root);
        debugLog("LeafCount:",leafCount);
        while(leafCount>256){
            var node = getLeastReferencedNode(root);
            var nodeLeafCount = countLeaves(node);
            node.childs = [];
            node.childCount = 0;
            leafCount -= nodeLeafCount-1;
        }
        var leaves = getLeaves(root);
        debugLog("leaves:",leaves);
        var colors = new Uint8Array(256*3);
        for (let i=0;i<leaves.length;i++){
            colors[i*3] = leaves[i].r/leaves[i].refs;
            colors[i*3+1] = leaves[i].g/leaves[i].refs;
            colors[i*3+2] = leaves[i].b/leaves[i].refs;
        }
        return colors;

        function collapseChains(node){
            if (node.childCount==1){
                var child;
                for (let i=0;i<8;i++){
                    if (node.childs[i]){
                        child = node.childs[i];
                        break;
                    }
                }
                node.r = child.r;
                node.g = child.g;
                node.b = child.b;
                node.refs = child.refs;
                node.childs = child.childs;
                node.childCount = child.childCount;
                collapseChains(node);
            }else if (node.childCount>1){
                for (let i=0;i<8;i++){
                    if (node.childs[i]){
                        collapseChains(node.childs[i]);
                    }
                }
            }
        }
        function countLeaves(node){
            if (node.childCount==0){
                return 1;
            }else{
                var leaves = 0;
                for (let i=0;i<8;i++){
                    if (node.childs[i]){
                        leaves += countLeaves(node.childs[i]);
                    }
                }
                return leaves;
            }
        }
        function getLeaves(node,leaves=[]){
            if (node.childCount==0){
                leaves.push(node);
            }else{
                for (let i=0;i<8;i++){
                    if (node.childs[i]){
                        leaves = getLeaves(node.childs[i],leaves);
                    }
                }
            }
            return leaves;
        }
        function getLeastReferencedNode(node){
            var min = node;
            for (let i=0;i<8;i++){
                if (node.childs[i]&&node.childs[i].childCount>0){
                    var minInChildNode = getLeastReferencedNode(node.childs[i]);
                    if (minInChildNode.refs<min.refs){
                        min = minInChildNode;
                    }
                }
            }
            return min;
        }
    }

    return exports;
};