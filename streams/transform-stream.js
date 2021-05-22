#!/usr/bin/env node
'use strict';

let util = require('util');
let path = require('path');
let fs = require('fs');
let Transform = require('stream').Transform;
const { EBADF } = require('constants');

// let getStdin = require('get-stdin');

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
    processFile(process.stdin);
}
else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processFile(stream);
} else {
    error('Incorrect usage.', true);
}
// *******************************

function processFile(inStream) {
    let outStream = inStream;

    let upperStream = new Transform({
        transform(chunk, enc, cb) {
            console.log(chunk)
            console.log(chunk.toString())
            this.push(chunk.toString().toUpperCase())
            setTimeout(cb, 500);
            // cb();
        }
    });

    outStream = outStream.pipe(upperStream)

    let targetStream = process.stdout;
    outStream.pipe(targetStream);
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