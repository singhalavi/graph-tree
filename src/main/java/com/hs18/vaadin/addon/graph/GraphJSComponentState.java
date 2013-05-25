/**
 * 
 */
package com.hs18.vaadin.addon.graph;

import java.util.List;

import com.vaadin.shared.ui.JavaScriptComponentState;


public class GraphJSComponentState extends JavaScriptComponentState {

	public static final long serialVersionUID = 1L;

	private List<GraphJsNode> parentNodeList;
	private int nodeWidth = 120;
	private int nodeHeight = 55;
	
	public GraphJSComponentState(){
	}

	public List<GraphJsNode> getParentNodeList() {
		return parentNodeList;
	}

	public void setParentNodeList(List<GraphJsNode> parentNodeList) {
		this.parentNodeList = parentNodeList;
	}

	public int getNodeWidth() {
		return nodeWidth;
	}

	public void setNodeWidth(int nodeWidth) {
		this.nodeWidth = nodeWidth;
	}

	public int getNodeHeight() {
		return nodeHeight;
	}

	public void setNodeHeight(int nodeHeight) {
		this.nodeHeight = nodeHeight;
	}

}
