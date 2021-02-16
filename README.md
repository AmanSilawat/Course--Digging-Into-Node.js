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
console.log('Oops');
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