/**
 * Created by yu.liu on 2016/1/7.
 */
requirejs.config({

    //baseUrl: 'js',

    paths: {
        //ui:'',
        jquery: 'jquery-1.10.2.min',
        bootstrap:'bootstrap.min',
        frontEngine:'front-engine',
        modal2:'index'
    }
});

// Start the main app logic.
requirejs(['jquery','bootstrap','frontEngine','modal2/index'],
    function ($,bs,fe,indx) {

        var isEnabled =function(userId, type) {
            console.log(userId+" , "+type);
        }

        List.init({
            basePath: ''
        });
        // 初始化页面
       /* jQuery(document).ready(function() {
            // 初始化页面

        });*/

});
