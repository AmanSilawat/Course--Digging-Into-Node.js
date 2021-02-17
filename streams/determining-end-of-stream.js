#!/usr/bin/env node
'use strict';

let util = require('util');
let path = require('path');
let fs = require('fs');
let zlib = require('zlib');
let Transform = require('stream').Transform;
const { EBADF } = require('constants');


let args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'in', 'out', 'compress', 'uncompress'],
    string: ['file']
});

function streamComplete(stream) {
    return new Promise(function c(res) {
        stream.on('end', res)
    })
}


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
    processFile(process.stdin)
        .catch(error);
}
else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
    processFile(stream)
        .then(function completeMsg() {
            console.log('Complete!');
        })
        .catch(error)

} else {
    error('Incorrect usage.', true);
}
// *******************************

async function processFile(inStream) {
    let outStream = inStream;

    if (args.uncompress) {
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream)
    }

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

    outStream.pipe(targetStream);

    await streamComplete(outStream);
}

function error(msg, includeHelp = false) {
    console.error(msg);
    if (includeHelp) {
        console.log('');
        printHelp();
    }
}

function printHelp() {
    console.log('exercise file usage:');
    console.log('  exercise file.js -- file={FILENAME}');
    console.log('');
    console.log('--help                 Print this help');
    console.log('--file={FILENAME}      process the file');
    console.log('--in, -                process stdin');
    console.log('--out                  print to stdout');
    console.log('--compress             gzip the output');
    console.log('--uncompress           un-gzip the input');
    console.log('');
}

// *****************************

/*
$ ./determining-end-of-stream.js --file=files/hello.txt --out
HELLO WORLD
Complete!
*/