
var Puissance4app = angular.module("Puissance4app",['ngRoute']);

Puissance4app.config(function($routeProvider){
    
        $routeProvider.when("/play", {
            templateUrl: "/p4/templates/index.html",
            controller: "p4Ctrl"
        })
        
        .otherwise("/play", {
            template: "/p4/templates/index.html",
            controller: "p4Ctrl"
        })
    ;
});

    