const readline        = require('readline');
const rl              = readline.createInterface(process.stdin, process.stdout);
const AlohaFileSystem = require('./AlohaFileSystem');

// Initialise File System Object
const afs = new AlohaFileSystem()

// This line will set a prompt in cmd line interface
rl.setPrompt('/> ');
rl.prompt();

rl.on('line', function(line) {
    line = line.trim()
    if(line.length === 0) {
        rl.prompt();
        return
    }

    const cmd = parseCommand(line);
    
    if(cmd === null || cmd === undefined) {
        console.log('Please enter a valid command')
    }
    else if (cmd.cmdName === 'quit') {
        rl.close();
    }
    else if (cmd.cmdName === 'pwd') {
        console.log(afs.pwd())
    }
    else if (cmd.cmdName === 'ls') {
        const paths = afs.ls(cmd.switchOption)
        paths.forEach(path => console.log(path))
    }
    else if (cmd.cmdName === 'cd') {
        afs.cd(cmd.parameter)
    }
    else if (cmd.cmdName === 'mkdir') {
        afs.mkdir(cmd.parameter)
    }
    else if (cmd.cmdName === 'touch') {
        afs.touch(cmd.parameter)
    }
    else {
        console.log('Please enter a valid command')
    }

    rl.setPrompt(`${afs.currentDirectory.getFullyQualifiedPath()}> `);
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});

/**
 * This method parses the input given by the user to a cmd object
 * @param str 
 * @returns {
 *    cmdName: String,
 *    [parameter | switchOption]: String
 * } | null
 */
function parseCommand(str) {
    if(str === null || str.trim().length === 0) {
        return
    }

    let tokens = str.trim().split(' ');
    const cmd = {
        cmdName: tokens[0]
    }
    
    tokens = tokens.filter(t => t !== '')

    if(tokens.length > 1) {
        if(tokens[1].startsWith('-')) {
            cmd.switchOption = tokens[1].slice(1).trim()
        }
        else {
            cmd.parameter = tokens[1].trim()
        }
    }

    return cmd
}