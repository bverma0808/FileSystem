/**
 * Every file or directory in the FileSystem is presented as a node in the Tree
 * @param {String} name 
 * @param {boolean} isDirectory 
 */
const TreeNode = function(name, parent = null, isDirectory = false) {
    this.name = name
    this.parent = parent
    this.isDirectory = isDirectory

    // If it's a directory then initialise the children array
    if(isDirectory) {
        this.children = []
        this.childrenLookup = new Map()
    }
}

TreeNode.prototype.getFullyQualifiedPath = function() {
    // start with itself
    let pathTokens = [this.name]

    let curParent = this.parent

    while(curParent !== null) {
        // add at the front of the array
        pathTokens.unshift(curParent.name)
        curParent = curParent.parent
    }

    return pathTokens.join('/')
}

TreeNode.prototype.addChild = function(node) {
    if(!this.isDirectory) {
        console.log(`ERROR: Not a directory`)
        return
    }

    this.children.push(node)
    this.childrenLookup.set(node.name, node)
}

TreeNode.prototype.hasChild = function(childName) {
    if(!this.isDirectory) {
        console.log(`ERROR: Not a directory`)
    }

    return this.childrenLookup.has(childName)
}

TreeNode.prototype.getChild = function(childName) {
    if(!this.isDirectory) {
        console.log(`ERROR: Not a directory`)
    }

    return this.childrenLookup.get(childName)
}

module.exports = TreeNode