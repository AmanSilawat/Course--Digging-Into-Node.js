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
    processFile(path.resolve(args.file))
} else {
    error('Incorrect usage.', true);
}


// *******************************

function processFile(filepath) {
    fs.readFile(filepath, function onContent(err, contents) {
        if (err) {
            error(err.toString());
        } else {
            contents = contents.toString().toUpperCase(); 
            process.stdout.write(contents);
        }
    });
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
run in terminal correct path or wrong path
./async_readfile.js --file=ex1.js
*/