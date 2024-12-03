import './style.css'
import scene1 from './scene1';
import scene2 from './scene2';
import Phaser from 'phaser'



const sizes={
  width: 950,
  height: 600,
}

const config={
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gamecanvas,
  physics:{
    default:"arcade",
    arcade:{
      debug:false,

    }
  },
  scene: [scene1,scene2],
        
  scale: {
            zoom:-1
        },


}


const game= new Phaser.Game(config)


window.addEventListener('beforeunload', () => {
  const activeScene = game.scene.getScene('scene2');
  if (activeScene && activeScene.saveHighScore) {
      activeScene.saveScore();
  }
});