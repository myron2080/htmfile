/**
 * Created by yu.liu on 2016/1/7.
 */


define(['testJs/testTwo'], function (testTwoJs) {
    var testOneJs = function () {
        testTwoJs.testTwoJs2();
        // alert("testOne2.js");


    };


    /* $('.md-btn').click(function(){
     alert('11');
     });*/


    return {
        testOneJs: testOneJs
    };
});



