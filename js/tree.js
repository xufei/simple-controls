var Tree = function(element) {
	this.allNodes = [];
	this.nodes = [];

	this.keyField = null;
	this.nodeDict = {};
	this.data = null;
	
	this.eventMap = {};

	this.selectedNode = null;

	this.tree = this;
	this.labelField = null;

	this.dom = document.createElement("ul");
	element.appendChild(this.dom);
};

Tree.prototype = {
	loadTreeData : function(data, keyField) {
		this.clear();

		this.keyField = keyField;

		for (var i=0; i<data.length; i++) {
			this.addNode(data[i]);
		}
		this.data = data;
	},

	loadListData : function(data, selfField, parentField, topFlag) {
		var tree = [];
		var dict = {};

		var length = data.length;
		for (var i = 0; i < length; i++) {
			var item = data[i];
			dict[item[selfField]] = item;
			if (item[parentField] === topFlag) {
				//add root nodes
				tree.push(item);
			}
		}

		//contribute the tree data
		for (i = 0; i < length; i++) {
			var child = data[i];
			if (child[parentField] === topFlag) {
				continue;
			}
			var parent = dict[child[parentField]];
			if (parent) {
				child.parent = parent;
				if (!parent.children) {
					parent.children = [];
				}
				parent.children.push(child);

			}
		}
		
		this.loadTreeData(tree, selfField);
	},

	expandAll : function() {
		for (var i=0; i<this.allNodes.length; i++) {
			this.allNodes[i].expand();
		}
	},

	collapseAll : function() {
		for (var i=0; i<this.allNodes.length; i++) {
			this.allNodes[i].collapse();
		}
	},

	findNode : function(key, value) {
		var result;
		for (var i = 0; i < this.allNodes.length; i++) {
			var node = this.allNodes[i];
			if (node[key] === value) {
				result = node;
				break;
			}
		}

		return result;
	},

	addNode : function(data) {
		var node = new TreeNode(data, this);
		this.nodes.push(node);
		this.allNodes.push(node);
		
		this.dom.appendChild(node.dom);
	},

	removeNode : function(node) {

	},

	swapNodes : function(node1, node2) {

	},
	
	selectNode: function(node) {	
		var event = {
			type: "change",
			oldNode: this.selectedNode,
			newNode: node
		};

		if (this.selectedNode) {
			this.selectedNode.unselect();
		}

		node.select();
		this.selectedNode = node;
		
		this.dispatchEvent(event);
	},

	clear : function() {

	}
}.extend(EventDispatcher);

var TreeNode = function(data, parent) {
	this.data = data;
	this.parent = parent;
	this.tree = parent.tree;
	this.childNodes = [];

	this.dom = document.createElement("li");
	this.labelContainer = document.createElement("span");
	this.labelContainer.innerHTML = data[this.tree.labelField || "label"];
	this.dom.appendChild(this.labelContainer);
	
	this.childrenContainer = document.createElement("ul");
	this.dom.appendChild(this.childrenContainer);

	if (data.children) {
		for (var i=0; i<data.children.length; i++) {
			this.addNode(data.children[i]);
		}
	}

	var that = this;
	this.labelContainer.onclick = function() {
		that.tree.selectNode(that);
	}
};

TreeNode.prototype = {
	addNode: function(data) {
		var node = new TreeNode(data, this);
		this.childNodes.push(node);
		this.tree.allNodes.push(node);
		
		this.childrenContainer.appendChild(node.dom);
	},

	removeNode: function(node) {
		this.childrenContainer.removeChild(node.dom);

		for (var i=0; i<this.childNodes.length; i++) {
			if (this.childNodes[i] == node) {
				this.childNodes.splice(i, 1);
			}
		}

		for (var i=0; i<this.tree.allNodes.length; i++) {
			if (this.tree.allNodes[i] == node) {
				this.tree.allNodes.splice(i, 1);
			}
		}
	},

	expand: function() {
		this.childrenContainer.style.display = "";
	},
	
	collapse: function() {
		this.childrenContainer.style.display = "hidden";
	},
	
	select: function() {
		this.labelContainer.className = "info";
	},
	
	unselect: function() {
		this.labelContainer.className = "";
	}
};