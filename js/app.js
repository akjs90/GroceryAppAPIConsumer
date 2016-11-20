angular.module("GroceryModule",['ngRoute'])
.config(function($routeProvider,$httpProvider){
	$routeProvider
	.when('/',{
		templateUrl:"views/list.html",
		controller:'groceryCtrl'
	})
	.when('/add',{
		templateUrl:"views/add.html",
		controller:'addItemCtrl'
	})
	.when('/edit/:id',{
		templateUrl:"views/add.html",
		controller:'addItemCtrl'
	});
	
	$httpProvider.defaults.headers.delete={ 'Content-Type' : 'application/json'};

})
.factory('groceryService',['$http','$q',function($http,$q){
	
	function getAllItems(){
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
	}
	
	var service={};
	service.itemList=[];
    service.dataObj={
		status:-1,
		name:""
	};
	
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
	
	service.addItem=function(item){
		if(item.id==null){//new item{
			console.log("new item ");
			item.date=new Date().toLocaleDateString();
			$http.post("http://localhost:9099/api/grocery/",item)
		
			.success(function(data,status){
			   service.dataObj.status=status;
			   service.dataObj.name=data.name;
			   service.itemList.push(data);
			   
			})
			
			.error(function(data,status){
			   service.dataObj.status=status;
			});
			return;
		}
		//update
		$http.put("http://localhost:9099/api/grocery/",item)
		
			.success(function(data,status){
			   service.dataObj.status=status;
			   service.dataObj.name=data.name;
			   //service.itemList.push(data);
			   getAllItems();
			})
			
			.error(function(data,status){
			   service.dataObj.status=status;
			});
	        
		console.log("add item "+item.id);
		
		
	};
	
	service.markItemComplete=function(item){
		item.completed=!item.completed;
		$http.put("http://localhost:9099/api/grocery",item)
		.success(function(data,status){
			item=data;
		})
		.error(function(data,status){
			service.dataObj.status=status;
		});
		//getAllItems();
	};
	
	service.getItemById=function(id){
		var item=null;
		var q=$q.defer();
		$http.get("http://localhost:9099/api/grocery/"+id)
		.error(function(data,status){
			item=data;
			//console.log("Found item in service "+item);
			//return item;
			if(status==302)
				q.resolve(item);
			else
				q.reject(null);
		})
		return q.promise;
	};
	
	service.deleteItem=function(item){
		console.log(item.date);
		var httpObj={
			url:"http://localhost:9099/api/grocery",
			method:"DELETE",
			data:item,
			headers:{'Content-Type':'application/json'}
		};
		$http(httpObj)
		.then(function(response){
			for(i in service.itemList){
				if(service.itemList[i]==item)
					service.itemList.splice(i,1);
			}
			service.dataObj.status=978;//deleted
			service.dataObj.name=item.name;
			   
		},function(response){
		
		});
 	}
	return service;
}])
.directive("glContent",function(){
return {
	restrict:'E',
	templateUrl:'templates/item.html'
};
})
.directive("glAlerts",function(){
	return{
		restrict:'E',
		templateUrl:'templates/alerts.html'
	};
})	
.controller('addItemCtrl',['$scope','groceryService','$location','$routeParams',function($scope,groceryService,$location,$routeParams){
	groceryService.dataObj.status=-1;
	$scope.add=function(){
		groceryService.addItem($scope.item);
		$location.path('/');
    };
	if($routeParams.id!=null){
		groceryService.getItemById($routeParams.id)
		.then(function(result){
			$scope.item=result;
		},function(result){
			$location.path('/add');
		});
		//console.log("Found item"+item);
		//$scope.item_name=item.name;
	};
	
}])
.controller('groceryCtrl',['$scope','groceryService',function($scope,groceryService){
	$scope.list=groceryService.itemList;
	// $scope.$watch() creates listener
	$scope.$watch(function(){// value function which walue to listen
		return groceryService.itemList;	
	},function(newvalue){// listener function what to do after specified value changes
		$scope.list=newvalue;
	});

 	$scope.$watch(function(){
				return groceryService.dataObj
	},function(newval){
			$scope.dataObj=newval;
	});
	
	$scope.complete=function(item){
		groceryService.markItemComplete(item);
	}
	
	$scope.deleteItem=function(item){
		groceryService.deleteItem(item);
	}
	
}]);
