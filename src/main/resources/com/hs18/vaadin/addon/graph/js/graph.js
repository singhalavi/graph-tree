var gdata;
var renderer;
var self;
var xPos = new Array();
var yPos = new Array();
com_hs18_vaadin_addon_graph_GraphJSComponent = function() {
	//var e = this.getElement();
	/* draw the graph using the RaphaelJS draw implementation */
	//renderer = new Graph.Renderer.Raphael('graph', new Graph(), 750, 350);

	 var element = $(this.getElement());
	 self = this;
	 
	 xPos = new Array();
	 yPos = new Array()
	 
	this.onStateChange = function() {
		 var data = self.getState();
		 xPos = new Array();
		 yPos = new Array();
         try{
        	 drawGraphNodes(data);
         }catch(err){
        	 self.onStateChanged();
         }
	}
	 
	 this.registerRpc({
	        refresh: function() {
	        }
	    });
}

function drawGraphNodes(data){
	$('#graph').empty();
	if(data && data.parentNodeList){
		for(var i=0; i < data.parentNodeList.length; i++){
			drawRaphaelDiagram('graph', data.parentNodeList[i]);
		}
	}	
}

Raphael.el.textStyle = function () {
	this.attr({'font-size': 11});
	this.attr({cursor: 'pointer'});
	return this;
};
Raphael.el.pathStyle = function () {
	this.attr({'stroke': '#000'});
	this.attr({'stroke-width': 0.95});
	return this;
};
Raphael.el.crossPathStyle = function () {
	this.attr({'stroke': '#0F0'});
	this.attr({'stroke-width': 0.95});
	return this;
};
Raphael.el.addArrow = function () {
	this.attr({'arrow-end':'open-wide-long'});
	return this;
};

function drawRaphaelDiagram(paperId, root) {
	var paperWidth = 800;
	var paperHeight = 500;
	
	var nodeElWidth = 120;
	var nodeElHeight = 55;
	var nodeElCornerRadius = 10;
	var nodeElWMargin = 10;
	var arrowPathHeight = 20;
	
	var treeHeight = getNodeHeight(root);
	var treeMaxWidth = getMaxWidth(root);
	
	/*
	if (((treeHeight + 1) / 2) > treeMaxWidth) {
		paperWidth = (treeHeight + 1) * ((nodeElWidth + nodeElWMargin) / 2); 
	} else {
		paperWidth = treeMaxWidth * (nodeElWidth + nodeElWMargin);
	}
	*/
	
	var nodeWidthArr = [];
	var totalWidth = getMaxLevelWidth(root) * (nodeElWidth + nodeElWMargin);
	
	paperWidth = totalWidth;
	paperHeight = treeHeight * (arrowPathHeight * 2 + nodeElHeight) + 10; // approx paper height
	
	//console.log('paperWidth:'+paperWidth);
	
	var paper = Raphael(paperId, paperWidth, paperHeight);
	//var start_img = paper.image('./images/text-document-icon.png', paperWidth/2 - 24, 16, 48, 48)
	//paper.path("M"+(paperWidth/2)+" 65l0 "+arrowPathHeight).pathStyle().addArrow();
	
	var startPosX = paperWidth/2;
	var startPosY =  4; // 4 padding
	
	var availableWidth = paperWidth; 
	
	drawNode(paper, root, startPosX, startPosY, availableWidth, arrowPathHeight, nodeElWidth, nodeElHeight, nodeElWMargin, nodeElCornerRadius);
	
	
    //var dashed_line = paper.path("M"+(nodeElWMargin)+" " + (paperHeight - 90 - arrowPathHeight) + " l"+ (paperWidth - 2*nodeElWMargin) +" 0").pathStyle();
	//dashed_line.attr({'stroke-dasharray':'- '});
    //paper.path("M"+(paperWidth/2)+" " + (paperHeight - 90 - arrowPathHeight) + " l0 30").pathStyle().addArrow();
    //var end_img = paper.image('./images/text-document-icon.png', paperWidth/2 - 22, paperHeight - 90 + 9, 48, 48)
	
    /* OnClick event for text 
    
	t.attr({'fill':'#0000ff', 'cursor':'pointer'});
	t.click(
		function(){
			alert('clicked');
		}
	);
	*/
}

