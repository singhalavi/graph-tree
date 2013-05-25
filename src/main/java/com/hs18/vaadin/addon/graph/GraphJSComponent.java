/**
 * 
 */
package com.hs18.vaadin.addon.graph;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;

import com.hs18.vaadin.addon.graph.listener.GraphJsLeftClickListener;
import com.vaadin.annotations.JavaScript;
import com.vaadin.shared.communication.ClientRpc;
import com.vaadin.ui.AbstractJavaScriptComponent;
import com.vaadin.ui.JavaScriptFunction;


@JavaScript({"js/jquery.min.js","js/raphael-min.js"	 , "js/graph.js"})
public class GraphJSComponent extends AbstractJavaScriptComponent {

	private static final long serialVersionUID = 1L;
	private GraphJsLeftClickListener leftClickListener;

	Map<String, GraphJsNode> nodeMap = new HashMap<String, GraphJsNode>();
	
	public GraphJSComponent() {
		super();
		addFunction("onLeftClick", new JavaScriptFunction() {
			
			public void call(JSONArray arguments) throws JSONException {
				String nodeId = arguments.getString(0);
				GraphJsNode node = nodeMap.get(nodeId);
				if(node != null && leftClickListener != null){
					leftClickListener.onLeftClick(nodeId, node.getType(), node.getParentId());
				}
			}
		});
		
		addFunction("onStateChanged", new JavaScriptFunction() {
			public void call(JSONArray arguments) throws JSONException {
				getRpcProxy(GraphJsRefreshRpc.class).refresh();				
			}
		});
	}
	
	public void clear(){
		nodeMap.clear();
	}
	  
	public void refresh(){
		List<GraphJsNode> parentNodeList = new ArrayList<GraphJsNode>();
		
		for(String  nodeId: nodeMap.keySet()){
			GraphJsNode node = nodeMap.get(nodeId);
			if(node.getParentId() == null)
			{
				parentNodeList.add(node);
			}
		}
		getState().setParentNodeList(parentNodeList);
//		getRpcProxy(GraphJsRefreshRpc.class).refresh();
	}

	@Override
	public GraphJSComponentState getState() {
		return (GraphJSComponentState) super.getState();
	}
	
	public String getBreakedLabel(String label){
		StringBuffer sb = new StringBuffer(label);
		int chunkLength = 20;
		int count =0;
		for(int i =chunkLength; i < label.length(); i+=chunkLength){
			count++;
			if(count > 4){
				return sb.substring(0, i-chunkLength-3) + "...";
			}
			int index = sb.indexOf("\n", i-chunkLength);
			if(index != -1 && index < i){
				i = index +2;;
				continue;
			}
			//System.out.println("index  = " + index);
			if(sb.length() > i){
				sb.insert(i, '\n');
			}else{
				break;
			}
		}
		return sb.toString();
	}
	
	public void addNode(String id, String label, String type, String icon, String parentId) throws Exception {
		if(id.equals(parentId)){
			throw new Exception("Parent ID can not be equal to child id");
		}
		GraphJsNode node = nodeMap.get(id);
		if(node == null){
			node = new GraphJsNode(id, getBreakedLabel(label), icon, type, parentId);
			nodeMap.put(id, node);
		}else {
			throw new Exception("node already exists with id = " +id);
		}
		
		addParent(id, parentId);
		
	}
	
	public void addParent(String id, String parentId) throws Exception{
		GraphJsNode node = nodeMap.get(id);
		if(node == null){
			throw new Exception("Node not found with id = " + id);
		}
		if(parentId != null){
			GraphJsNode parentNode = nodeMap.get(parentId);
			if(parentNode == null){
				throw new Exception("Parent node with id "+ parentId +" does not exists");
			}
			parentNode.addChild(node);
		}
	}
	
	public void setLeftClickListener(GraphJsLeftClickListener leftClickListener){
		this.leftClickListener = leftClickListener;
	}
	
	public void setNodeProperties(String id, Map<String, String> properties) throws Exception{
		GraphJsNode node = nodeMap.get(id);
		if(node == null){
			throw new Exception("Node not found with id = " + id);
		}
		node.setProperties(properties);
	}
	
	public Map<String, String> getNodeProperties(String id) throws Exception{
		GraphJsNode node = nodeMap.get(id);
		if(node == null){
			throw new Exception("Node not found with id = " + id);
		}
		return node.getProperties();
	}
	
	public interface GraphJsRefreshRpc extends ClientRpc {
	    public void refresh();
	}
}
