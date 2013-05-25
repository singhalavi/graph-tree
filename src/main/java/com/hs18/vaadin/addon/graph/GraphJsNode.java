package com.hs18.vaadin.addon.graph;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



public class GraphJsNode {

	String id;
	String label;
	String icon;
	String type;
	Map<String, String> properties;
	
	int _x;
	int _y;
	
	List<GraphJsNode> children = new ArrayList<GraphJsNode>();
	String parentId;
	
	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int get_x() {
		return _x;
	}

	public void set_x(int _x) {
		this._x = _x;
	}

	public int get_y() {
		return _y;
	}

	public void set_y(int _y) {
		this._y = _y;
	}

	public List<GraphJsNode> getChildren() {
		return children;
	}

	public void setChildren(List<GraphJsNode> children) {
		this.children = children;
	}


	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public GraphJsNode(String id, String label, String icon, String type, String parentId) {
		this.id = id;
		this.label = label;
		this.icon = icon;
		this.type = type;
		this.parentId = parentId;
	}
	
	public void addChild(GraphJsNode node){
		if(!children.contains(node))
		{
			children.add(node);
		}
	}

	public Map<String, String> getProperties() {
		if(properties == null){
			properties =  new HashMap<String, String>();
		}
		return properties;
	}

	public void setProperties(Map<String, String> properties) {
		this.properties = properties;
	}
}
