
    Puissance4app.controller('p4Ctrl', ['$scope','timeDiffService', function($scope,timeDiffService) {

        randomCurrentPlayer = getRandomFirstPlayer(1,2);
        $scope.showSettings = true;
        $scope.startDate = moment();
        $scope.endDate = moment();
        $scope.message = '';
        //initialize settings match
        $scope.settings = {
            nbrParts : 0
        };
        $scope.endMatch = false;
        $scope.startPart = false;
        $scope.gameIsLocked = true ;

        nul=0;
        condi=1;
        coup=0;
        occupe=0;
        position = {top: 50,left:100,t4:0};
        $scope.tableGame = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
        $scope.tableGamePlayer1 = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
        $scope.tableGamePlayer2 = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
        game=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];

        for(var a=0;a<7;a++)
        {

            for(var b=0;b<6;b++)
            {
                var nomdudiv=a.toString()+b.toString();
                $scope.tableGame[a][b] = "<div id='v"+nomdudiv+"' style='position:absolute;height:70px;width:70px;left:"+position.left+"px;top:"+position.top+"px;background:#336EA6' ng-click='click("+nomdudiv+")'><div class='noPawn'></div>";
                $scope.tableGamePlayer1[a][b] = "<div id='j"+nomdudiv+"' style='position:absolute;height:70px;width:70px;left:"+position.left+"px;top:"+position.top+"px;visibility:hidden'><div class='yellowPawn'></div>";
                $scope.tableGamePlayer2[a][b] = "<div id='r"+nomdudiv+"' style='position:absolute;height:70px;width:70px;left:"+position.left+"px;top:"+position.top+"px;visibility:hidden'><div class='redPawn'></div>";
                position.top=position.top+70;
            }
            position.top=50;
            position.left=position.left+70;
        }

        initGame = function(){
            //initialize match stats
            $scope.matchStats = {
                gamesPlayed: 0
            };
            //initialize players
            $scope.players = [
                {
                    id:1,
                    name : "Joueur1",
                    result: 0,
                    nbrBallsInPart: 0,
                    color:'#F2CF3D',
                    totalShots : 0,
                    nbrShotsWineParty: 0,
                    reflexionTime:0,
                    winner:0
                },
                {
                    id:2,
                    name : "Joueur2",
                    result: 0,
                    nbrBallsInPart: 0,
                    color:'#EA5358',
                    totalShots : 0,
                    nbrShotsWineParty: 0,
                    reflexionTime:0,
                    winner:0
                }
            ];
            $scope.players[0].current = randomCurrentPlayer - 1;
            if (randomCurrentPlayer == 1){
                $scope.players[1].current = 1;
            }else{
                $scope.players[1].current = 0;
            }
        }
        initGame();

        //get random first player
        function getRandomFirstPlayer(min, max) {
            return Math.floor(Math.random() * (max - min +1)) + min;
        }

        function animation()
        {
            occupe=1;
            n2=compl+n1.toString()+b.toString();
            n3=compl+n1.toString()+(b-1).toString();
            if(!b)
            {
                document.getElementById(n2).style.visibility="visible";
            }
            else
            {
                document.getElementById(n3).style.visibility="hidden";
                document.getElementById(n2).style.visibility="visible";
            }
            if(a-1>b){b++;setTimeout(function() {animation();},50);}
            else
            {
                if($scope.players[0].current)
                {
                    gagner();
                    $scope.$apply(function () {
                    $scope.players[0].current=0;
                    $scope.players[1].current=1;
                });
                    window.status="A vous "+$scope.players[1].name;
                }
                else
                {
                    gagner();
                    $scope.$apply(function () {
                        $scope.players[0].current = 1;
                        $scope.players[1].current = 0;
                    });
                    window.status="A vous "+$scope.players[0].name;
                }
                if(($scope.players[0].winner || $scope.players[1].winner || nul) && !reponse)
                {
                    $scope.startParty();
                    $scope.$apply(function () {
                        $scope.players[0].current = 1;
                        $scope.players[0].current = 0;
                    });
                    window.status="A vous "+$scope.players[0].name;
                }
                if(($scope.players[0].winner || $scope.players[1].winner || nul) && reponse)
                {
                    $scope.startParty();
                }
                occupe=0;
            }
        }

        $scope.showSettingsView = function(){
            $scope.players[0].result = 0;
            $scope.players[1].result = 0;
            $scope.endMatch = false;
            $scope.showSettings = true;
            $scope.players[0].reflexionTime = 0;
            $scope.players[1].reflexionTime = 0;
        }

        $scope.startNewMatch = function(){
            if ( $scope.settings.nbrParts > 0 ){
                $scope.showSettings = false;
                $scope.startDate = moment();
                $scope.matchStats.gamesPlayed = 0;
                $scope.gameIsLocked = false;
                $scope.startParty();
                $scope.startPart = true;
            }
        };

        $scope.click = function(nom)
        {
            if(!$scope.gameIsLocked && $scope.settings.nbrParts > 0){
                $scope.endDate = moment();
            if(condi){
                coup++;
            }
            if($scope.players[0].current && !occupe && condi)
            {

                $scope.players[0].reflexionTime += timeDiffService.diff($scope.startDate,$scope.endDate);
                $scope.startDate = moment();

                $scope.players[0].nbrBallsInPart++;
                $scope.players[0].totalShots++;
                n1=Math.floor(nom/10);
                for(a=0;a<6;a++)
                {
                    if(game[n1][a]){break;}
                }
                b=0;
                reponse=1;
                compl="j";
                game[n1][a-1]=1;
                animation();
            }
            else
            {
                $scope.players[1].reflexionTime += timeDiffService.diff($scope.startDate,$scope.endDate);
                $scope.startDate = moment();

                $scope.players[1].nbrBallsInPart++;
                $scope.players[1].totalShots++;
                if(!occupe && condi)
                {
                    n1=Math.floor(nom/10);
                    for(a=0;a<6;a++)
                    {
                        if(game[n1][a]){break;}
                    }
                    b=0;
                    compl="r";
                    game[n1][a-1]=2;
                    animation();
                }
            }
            }
        }

        function gagner()
        {
            if( $scope.players[0].current )
            {
                total=1;
                for(a=0;a<3;a++)
                {
                    for(b=a;b<4+a;b++)
                    {
                        total=game[n1][b]*total;
                    }
                    if(total==1){$scope.players[0].winner=1;break;}
                    total=1;
                }

                total=1;
                for(a=0;a<6;a++)
                {
                    for(b=0;b<4;b++)
                    {
                        for(c=b;c<4+b;c++)
                        {
                            total=game[c][a]*total;
                        }
                        if(total==1){$scope.players[0].winner=1;break;}
                        total=1;
                    }
                }
                diagonale("a=0","a<4","a++",0,1);
                diagonale("a=0","a<4","a++",5,1);
                diagonale("a=6","a>2","a--",0,1);
                diagonale("a=6","a>2","a--",5,1);
            }
            else
            {
                total=1;
                for(a=0;a<3;a++)
                {
                    for(b=a;b<4+a;b++)
                    {
                        total=game[n1][b]*total;
                    }
                    if(total==16){$scope.players[1].winner=1;break;}
                    total=1;
                }
                total=1;
                for(a=0;a<6;a++)
                {
                    for(b=0;b<4;b++)
                    {
                        for(c=b;c<4+b;c++)
                        {
                            total=game[c][a]*total;
                        }
                        if(total==16){$scope.players[1].winner=1;break;}
                        total=1;
                    }
                }
                diagonale("a=0","a<4","a++",0,2);
                diagonale("a=0","a<4","a++",5,2);
                diagonale("a=6","a>2","a--",0,2);
                diagonale("a=6","a>2","a--",5,2);
            }
            if(!position.t4)
            {
                if(!$scope.players[0].winner && !$scope.players[1].winner && coup==42)
                {
                    nul=1;
                }
                if($scope.players[0].winner)
                {
                    endgame();
                }
                if($scope.players[1].winner)
                {
                    endgame();
                }
                if(nul)
                {
                    endgame();
                }
            }
        }

        function diagonale(c1,c2,c3,val1,pl) {

            total = 1;
            for (eval(c1); eval(c2); eval(c3)) {
                b = a;
                c = val1;

                for (d = 0; d < 3; d++) {
                    if (c3.indexOf('-') != -1) {
                        b = a - d;
                    }
                    else {
                        b = a + d;
                    }
                    if (!val1) {
                        c = d;
                    }
                    else {
                        c = val1 - d;
                    }

                    for (e = 0; e < 4; e++) {
                        if (b < 0 || b > 6) {
                            total = 0;
                            break;
                        }

                        total = game[b][c] * total;

                        if (c3.indexOf('-') != -1) {
                            b--;
                        }
                        else {
                            b++;
                        }
                        if (!val1) {
                            c++;
                        }
                        else {
                            c--;
                        }
                    }

                    if (pl == 1) {
                        if (total == 1) {
                            $scope.players[0].winner = 1;
                        }
                    }
                    else {
                        if (total == 16) {
                            $scope.players[1].winner;
                        }
                    }
                    total = 1;
                }
            }
        }

            function endgame() {
                if ($scope.matchStats.gamesPlayed < $scope.settings.nbrParts) {
                    //end part
                    if ($scope.players[0].winner) {
                        $scope.message = "Bravo " + $scope.players[0].name + " vous avez gagné la partie " + $scope.matchStats.gamesPlayed + ".";
                        $scope.$apply(function () {
                            $scope.players[0].result++;
                            $scope.players[0].nbrShotsWineParty += $scope.players[0].nbrBallsInPart;
                        });
                    }
                    if ($scope.players[1].winner) {
                        $scope.message = "Bravo " + $scope.players[1].name + " vous avez gagné la partie " + $scope.matchStats.gamesPlayed + ".";
                        $scope.$apply(function () {
                            $scope.players[1].result++;
                            $scope.players[1].nbrShotsWineParty += $scope.players[1].nbrBallsInPart;
                        });
                    }
                    if (nul) {
                        $scope.matchStats.gamesPlayed++;
                        $scope.message = "Match nul";
                    }
                } else {
                    if ($scope.players[0].winner) {
                        $scope.$apply(function () {
                            $scope.players[0].result++;
                            $scope.players[0].nbrShotsWineParty += $scope.players[0].nbrBallsInPart;
                        });
                        if ($scope.players[0].result - $scope.players[1].result > 0) {
                            $scope.message = "Bravo " + $scope.players[0].name + " vous avez gagné le match. congratulation !";
                        }
                        else if ($scope.players[1].result - $scope.players[0].result > 0) {
                            $scope.message = "Bravo " + $scope.players[1].name + " vous avez gagné le match. congratulation !";
                        }
                        else {
                            $scope.message = "Match null !!";
                        }
                    }
                    if ($scope.players[1].winner) {
                        $scope.$apply(function () {
                            $scope.players[1].result++;
                            $scope.players[1].nbrShotsWineParty += $scope.players[1].nbrBallsInPart;
                        });
                        if ($scope.players[0].result - $scope.players[1].result > 0) {
                            $scope.message = "Bravo " + $scope.players[0].name + " vous avez gagné le match. congratulation !";
                        }
                        else if ($scope.players[1].result - $scope.players[0].result > 0) {
                            $scope.message = "Bravo " + $scope.players[1].name + " vous avez gagné le match. congratulation !";
                        }
                        else {
                            $scope.startPart = false;
                            $scope.message = "Match null !!";
                        }
                    }
                    //end match
                    $scope.startPart = false;
                    $scope.clearMatch();
                    randomCurrentPlayer = getRandomFirstPlayer(1, 2);
                }
            }
        //get average number shots by wine party for each player
        $scope.getNbrShotsByWineParty= function(id){
            if($scope.players[id].nbrShotsWineParty){
                return $scope.players[id].nbrShotsWineParty / $scope.players[id].result;
            }
        }

            $scope.clearMatch = function () {
                $scope.gameIsLocked = true;
                $scope.players[0].winner = 0;
                $scope.players[1].winner = 0;
                $scope.startDate = moment();
                $scope.endDate = moment();
                $scope.$apply(function () {
                    $scope.endMatch = true;
                });
                for (a = 0; a < 7; a++) {
                    for (b = 0; b < 6; b++) {
                        game[a][b] = 0;
                        nomdudiv = a.toString() + b.toString();
                        document.getElementById("j" + nomdudiv).style.visibility = "hidden";
                        document.getElementById("r" + nomdudiv).style.visibility = "hidden";
                    }
                }
                ;

            }

            $scope.startParty = function () {
                $scope.startPart = true;
                $scope.matchStats.gamesPlayed++;
                $scope.players[0].nbrBallsInPart = 0;
                $scope.players[1].nbrBallsInPart = 0;
                for (a = 0; a < 7; a++) {
                    for (b = 0; b < 6; b++) {
                        game[a][b] = 0;
                        nomdudiv = a.toString() + b.toString();
                        document.getElementById("j" + nomdudiv).style.visibility = "hidden";
                        document.getElementById("r" + nomdudiv).style.visibility = "hidden";
                    }
                }
                coup = 0;
                nul = 0;
                $scope.players[0].winner = 0;
                $scope.players[1].winner = 0;
            }
        }]);
