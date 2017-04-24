var express = require('express');
var router = express.Router();
var async = require('async');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Respond with a resource');
});

/**
 * Runs the tasks array of functions in series, each passing their results to the next in the array.
 * However, if any of the tasks pass an error to their own callback, the next function is not executed,
 * and the main callback is immediately called with the error.
 */
router.get('/async-waterfall', function (req, res, next) {

    var consoleStr = "";

    //async array function is called automatically and gets execulted one after the other 
    //completes passing each result to next function 
    // IMP DIFF - Pass each result to next.
    async.waterfall(
        [
            function (callback) {
                console.log("Default callback");
                consoleStr += "Default callback <br>";
                callback(null, 'Yes', 'it');
            },
            function (arg1, arg2, callback) {
                var caption = arg1 + ' and ' + arg2;
                console.log("First callback " + caption);
                consoleStr += "First callback " + caption + "<br>";
                callback(null, caption);
            },
            function (caption, callback) {
                caption += ' works!';
                console.log("Second callback " + caption);
                consoleStr += "Second callback " + caption + "<br>";
                callback(null, caption);
            }
        ],
        function (err, caption) {
            console.log('Final function called for catching error');
            console.log(caption);
            res.send(consoleStr);
            // Node.js and JavaScript Rock!
        }
    );

});


/**
 * Run the functions in the tasks collection in series, each one running once the previous function has completed. 
 * If any functions in the series pass an error to its callback, no more functions are run, and callback is immediately
 * called with the value of the error. Otherwise, callback receives an array of results when tasks have completed.
 */
router.get('/async-series', function (req, res, next) {
    
    // Execute series of function one after another completes.
    async.series({
        one: function (callback) {
            setTimeout(function () {
                callback(null, 1);
            }, 200);
        },
        two: function (callback) {
            setTimeout(function () {
                callback(null, 2);
            }, 100);
        }
    }, function (err, results) {
        res.send(results);
        // results is now equal to: {one: 1, two: 2}
    });

});

router.get('/async-series-array', function (req, res, next) {

    // Execute series of function one after the other completes 
    // IMP DIFF - functions can be passed as an array. 
    async.series([
        function (callback) {
            // do some stuff ...
            callback(null, 'one');
        },
        function (callback) {
            // do some more stuff ...
            callback(null, 'two');
        }
    ],
        // optional callback
        function (err, results) {
            res.send(results);
            // results is now equal to ['one', 'two']
        });

});

/**
 * Run the tasks collection of functions in parallel, without waiting until the previous function has completed. 
 * If any of the functions pass an error to its callback, the main callback is immediately called with the value 
 * of the error. Once the tasks have completed, the results are passed to the final callback as an array.
 */
router.get('/async-parallel', function (req, res, next) {

    // Execute each function in parrallel 
    // Imp DIFF - any failure in any function will c
    async.parallel({
        one: function (callback) {
            setTimeout(function () {
                callback(null, 1);
            }, 200);
        },
        two: function (callback) {
            setTimeout(function () {
                callback(null, 2);
            }, 100);
        }
    }, function (err, results) {
        res.send(results);
        // results is now equals to: {one: 1, two: 2}
    });
});




router.get('/async-parallel-array', function (req, res, next) {

    async.parallel([
        function (callback) {
            setTimeout(function () {
                callback(null, 'one');
            }, 200);
        },
        function (callback) {
            setTimeout(function () {
                callback(null, 'two');
            }, 100);
        }
    ],
        // optional callback
        function (err, results) {
            res.send(results);
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
        });
});

module.exports = router;
