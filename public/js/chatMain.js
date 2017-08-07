angular.module("chatApp",[])
  .run(function($rootScope) {
    $rootScope.currentUser = undefined;
  
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
      },
      signin: function(data){
        return $http.post('/signin', {userData: data});
      },
      signup: function(data){
        return $http.post('/signup', {userData: data});
      },
      signout: function(data){
        return $http.get('/signout');
      },

    }
  })
  .service('MultyServices',function($http){
    return {
      sendMsg: function(data){
        return $http.post('/sendMsg', {msgData: data});
      },
      getMsgs: function(){
        return $http.get('/messages');
      },
      getRooms: function(){
        return $http.get('/rooms');
      },
      joinToRoom: function(data){
        return $http.post('/joinToRoom', {roomData: data});
      },
    }
  })
  .service('storageService',function (){

    this.key = "_chatStorage";
   
    this.setUser = function(dataObject){
      console.log(dataObject);
      localStorage.removeItem(this.key);
      localStorage.setItem(this.key, JSON.stringify(dataObject) );
    };
    this.deleteUser = function(){
      localStorage.removeItem(this.key);
    };
    this.isUserexist = function(){
      if ( localStorage.getItem(this.key) )
      {
        return true;
      }
      else
      {
        return false;
      };
       
    };
    this.getUser = function()
    {
      if ( localStorage._chatStorage)
      {
        return JSON.parse(localStorage.getItem(this.key));
      }
      else
      {
        return false;
      };
    };
  
  })
  .controller('loginController',function($scope, UserService,storageService){
    $scope.userData = {};
    console.log("controlador login")

    $scope.login = function()
    {
      if ($scope.userData.email && $scope.userData.password)
      {
        UserService.signin($scope.userData)
        .then(
          function(response)
          {
            if (response.status == 200) 
            {
              console.log("usuario encontrado",response);
              $scope.userData = {};
              storageService.setUser(response.data.current_user)
               window.location = response.data.redirectTo;
            }
          }
        );
      }
      else{
        alert("faltan datos");
      }
    }
    $scope.signup = function()
    {
      if ($scope.userData.email && $scope.userData.nickname && $scope.userData.password)
      {
        UserService.signup($scope.userData)
        .then(
          function(response){
            if (response.status == 200 && response.data.retStatus == "Success") 
            {
              console.log("registro",response);
              $scope.userData = {};
              window.location = response.data.redirectTo;
            }
            else{
              console.log("Error",response);
            }
          }
        );
      }
    }
  })
  .controller("chatController", function($rootScope,$scope, UserService , MultyServices ,storageService){
  	var ctr = this;
    ctr.getMsgs = getMsgs;
    $scope.chatRoom ="Venezuela";
    $scope.selectedRoom = undefined;
    $scope.chatRooms = [];
    $scope.messages = [];

    $rootScope.currentUser = storageService.getUser();
    var socket = io.connect();

    MultyServices.getRooms()
    .then(function(response){
      if (response.status == 200)
      {
        // console.log("actuales rooms",response);
        $scope.chatRooms = response.data;
      }
    });

    getMsgs();
    function getMsgs(){
      if ($scope.selectedRoom)
      {
        MultyServices.getMsgs()
        .then(function(response){
          if (response.status == 200)
          {
            console.log(response);
            $scope.messages = response.data;
          }
        });
        
      }
    };

    $scope.joinChannel = function(){
      $scope.selectedRoom = JSON.parse($scope.roomSelector)
      console.log("function join channel",$scope.selectedRoom);
      MultyServices.joinToRoom($scope.selectedRoom)
      .then(
        function(response)
        {
          if (response.status == 200) 
          {
            console.log("status 200 join del server",response);
            storageService.setUser(response.data.current_user)
            socket.emit('joinToRoom', response.data);
            getMsgs();
          }
        }
      );
    }

    socket.on('actionReceiver' , function(data){
      $scope.$apply(function(){
        $scope.messages.push(data);
        $("#chatContent").animate({ scrollTop: $('#chatContent')[0].scrollHeight}, 1);
      });
    });

  	$scope.sendMsg = function(){
      if ($scope.selectedRoom)
      {
    		var data = {
             text: $scope.message,
             user: {_id: $rootScope.currentUser._id ,nickname: $rootScope.currentUser.nickname , email: $rootScope.currentUser.email},
             chatrooms: { _id: $scope.selectedRoom._id , name: $scope.selectedRoom.name}
        };
        console.log("data a enviar", data);
        MultyServices.sendMsg(data)
        .then(
          function(response)
          {
            if (response.status == 200) 
            {
              console.log("status 200 recibido del server",response);
              $scope.messages.push(response.data);
              $("#chatContent").animate({ scrollTop: $('#chatContent')[0].scrollHeight}, 1);
              socket.emit('sendMsgToRoom', response.data);
            }
          }
        );
        $scope.message = "";
      }
      else{
        alert("selecciona un canal");
      }
  	}
    $scope.signout = function(){
      UserService.signout()
      .then(
        function(response)
        {
          if (response.status == 200) 
          {
            storageService.deleteUser();
            console.log("desconectado",response);
            window.location = response.data.redirectTo;
          }
        }
      );
    }

  });
