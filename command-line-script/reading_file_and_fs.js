#!/usr/bin/env node
'use strict';
let path = require('path');
let fs = require('fs');

let args = require('minimist')(process.argv.slice(2), {
    boolean: ['help'],
    string: ['file']
});

if (args.help) {
    printHelp();
} else if (args.file) {
    // let filepath = path.resolve(args.file)
    // console.log(__dirname)
    // console.log(filepath);

    processFile(path.resolve(args.file))
} else {
    error('Incorrect usage.', true);
}


// *******************************

function processFile(filepath) {
    // let contents = fs.readFileSync(filepath)
    let contents = fs.readFileSync(filepath, 'utf-8')
    // console.log(contents);
    process.stdout.write(contents)
}

function error(msg, includeHelp = false) {
    console.error(msg);
    if (includeHelp) {
        console.log('');
        printHelp();
    }
}

function printHelp() {
    console.log('ex1 usage:');
    console.log('  ex1.js -- file={FILENAME}');
    console.log('');
    console.log('--help                 Print this help');
    console.log('--file={FILENAME}      process the file');
    console.log('');
}

// *****************************


/* 
run in terminal

$ ./ex2.js --file=ex1.js
< buffer data 54 68 75 >


$ ./ex2.js --file=ex1.js
show string file
*/