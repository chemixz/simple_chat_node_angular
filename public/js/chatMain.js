angular.module("chatApp",[])
  .run(function($rootScope) {
  
  })
    .directive("enter", function(){
  	return function(scope,element,attrs){
  		element.bind("keydown keypress" , function (event){
  			if (event.which === 13){
  				console.log("evento enter");
  				scope.$apply(function(){
  					scope.$eval(attrs.enter);
  				});
  				event.preventDefault();
  			}
  		});
  	};
  })
  .service('UserService',function($http){
    return {
      saveOrGetUSer: function(data){
        return $http.post('/signingup', {userData: data});
      }

    }
  })
  .service('MessagesService',function($http){
    return {
      sendMsg: function(data){
        return $http.post('/sendMsg', {msgData: data});
      },
      getMsgs: function(){
        return $http.get('/messages');
      }
    }
  })
  .controller('loginController',function($scope, UserService){
    $scope.userData;
    console.log("controlador login")
    $scope.saveOrGetUSer = function(){
      if ($scope.userData.nickname)
      {
        UserService.saveOrGetUSer($scope.user)
        .then(
          function(response){
            if (response.status == 200) 
            {
              console.log("usuario encontrado",response);
            }
          }
          );
      }
    }
  })
  .controller("chatController", function($scope, UserService , MessagesService){
  	$scope.messages = [];
  	$scope.user;
    var socket = io.connect();

    $scope.getMsgs = function(){
      MessagesService.getMsgs()
      .then(function(response){
        if (response.status == 200)
        {
          $scope.messages = response.data;
        }
      });
    }();

    socket.on('actionReceiver' , function(data){
      $scope.$apply(function(){
        $scope.messages.push(data);
        $("#chatContent").animate({ scrollTop: $('#chatContent')[0].scrollHeight}, 1);
      });
    });

  	$scope.sendMsg = function(){
  		var data = {text: $scope.message, user:$scope.user};
  		
      MessagesService.sendMsg(data)
      .then(
        function(response)
        {
          if (response.status == 200) 
          {
            // console.log("mensaje enviado",response);
            $scope.messages.push(response.data);
            socket.emit('actionSendMsg', response.data);
          }
        }
      );
      $scope.message = "";
  	}

    $scope.saveOrGetUSer = function(){
      var nick= prompt("Ingrese nickname");
      $scope.user = { nickname: nick}; 
      UserService.saveOrGetUSer($scope.user)
      .then(
        function(response){
          if (response.status == 200) 
          {
            console.log("usuario encontrado",response);
            $scope.user = response.data;
          }
        }
      );
    }();
  });
