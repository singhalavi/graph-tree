package com.hs18.vaadin.addon.graph.listener;

import java.io.Serializable;

public interface GraphJsLeftClickListener extends Serializable{

	public void onLeftClick(String nodeId, String type, String parentId);
}
