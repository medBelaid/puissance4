/**
 * Created by Mohamed on 20/03/2016.
 */
Puissance4app.directive('cellPawn', function ($compile) {
    return {
        template: "",
        link: function (scope, element, attrs) {
            var contentTr = angular.element(attrs.cell);
            contentTr.insertBefore(element);
            $compile(contentTr)(scope);
        },
        restrict: 'E',
        controller: function ($scope) {

        }

    }
});
