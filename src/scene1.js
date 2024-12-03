import Phaser from 'phaser'
export default class scene1 extends Phaser.Scene{
    constructor(){
        super("bootGame");
    }
    preload(){
        this.load.image('tileset', '/assests/tilemap_assets/terrain_tiles_v2.png');
        this.load.tilemapTiledJSON('path', '/assests/tilemap_2.json');  
        this.load.atlas("player","/assests/sprites/spritesheet.png","/assests/sprites/spritesheet.json");
        this.load.atlas("coins","/assests/coin_sprites/coin_spritesheet.png","/assests/coin_sprites/coin_spritesheet.json");

    }
    create(){
        this.add.text(20,20,"Loading Game .....");
        this.scene.start("playGame");
    }
}