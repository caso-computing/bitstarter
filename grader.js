#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var util = require('util');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLLINK_DEFAULT = "http://immense-dusk-7124.herokuapp.com/";
var webpage = "this is a webpage that hasn't been filled in";
var rest = require('restler');


var assertUrlExists = function(url) {
    var instr = url.toString();
    return instr;
};





var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var getUrl = function(url, checkfile){
    rest.get(url).on('complete', function(result) {
	if (result instanceof Error) {
	    util.puts('Error: ' + result.message);
	    //    this.retry(5000); // try again after 5 sec                                                                                                                 
	} 
	else {
//	    console.log("results: are", result);
	    var out2 = checkUrl(result, checkfile);
//	    console.log("out2 from checkUrl is: ", out2);
	    
	    var outJson = JSON.stringify(out2, null, 4);
	    console.log(outJson);

	}
    });
};
 

var checkUrl = function(urlLink, checksfile) {
    $ = cheerio.load(urlLink);

//    console.log("2nd results: are", urlLink);

    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
//    console.log("out check is: ", out);
    var outJson = JSON.stringify(out, null, 4);
//    console.log("outJson=:",outJson);

    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'URL Path to index.html',clone(assertUrlExists))
        .parse(process.argv);


//    console.log(program.file);
//    console.log(program.checks);
//    console.log("url = :",program.url);
   
//    console.log("testing value of program.url: ", (typeof program.url != 'undefined'));

    if (typeof program.url != 'undefined') {
	// A URL was specified on the command line.  Go read the URL and process
	var checkJson  = getUrl(program.url, program.checks);}
    else {
	// No URL was specified.  Check for an html file.  Return error if one does not exist

	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
	}
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
