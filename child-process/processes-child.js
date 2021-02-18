"use strict";

// var fetch = require("node-fetch");


// ************************************

const HTTP_PORT = 8039;


main().catch(() => 1);


// ************************************

async function main() {
	// let x = 0;
	// for (let i = 0; i < 1000000000; i++) {
	// 	x = i + 1;
	// }

	try {
		fetch('http://localhost:8039/get-records')
		if (res && res.ok) {
			let records = await res.join();
			if (records && records.length > 0) {
				process.exitCode = 0;
				return;
			}
		}
	} catch (err) {
		//..
	}

	process.exitCode = 1;

	// In POSIX standard convention,
	// a 0 exit code mean everything was fine, 
	// non-zero mean something went wrong.
}
