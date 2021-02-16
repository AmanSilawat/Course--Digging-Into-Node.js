#!/usr/bin/env node
'use strict';

let util = require('util');
let path = require('path');
let fs = require('fs');
let getStdin = require('get-stdin');

let args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'in'],
    string: ['file']
});

if (args.help) {
    printHelp();
} else if (
    // one of the convention with end of a line a single hyphens (-) mean standard in is gonna provide all the rest of the input.
    args.in ||
    args._.includes('-')
) {
    getStdin().then(processFile).catch(error);
}
else if (args.file) {
    fs.readFile(path.resolve(args.file), function onContent(err, contents) {
        if (err) {
            error(err.toString());
        } else {
            processFile(contents.toString())
        }
    });
} else {
    error('Incorrect usage.', true);
}
// *******************************

function processFile(contents) {
    contents = contents.toUpperCase();
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
    console.log('--in, -                process stdin');
    console.log('');
}

// *****************************

/*
install a module
$ npm i get-stdin

run in terminal correct path or wrong path
$ cat ./ex1.js | ./processing_input_from_stdin.js --in
$ cat ./ex1.js | ./processing_input_from_stdin.js -
*/