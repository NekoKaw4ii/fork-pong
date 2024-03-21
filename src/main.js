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
let scorePlayer1 = 0, scorePlayer2 = 0;
let scoreTextPlayer1, scoreTextPlayer2;
let puntoSegnato = false;

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
            fontSize: '30px',
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
            fontSize: '25px',
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

    scoreTextPlayer1 = this.add.text(this.physics.world.bounds.width /4, 32, '0', { fontSize: '56px', fill: '#fff' }).setOrigin(0.5);
    scoreTextPlayer2 = this.add.text(this.physics.world.bounds.width * 3 / 4, 32, '0', { fontSize: '56px', fill: '#fff' }).setOrigin(0.5);    

    puntoP2.setOrigin(0.5);
    puntoP2.setVisible(false);

    let btnSpaziale = this.add.text(100, 100, 'Gravità Spaziale', { fill: '#fff' })
    .setInteractive()
    .on('pointerdown', () => { velocitaPalla = Math.random() * 200 + 50;;  })
    .on('pointerover', () => btnSpaziale.setScale(1.5))
    .on('pointerout', () => btnSpaziale.setScale(1));

    let btnTerrestre = this.add.text(100, 150, 'Gravità Terrestre', { fill: '#fff' })
    .setInteractive()
    .on('pointerdown', () => { velocitaPalla = 800;  })
    .on('pointerover', () => btnTerrestre.setScale(1.5))
    .on('pointerout', () => btnTerrestre.setScale(1));

    let btnPersonalizzata = this.add.text(100, 200, 'Personalizzata', { fill: '#fff' })
    .setInteractive()
    .on('pointerdown', () => { 
        let velocitaUtente = prompt("Inserisci la velocità della palla:");
        if (velocitaUtente !== null && velocitaUtente !== "") {
            velocitaPalla = Number(velocitaUtente);
        }
    })
    .on('pointerover', () => btnPersonalizzata.setScale(1.5))
    .on('pointerout', () => btnPersonalizzata.setScale(1));

}



function update() {
    if ((!puntoSegnato) && (isPlayer2Point())) {
        puntoSegnato = true;
        scorePlayer1 += 1;
        scoreTextPlayer1.setText(scorePlayer1);
        puntoP1.setVisible(true);
        this.time.delayedCall(1000, resetPalla, [this], this);
        return;
    }
    if ((!puntoSegnato) && (isPlayer1Point())) {
        puntoSegnato = true;
        scorePlayer2 += 1;
        scoreTextPlayer2.setText(scorePlayer2);
        puntoP2.setVisible(true);
        this.time.delayedCall(1000, resetPalla, [this], this);
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


function resetPalla() {
    palla.setPosition(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2);
    const vXIniziale = velocitaPalla;
    const vYIniziale = velocitaPalla;
    palla.setVelocityX(vXIniziale);
    palla.setVelocityY(vYIniziale);
    puntoP1.setVisible(false);
    puntoP2.setVisible(false);
    inPartita = false;
    puntoSegnato = false;
}