const TreeNode = require('./TreeNode');

const AlohaFileSystem = function() {
    // initialise root directory
    this.root = new TreeNode('/', null, true)

    // set current directory to root to start with
    this.currentDirectory = this.root
}

/**
 * Compresses the path means given /a/b/../c/./d becomes /a/c/d
 * @param {String} fullyQualifiedPath
 * @returns {Array} PathTokens e.g '/a/b/../c/./d' => '/a/c/d' => ['a', 'c', 'd']
 */
AlohaFileSystem.prototype.__compressPath = function (fullyQualifiedPath) {
    // It it's a relative path then prepend current directory's fully qualified path to it
    if(fullyQualifiedPath.startsWith('.') || fullyQualifiedPath.startsWith('..')) {
        fullyQualifiedPath = `${this.currentDirectory.getFullyQualifiedPath()}/${fullyQualifiedPath}`
    }

    fullyQualifiedPath = fullyQualifiedPath.replace(/\/\//g, '/')
    const tokens = fullyQualifiedPath.split('/')
    const stackArray = []

    for(let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '.' || tokens[i] === '') {
            //do nothing
            continue
        }
        else if (tokens[i] === '..') {
            stackArray.pop()
        }
        else {
            stackArray.push(tokens[i])
        }
    }

    return stackArray
}

/**
 * This method validates the given path, whether this path exists or not
 * @param {String} fullyQualifiedPath 
 * @returns {TreeNode|null} reference to the rightmost dir in the path, e.g. for '/a/b/c' => TreeNode('c')
 */
AlohaFileSystem.prototype.__validatePath = function (fullyQualifiedPath) {
    const pathTokens = this.__compressPath(fullyQualifiedPath)

    let curNode = this.currentDirectory
    
    if (fullyQualifiedPath.startsWith('.') || fullyQualifiedPath.startsWith('..')) {
        curNode = this.root
    }

    let i = 0
    for(i = 0; i < pathTokens.length; i++) {
        let curToken = pathTokens[i]
        if(curNode.hasChild(curToken)) {
            curNode = curNode.getChild(curToken)
        }
        else {
            console.log('ERROR: not a valid path')
            return null
        }
    }

    // There are path elements still to be visited, thus, it's not a valid path
    if(i < pathTokens.length) {
        console.log('ERROR: not a valid path')
        return null
    }

    return curNode
}

AlohaFileSystem.prototype.__ls = function (dirNode, switchOption, indentation, paths) {
    if(!dirNode.isDirectory) {
        return
    }

    dirNode.children.forEach(child => {
        paths.push(indentation + child.name)

        if(switchOption === 'r') {
            this.__ls(child, switchOption, '  ' + indentation, paths) // add 2 spaces in indentation
        }
    })
}

/**
 * @returns {String} The fully qualified path to present working directory
 */
AlohaFileSystem.prototype.pwd = function() {
    return this.currentDirectory.getFullyQualifiedPath()
}

/**
 * This method returns the list of child elements
 * @param {String} switchOption : -r, if passed then returns the full list of children for all of the child elements (recursively)
 * @returns {Array[String]} List of child dir and file names
 */
AlohaFileSystem.prototype.ls = function(switchOption) {
    const paths = []
    this.__ls(this.currentDirectory, switchOption, '', paths)
    return paths
}

/**
 * Method to change directory to a given directory or root directory if none is given
 * @param {String} dirFullyQualifiedPath 
 * @returns {boolean} true if operation was successful | false otherwise
 */
AlohaFileSystem.prototype.cd = function(dirFullyQualifiedPath) {
    if(dirFullyQualifiedPath === null || dirFullyQualifiedPath === '' || dirFullyQualifiedPath === undefined) {
        this.currentDirectory = this.root
        return true
    }

    const parentDir = this.__validatePath(dirFullyQualifiedPath)

    if(parentDir === null) {
        return false
    }
    else {
        this.currentDirectory = parentDir
    }

    return true
}

/**
 * This method creates a new directory, provided the path to its parent exists
 * @param {String} dirFullyQualifiedPath 
 * @returns {Boolean} 'true' if successfully created the new dir. 'false' otherwise
 */
AlohaFileSystem.prototype.mkdir = function(dirFullyQualifiedPath) {
    if(dirFullyQualifiedPath === null || dirFullyQualifiedPath === '' || dirFullyQualifiedPath === undefined) {
        console.log('ERROR: Please provide a valid path')
        return false
    }

    const newDirName = dirFullyQualifiedPath.substring(dirFullyQualifiedPath.lastIndexOf('/') + 1)
    const dirPath = dirFullyQualifiedPath.substring(0, dirFullyQualifiedPath.lastIndexOf('/'))
    const parentDir = this.__validatePath(dirPath)

    if(parentDir === null) {
        return false
    }
    else if (parentDir.hasChild(newDirName)) {
        // if a directory/file with same name already present, then don't create a new one and return false
        console.log('ERROR: dir/file with same name already present')
        return false
    }
    else {
        parentDir.addChild(new TreeNode(newDirName, parentDir, true))
    }

    return true
}

/**
 * This method creates a new file, provided the path to its parent exists
 * @param {String} fileFullyQualifiedPath
 * @returns {Boolean} 'true' if successfully created the new file. 'false' otherwise
 */
AlohaFileSystem.prototype.touch = function(fileFullyQualifiedPath) {
    const newFileName = fileFullyQualifiedPath.substring(fileFullyQualifiedPath.lastIndexOf('/') + 1)
    const dirPath = fileFullyQualifiedPath.substring(0, fileFullyQualifiedPath.lastIndexOf('/'))
    const parentDir = this.__validatePath(dirPath)

    if(parentDir === null) {
        return false
    }
    else if (parentDir.hasChild(newFileName)) {
        // if a directory/file with same name already present, then don't create a new one and return false
        console.log('ERROR: dir/file with same name already present')
        return false
    }
    else {
        parentDir.addChild(new TreeNode(newFileName, parentDir, false))
    }

    return true
}

module.exports = AlohaFileSystem