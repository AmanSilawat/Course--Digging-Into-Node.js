#!/usr/bin/env node
'use strict';

let util = require('util');
let path = require('path');
let fs = require('fs');
let zlib = require('zlib');
let Transform = require('stream').Transform;
const { EBADF } = require('constants');

// let getStdin = require('get-stdin');

let args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'in', 'out', 'compress'],
    string: ['file']
});


let BASE_PATH = path.resolve(
    process.env.BASE_PATH || __dirname
)

let OUTFILE = path.join(BASE_PATH, 'out.txt');

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
            this.push(chunk.toString().toUpperCase())
            setTimeout(cb, 500);
            // cb();
        }
    });

    outStream = outStream.pipe(upperStream)

    if (args.compress) {
        let gzipStream = zlib.createGzip();
        outStream = outStream.pipe(gzipStream);
        OUTFILE = `${OUTFILE}.gz`;
    }

    let targetStream;

    if (args.out) {
        targetStream = process.stdout;
    } else {
        targetStream = fs.createWriteStream(OUTFILE)
    }

    outStream.pipe(targetStream)
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
    console.log('--out                  print to stdout');
    console.log('--compress             gzip the output');
    console.log('');
}

// *****************************

/*
$ ./gzip-compress-with-zlib.js --file=files/hello.txt --out --compress
�p�����q[��

$ ./gzip-compress-with-zlib.js --file=files/hello.txt --compress
$ ls -la
-rw-rw-r-- 1 aman aman     31 Feb 17 16:45 out.txt.gz

*/