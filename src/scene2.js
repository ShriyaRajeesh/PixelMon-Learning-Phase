import Phaser from 'phaser'
export default class scene2 extends Phaser.Scene{
    map;
    cursors;
    player;
    currentscore=0;
    highscore=0;
    scoretext;
    highScoreText;
    timeLimit =120;
    timerText;
    
    constructor(){
        super("playGame");
        this.timeLimit =120;
    }

    create(){

        const savedHighScore = localStorage.getItem('highScore');
        this.highScore = savedHighScore ? parseInt(savedHighScore) : 0;
        

        this.cursors=this.input.keyboard.createCursorKeys();
        //adding tilemap and setting it up

        this.map=this.make.tilemap({key:'path'});

        const tileset=this.map.addTilesetImage('tileset','tileset');
        
        const layer1=this.map.createLayer('ground', tileset, 0, 0); 
        layer1.setVisible(true);
        layer1.setAlpha(1);

        const layer2=this.map.createLayer('grass', tileset, 0, 0);
        layer2.setVisible(true);
        layer2.setAlpha(1);

        layer2.setCollisionByExclusion([-1]);

        //creating player and animations
        this.player=this.physics.add.sprite(75,75,"player","run-down-2.png");
        this.player.setScale(3);

        this.anims.create({
            key: "player_stand",
            frames: [{key:'player', frame:'run-down-2.png'}]
        });


        this.anims.create({
            key:'player_run_down',
            frames:this.anims.generateFrameNames('player',{start:2, end:8, prefix:'run-down-',suffix:'.png'}),
            repeat: -1,
            frameRate:15
        })
        this.anims.create({
            key:'player_run_side',
            frames:this.anims.generateFrameNames('player',{start:1, end:8, prefix:'run-side-',suffix:'.png'}),
            repeat: -1,
            frameRate:15
        })
        this.anims.create({
            key:'player_run_up',
            frames:this.anims.generateFrameNames('player',{start:1, end:8, prefix:'run-up-',suffix:'.png'}),
            repeat: -1,
            frameRate:15
        })

        this.player.body.setSize(25, 25);
        this.physics.add.collider(this.player,layer2);
        this.cameras.main.startFollow(this.player,true);

        //adding coins

        this.coinsGroup = this.physics.add.group();

        this.anims.create({
            key: "coin",
            frames:this.anims.generateFrameNames('coins',{start:1, end:25, prefix:'coin-',suffix:'.png'}),
           
            frameRate:10,
            repeat:-1
        })
        

        this.physics.add.overlap(this.player, this.coinsGroup, this.collectCoin, null, this);

        //Adding all text labels: score, high score , time 
        
        this.scoretext = this.add.text(10, 10, 'Score: 0', { 
            font: 'bold 16px Courier New    ', 
            fill: '#663399'
        });
        this.scoretext.setScrollFactor(0);


        this.highScoreText = this.add.text(10, 50, `High Score: ${this.highScore}`, {
            font: 'bold 16px Courier New    ',
            fill: '#663399',
        });
        this.highScoreText.setScrollFactor(0);


        this.timerText = this.add.text(10, 30, `Time: ${this.timeLimit}`, {
            font: 'bold 16px Courier New    ',
            fill: '#663399',
        });
        this.timerText.setScrollFactor(0);


        
        //generating coins
        this.time.addEvent({
            delay: 2000, 
            callback: this.generatecoins,
            callbackScope: this,
            loop: true
        });

        //creating a count down effect 

        this.timerEvent = this.time.addEvent({
            delay: 1000, 
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });


        //creating a minimap to make naviation easy 

        const mapWidth = this.map.widthInPixels; 
        const mapHeight = this.map.heightInPixels;

        const minimapWidth = 150; 
        const minimapHeight = 150; 
        const minimapX = this.scale.width - minimapWidth - 5; 
        const minimapY = 5;
       
        const zoomFactor = Math.min(minimapWidth / mapWidth, minimapHeight / mapHeight);
        
        // Adding minimap camera
        const minimapCamera = this.cameras.add(minimapX, minimapY, minimapWidth, minimapHeight)
            .setZoom(zoomFactor) 
            .setScroll(0, 0) 
            .setBackgroundColor(0x000000); 
        
        minimapCamera.setBounds(0, 0, mapWidth, mapHeight);

    }

    //function for the timer to count down
    updateTimer() {

        this.timeLimit -= 1;

        this.timerText.setText(`Time: ${this.timeLimit}`);

        if (this.timeLimit <= 0) {
            this.timerEvent.remove();
            this.gameOver();
        }
       }

    //random coin generator
    generatecoins(){
        const mapWidth = this.map.widthInPixels;  
        const mapHeight = this.map.heightInPixels;

        const x = Phaser.Math.Between(0, mapWidth);
        const y = Phaser.Math.Between(0, mapHeight);

        const groundLayer = this.map.getLayer('ground').tilemapLayer;
        const tile = groundLayer.getTileAtWorldXY(x, y);


        if (tile && tile.index !== -1) { 
            const coin = this.coinsGroup.create(x, y, 'coins');
            coin.play('coin');
            coin.setScale(0.10);
            
        }
        
    }



    //player movement details 
    update(){
        if(!this.cursors|| !this.player){
            return
        }
    
        if(this.cursors.left.isDown){
            this.player.anims.play("player_run_side",true);
            this.player.setVelocityX(-200);
            this.player.setVelocityY(0);
            this.player.scaleX=-1;
            this.player.body.offset.x=28;
           
    
        }else if(this.cursors.right.isDown){
            this.player.setVelocityX(200);
            this.player.setVelocityY(0);
            this.player.anims.play("player_run_side",true);
            this.player.scaleX=1;
            this.player.body.offset.x=0;
        }
        else if(this.cursors.up.isDown){
            this.player.setVelocityY(-200);
            this.player.setVelocityX(0);
            this.player.anims.play("player_run_up",true);
            this.player.body.offset.y=5;
        }
        else if(this.cursors.down.isDown){
            this.player.setVelocityY(200);
            this.player.setVelocityX(0);
            this.player.anims.play("player_run_down",true);
            this.player.body.offset.y=5;
    
        }else{
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.play("player_stand",true);
            this.player.body.offset.y=0;
        }
    
    }

        //implementing score system 
    collectCoin(player, coin) {
        coin.destroy(); 
        this.currentscore += 10; 
        this.scoretext.setText('Score: ' + this.currentscore); 
        this.checkHighScore();
    }
    
    //checking highscore 
    checkHighScore() {
        
        if (this.currentscore > this.highScore) {
            this.highScore = this.currentscore;
            this.highScoreText.setText(`High Score: ${this.highScore}`);
            localStorage.setItem('highScore', this.highScore); 
        }
    }
    


    gameOver() {
        
        this.add.text(200, 300, 'Game Over Refresh To restart', {
            font: 'bold 32px Courier New    ',
            fill: '#ffffff',
        }).setScrollFactor(0);
        this.add.text(300, 340, `Score : ${this.currentscore}`, {
            font: 'bold 32px Courier New    ',
            fill: '#ffffff',
        }).setScrollFactor(0);
    
        if (this.currentscore > this.highScore) {
            localStorage.setItem('highScore', this.currentscore);
        }

        this.scene.pause();
        
        
    }
    

}

