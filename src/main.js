const config = {
    type: Phaser.AUTO,
    parent: 'gioco',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
        }
    }
};

const game = new Phaser.Game(config);

let player, palla, cursore;
const keys = {};
let inPartita = false;
let testoApertura, puntoP1, puntoP2;

function preload() {
    this.load.image('sfondo', '../assets/images/sfondo.png');
    this.load.image('palla', '../assets/images/palla.png');
    this.load.image('player', '../assets/images/player.png');
}

function create() {

    sfondo = this.physics.add.sprite(
        this.physics.world.bounds.width /2,
        this.physics.world.bounds.height /2,
        'sfondo' 
    );

    palla = this.physics.add.sprite(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2, 
        'palla' 
    );
    palla.setVisible(false);
        
    player1 = this.physics.add.sprite(
        this.physics.world.bounds.width - (palla.body.width / 2 + 1),
        this.physics.world.bounds.height / 2, 
        'player', 
    );

    player2 = this.physics.add.sprite(
        (palla.body.width / 2 + 1),
        this.physics.world.bounds.height / 2, 
        'player', 
    );

    cursore = this.input.keyboard.createCursorKeys();
    keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    player1.setCollideWorldBounds(true);
    player2.setCollideWorldBounds(true);

    palla.setCollideWorldBounds(true);
    palla.setBounce(1, 1);

    player1.setImmovable(true);
    player2.setImmovable(true);
    
    this.physics.add.collider(palla, player1, null, null, this);
    this.physics.add.collider(palla, player2, null, null, this);

    testoApertura = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Ciao! Benvenuto in Fork Pong!\nPremi spazio per giocare.\n\n\n\nPremi W e S per controllare\nil giocatore di sinistra e le freccette\nper quello di destra.',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '20px',
            fill: '#fff'
        }
    );
    
    testoApertura.setOrigin(0.5);

    puntoP1 = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Punto per il giocatore 1',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '20px',
            fill: '#fff'
        }
    );
  
    puntoP1.setOrigin(0.5);
    puntoP1.setVisible(false);

    puntoP2 = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Punto per il giocatore 2',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '25px',
            fill: '#fff'
        }
    );

    puntoP2.setOrigin(0.5);
    puntoP2.setVisible(false);
}

function update() {
    if (isPlayer1Point()) {
        puntoP1.setVisible(true);
        palla.disableBody(true, true);
        return;
    }
    if (isPlayer2Point()) {
        puntoP2.setVisible(true);
        palla.disableBody(true, true);
        return;
    }

    player1.body.setVelocityY(0);
    player2.body.setVelocityY(0);

    if (cursore.up.isDown) {
        player1.body.setVelocityY(-350);
    } else if (cursore.down.isDown) {
        player1.body.setVelocityY(350);
    }
    
    if (keys.w.isDown) {
        player2.body.setVelocityY(-350);
    } else if (keys.s.isDown) {
        player2.body.setVelocityY(350);
    }

    if (!inPartita) {
        if (cursore.space.isDown) {
            palla.setVisible(true);
            inPartita = true;
            const vXIniziale = Math.random() * 200 + 50;
            const vYIniziale = Math.random() * 200 + 50;
            palla.setVelocityX(vXIniziale);
            palla.setVelocityY(vYIniziale);
            testoApertura.setVisible(false);
        }
    }
}

function isPlayer1Point() {
    return palla.body.x < player2.body.x;
}

function isPlayer2Point() {
    return palla.body.x > player1.body.x;
}
