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

let BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
)

if (process.env.HELLO) {
    console.log(process.env.HELLO)
}


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
    fs.readFile(path.join(BASE_PATH, args.file), function onContent(err, contents) {
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
run in terminal correct path or wrong path
$ HELLO=WORLD ./environment_variables.js
$ BASE_PATH=files/ ./environment_variables.js --file=hello.txt
*/