#!/usr/bin/env node
"use strict";


if (process.argv.length !== 4) {
	console.error("Usage:\n\tverifier.js <wordlist> <program.js>\n"
	+ "Checks that program.js prints (via console.log) all the words in\n"
	+ " the given wordlist, separated by newlines, exactly once.");
	process.exit(1);
}

const fs = require('fs');

let wordlist = {};
fs.readFileSync(process.argv[2], 'utf8').split(/\n/).forEach(function(word){
	if (word === '') return;
	if (word in wordlist) {
		console.error("Wordlist... DUPLICATES a word.");
		process.exit(1);
	}
	wordlist[word] = true;
});

const print = console.log;

console.log = function() {
	Array.from(arguments).forEach(function(arg){
		(arg + "").split('\n').forEach(function(word){
			if (word in wordlist) {
				delete wordlist[word];
			} else {
				console.error("Word '" + word + "' is invalid or duplicate.");
				process.exit(1);
			}
		});
	});
};

const program = fs.readFileSync(process.argv[3], 'utf8');

const func = new Function('', program);
func();

for (var word in wordlist) {
	console.error("Word '" + word + "' was missed.");
	process.exit(1);
}

console.error("Verified.");
process.exit(0);
