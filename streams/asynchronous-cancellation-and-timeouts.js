#!/usr/bin/env node
'use strict';

let util = require('util');
let path = require('path');
let fs = require('fs');
let zlib = require('zlib');
let Transform = require('stream').Transform;

// cancellation & timeout
let CAF = require('caf');


let args = require('minimist')(process.argv.slice(2), {
    boolean: ['help', 'in', 'out', 'compress', 'uncompress'],
    string: ['file']
});

processFile = CAF(processFile);

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
    let tooLong = CAF.timeout(1000, 'Tool to long!')
    processFile(tooLong, process.stdin)
        .catch(error);
}
else if (args.file) {
    let stream = fs.createReadStream(path.join(BASE_PATH, args.file));

    let tooLong = CAF.timeout(1000, 'Tool to long!')

    processFile(tooLong, stream)
        .then(function completeMsg() {
            console.log('Complete!');
        })
        .catch(error)

} else {
    error('Incorrect usage.', true);
}
// *******************************

function *processFile(signal, inStream) {
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

    signal.pr.catch(function f() {
        outStream.unpipe(targetStream);
        outStream.destroy();
    });

    yield streamComplete(outStream);
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
$ npm i caf

with 1000 millisecond in CAF.timeout
$ ./asynchronous-cancellation-and-timeouts.js --file=files/hello.txt --out
HELLO WORLD
Complete!
*/