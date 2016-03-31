define(function () {

   //angular.module('modal3', [ "$ui.modal", "$ui.message" ] ).controller('modalController',[ "$scope", "$modal", function ($scope,$modal){

    angular.module('modal3', []).controller('modalController',function ($scope) {

        $scope.name = "test";

            $scope.open = function (animation) {
               alert( sessionStorage.myArrs.id);
                //alert('11');

               /* return $modal.open({
                    controller: "modalController",
                    animation: animation,
                    templateUrl: "modal/page.html",
                    title: "Mango (Fruit)",
                    class4modal: "demo",
                    scope: $scope
                });*/
            };

          /*  $scope.showProgress = function () {

                var modal = $modal.open({
                    controller: "modalController",
                    templateUrl: "modal/page1.html",
                    title: "弹出框标题 18PX 加粗 #333",
                    class4modal: "demo",
                    closeByDocument: true,
                    scope: $scope
                });

                modal
                    .$promise
                    .done(function () {
                        modal.$node.find(".md-progress").progress().start();
                    });

                return modal;
            };

            $scope.showLoading = function () {

                var modal = $modal.open({
                    controller: "modalController",
                    templateUrl: "modal/page1.html",
                    title: "弹出框标题 18PX 加粗 #333",
                    class4modal: "demo",
                    closeByDocument: true,
                    scope: $scope
                });

                modal
                    .$promise
                    .done(function () {
                        modal.$node.find(".md-loading").loading().show();
                    });

                return modal;
            };

            $scope.init = function () {
                $.anchor({offset: -60});
            };*/
        }
   // ]);
    );
});
