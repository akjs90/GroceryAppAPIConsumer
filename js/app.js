angular.module("GroceryModule",['ngRoute'])
.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl:"views/list.html",
		controller:'groceryCtrl'
	})
	.when('/add',{
		templateUrl:"views/add.html",
		controller:'groceryCtrl'
	});
	

})
.factory('groceryService',['$http',function($http){
	var service={};
	service.itemList=[];

	$http.get("http://10.212.8.169:9099/api/grocery/")
	.success(function(data,status){
		service.itemList=data;
	})
	.error(function(data,status){
		alert("error"+data);
	});
	service.addItem=function(){
		
	};
	return service;

}])
.directive("glContent",function(){
return {
	restrict:'E',
	template:'<span><button class="btn btn-success">mark</button></span>\
		<span>{{item.name}}</span>\
		<span><button class="btn btn-default">edit</button></span>\
		<span><button class="btn btn-danger">delete</button></span>'
};
})
.controller('groceryCtrl',['$scope','groceryService',function($scope,groceryService){
	$scope.mess="Hello";
	$scope.list=groceryService.itemList;
	// $scope.$watch() creates listener
	$scope.$watch(function(){// value function which walue to listen
		return groceryService.itemList;	
	},function(newvalue){// listener function what to do after specified value changes
		$scope.list=newvalue;
	});
}]);
