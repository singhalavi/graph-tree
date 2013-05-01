/**
 * 
 */
package com.hs18.vaadin.addon.graph;

import java.util.List;

import com.vaadin.shared.ui.JavaScriptComponentState;


public class GraphJSComponentState extends JavaScriptComponentState {

	public static final long serialVersionUID = 1L;

	private List<GraphJsNode> parentNodeList;
	
	public GraphJSComponentState(){
	}

	public List<GraphJsNode> getParentNodeList() {
		return parentNodeList;
	}

	public void setParentNodeList(List<GraphJsNode> parentNodeList) {
		this.parentNodeList = parentNodeList;
	}
}
