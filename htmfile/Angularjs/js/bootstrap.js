/**
 * Created by yu.liu on 2016/1/7.
 */
requirejs.config({

   baseUrl: 'js',

    paths: {
        //ui:'',
        jquery: '../../js/jquery-1.11.0',
        angular:'../../angular',
        bootstrap:'../../js/bootstrap',
        testJs:'../../js/testJs',
        modal2:'../../modal'
    }
});

// Start the main app logic.
requirejs(['jquery','angular/angular.min', 'bootstrap/bootstrap.min','testJs/testOne','testJs/testTwo','modal2/index'],
    function ($,ag,bt,testOne,testTwo,moda) {

        testOne.testOneJs();


      //  var app = angular.module( "moda3");
    });