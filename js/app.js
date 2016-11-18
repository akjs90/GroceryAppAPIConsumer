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
        service.status=-1;
	$http.get("http://localhost:9099/api/grocery/")
	.success(function(data,status){
		service.itemList=data;
		for(item in service.itemList){
		    service.itemList[item].date_created=new Date(service.itemList[item].date_created);
                }
	})
	.error(function(data,status){
		alert("error"+data);
	});
	
	service.addItem=function(item_name){
		var data={ 
                           name:item_name,
                           date:new Date().toLocaleDateString()
                         };
                $http.post("http://localhost:9099/api/grocery/",data)
                .success(function(data,status){
		   service.status=status;
		   $http.get("http://localhost:9099/api/grocery/")
			.success(function(data,status){
				service.itemList=data;
				for(item in service.itemList){
				    service.itemList[item].date_created=new Date(service.itemList[item].date_created);
				}
			})
			.error(function(data,status){
				alert("error"+data);
			});
                })
		.error(function(data,status){
                   service.status=status;
                });
               return 0;
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
.controller('groceryCtrl',['$scope','groceryService','$location',function($scope,groceryService,$location){
	
	$scope.list=groceryService.itemList;
	// $scope.$watch() creates listener
	$scope.$watch(function(){// value function which walue to listen
		return groceryService.itemList;	
	},function(newvalue){// listener function what to do after specified value changes
		$scope.list=newvalue;
	});

        $scope.$watch(function(){
                    return groceryService.status
         },function(newval){
                $scope.flag=newval;
         });

	$scope.add=function(){
          groceryService.addItem($scope.item_name);
	  $location.path('/');
        }
}]);
