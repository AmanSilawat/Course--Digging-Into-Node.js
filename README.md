# Course--Digging-Into-Node.js
Course Reference: [frontendmasters.com](https://frontendmasters.com/courses/digging-into-node/introduction/)

## Intro
Node.js was developed by **Ryan Dahl** in 2009. Ryan Dahl build high throughput low latency socket server or I/O communication like nano or micro-services.

### Console log & Process stdout

standard I/O is a set of three streams that input and output to a program. Which is written in C Plus Plus. writing for file descriptor like 0, 1, 2.
That's the [POSIX](https://en.wikipedia.org/wiki/POSIX) subsystem being exposed to your C program by way of these file identifiers or file descriptor

- 0 stdin: standard in
- 1 stdout: standard out
- 2 stderr: standard error

Node made the choice to expose most of the system connection through a POSIX like interface.

stream are a first-class citizen, they are an actual kind of data structure in node.

```js
process.stdout.write('Hello world');
```
This code is did not include a trailing newline.

<br />

```js
console.log('Hello world');
```
Both are slight different. `console.log` wrapper around `process.stdout.write` that throws on a trailing newline.

### Console Error & Process stderr

create a file `console_error_and_process_stderr.js`
```js
console.log('Hello World');
console.error('Oops');
```

```bash
$ node console_error_and_process_stderr.js
```

output
```bash
Hello world
Oops
```
That's print both console because by default the shell environment that we're running in is gonna interpret standard out and standard error outputs both the same and just print them. but they are actually different.

<br />


**Standard output**
```bash
$ node console_error_and_process_stderr.js 1>/dev/null
Oops
```

- `1`: mean standard out and
- `>`: mean redirect a file descriptor
- `/dev/null`: mean, on a Linux or Mac system called dev/null. this id different for windows.
    - Which is basically a bit trashcan.


**Standard error**
```bash
$ node console_error_and_process_stderr.js 2>/dev/null
Hello world
```

**Standard in**
```js
process.stdin.read();
```

## Command Line Scripts
### Setting up a command line script

Create a file `ex1.js`
```js
#!/usr/bin/env node
'use strict';

printHelp();

function printHelp() {
    console.log('ex1');
    console.log('       some text');
    console.log('');
    console.log('--');
}
```

How to write a command line script or a bash script.
`#!` This symbol is called **hash bang**. It means interpreted as a bash script and `/usr/bin/env node` this line is find node wherever it is  in my system and use node to rest of program.

<br />

**First make your file is executable**

```bash
$ ls -la
-rw-rw-r-- 1 aman aman  178 Feb 16 15:25 ex1.js
```

<br />

`-rw-rw-r--` Make a user permission to execute this file through user`-rwxrw-r--`


```bash
$ chmod u+x ex1.js
```


```bash
$ ls -la
-rwxrw-r-- 1 aman aman  178 Feb 16 15:25 ex1.js
```

<br />

Execute `ex1.js` file

```bash
$ ./ex1.js
ex1
       some text

--
```


### Command Line Arguments

#### Accepts argument
```js
#!/usr/bin/env node
'use strict';
console.log(process.argv);
```

```bash
$ ./ex1.js --hello=world
[
  '/usr/local/bin/node',
  '/home/aman/frontend/Course--Digging-Into-Node.js/command-line-script/ex1.js',
  '--hello=world'
]
```

First argument is where is my node js is installed, second then the fully qualified path to my ex1.js and third argument is my value passed into the file.

<br />

Splice first two argument.
In my `ex1.js`
```js
#!/usr/bin/env node
'use strict';
console.log(process.argv.slice(2));
```

```bash
$ ./ex1.js --hello=world
[ '--hello=world' ]
```

<br />

#### minimist
install minimist package
```
$ npm i minimist
```

In my `ex1.js`
```js
let args = require('minimist')(process.argv.slice(2));
console.log(args);
```

In my `terminal`
```bash
$ ./ex1.js --hello=world -a10
{ _: [], hello: 'world', a: 10 }
```

<br />

#### Configuration with minimist
In my `ex1.js`
```js
let args = require('minimist')(process.argv.slice(2), {
    boolean: ['help'],
    string: ['file']
});
console.log(args);
```

In my `terminal`

```bash
$ ./ex1.js --help=foobar --file
{ _: [], help: true, file: '' }
```