function drawNode(paper, node, startPosX, startPosY, availableWidth, arrowPathHeight, nodeElWidth, nodeElHeight, nodeElWMargin, nodeElCornerRadius) {
	var leftMargin = nodeElWMargin / 2;
	var rect = paper.rect(startPosX - nodeElWidth/2, startPosY, nodeElWidth, nodeElHeight, nodeElCornerRadius);
	
	node._x = startPosX;
	node._y = startPosY;
	xPos[node.id] =  startPosX;
	yPos[node.id] = startPosY;
	//console.log("ID " +node.id + " _x:" +node._x)

	var t = paper.text(startPosX, startPosY + nodeElHeight/2, node.label).textStyle();
	
	if(node.properties != null){
		rect.attr(node.properties);
		if(node.properties['title']){
			t.attr({'title':node.properties['title']});
		}
		if(node.properties['opacity'] != null){
			t.attr({'opacity':node.properties['opacity']});
		}
	}
	
/*	if (node.getIcon() != null || node.getIcon() !== undefined) {
		var icon_img = paper.image(node.getIcon(), startPosX - nodeElWidth/2 + 10,  startPosY + 5, 16, 16)
	}
*/
	addOnClick(node,rect,t);
	addRightClick(node,rect,t);
	
	var children = node.children;
	var noOfChildren = children.length;

	if (noOfChildren === 0) return;
	
	// adding path from the element
	var pathFromRoot = paper.path("M"+ startPosX + " " + (startPosY + nodeElHeight + 2) +"l0 " + arrowPathHeight).pathStyle();
	
	if (noOfChildren === 1) {
		pathFromRoot.addArrow();
		if(children[0].parentId == node.id)
		{
			drawNode(paper, node.children[0], startPosX, (startPosY + nodeElHeight + 2 + arrowPathHeight + 4), availableWidth, arrowPathHeight, nodeElWidth, nodeElHeight, nodeElWMargin, nodeElCornerRadius);
		}
		return;
	}
	
	var nodeWidthArr = [];
	var totalWidth = availableWidth;
	
	for (var i=0; i< children.length; i++) {
		nodeWidthArr[i] = getMaxLevelWidth(children[i]) * (nodeElWidth + nodeElWMargin);
	}
	//console.log('totalWidth:'+totalWidth);
	
	var pathStartPosX =
	(startPosX - ((availableWidth - nodeWidthArr[0])/2)) ;
	var pathStartPosY = (startPosY + nodeElHeight + 2 + arrowPathHeight);
	var pathWidth = (availableWidth - (nodeWidthArr[0])/2 - (nodeWidthArr[nodeWidthArr.length - 1])/2);

	// drawing horizontal path
	paper.path("M"+ pathStartPosX +" "+ pathStartPosY +" l" + pathWidth + " 0").pathStyle();
	
	var lastNodeStartPos = pathStartPosX;
	
	for (var i=0; i< children.length; i++) {
		var childNodeStartPosX = pathStartPosX;
		if (i > 0 && i < (children.length -1) ) {
			childNodeStartPosX = (lastNodeStartPos + (nodeWidthArr[i-1] + nodeWidthArr[i])/2);
			lastNodeStartPos = childNodeStartPosX;
		}
		if ( i === children.length-1) {
			childNodeStartPosX = pathStartPosX + pathWidth;
		}
		
		
		if(xPos[children[i].id])
		{
			paper.path("M"+ childNodeStartPosX +" "+ pathStartPosY +" L"+xPos[children[i].id]+" " + yPos[children[i].id]).pathStyle().addArrow();
		}else{
			paper.path("M"+ childNodeStartPosX +" "+ pathStartPosY +" l0 " + arrowPathHeight).pathStyle().addArrow();
			drawNode(paper, children[i], childNodeStartPosX, (pathStartPosY + arrowPathHeight + 4), nodeWidthArr[i], arrowPathHeight, nodeElWidth, nodeElHeight, nodeElWMargin, nodeElCornerRadius);
		}
	}

}

function getNodeHeight(node)
{
	if (node == null) return 0;
	var children = node.children;
	if (children == null || children.length === 0) return 1;
	if (children.length === 1) 
		return (getNodeHeight(children[0]) + 1);
		
	var maxHeight = getNodeHeight(children[0]);
	for (var i=1;i< children.length;i++) {
		maxHeight = Math.max( maxHeight, getNodeHeight(children[i]) );
	}
	
	return maxHeight + 1;
}

function getMaxWidth(node)
{
	if (node == null) return 0;
	var children = node.children;
	if (children == null || children.length === 0) return 1;
	if (children.length === 1) 
		return getMaxWidth(children[0]);
		
	var lengthArr = [];
	var maxWidth = getMaxWidth(children[0]);
	for (var i=1;i< children.length;i++) {
		maxWidth = Math.max( maxWidth, getMaxWidth(children[i]) );
	}
	
	return maxWidth + children.length - 1;
}

function getMaxLevelWidth(node)
{
	if (node == null) return 0;
	var children = node.children;
	if (children == null || children.length === 0) return 1;
	
	if (children.length === 1) 
		return getMaxLevelWidth(children[0]);
		
	var width = 0;
	for (var i=0; i< children.length; i++) {
		width = width + getMaxLevelWidth(children[i]);
	}
	
	return width;
}

function addOnClick(node, rect, t) {
	//t.attr({'fill':'#0000ff', 'cursor':'pointer'});
	rect.click(
		function(){
			self.onLeftClick(node.id);
		}
	);
	t.click(
			function(){
				self.onLeftClick(node.id);
			}
	);
}

function addRightClick(node,rect,t) {
	rect.mousedown(
	function(e){
		var rightclick;
		if (!e) var e = window.event;
		if (e.which)
		rightclick = (e.which == 3);
		else if (e.button)
		rightclick = (e.button == 2);
	
		if (rightclick)
			alert(node.label+ ', ' + node.title + ', ' + node.id);
		//else
		//	alert('Press right click for the menu');
	}
	);

}