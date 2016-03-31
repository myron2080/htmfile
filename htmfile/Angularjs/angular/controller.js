/**
 * Created by Administrator on 2015-6-19.
 */

var app = angular.module('myApply', []).controller('phoneListCtrl',function($scope,$http){


    $http.get("mainMenu.json").success( function(response) {
        $scope.phones = response;
    });




});



app.config( [ "$httpProvider", function( $httpProvider ) {

      /*  var progress;

        setTimeout( function() {

            progress = $( ".md-progress:first" ).progress();
            alert( $( ".md-progress:first" ).progress());
            $httpProvider.defaults.transformResponse.push( function( data, headers ) {
                setTimeout( function() {
                    progress.done();
                }, 1000 );
                return data;
            } );
            $httpProvider.defaults.transformRequest.push( function( data, headers ) {
                progress.start();
                return data;
            } );
        } );*/



    } ] )