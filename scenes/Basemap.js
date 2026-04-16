export default class BaseMap extends Phaser.Scene {
    createMap(mapKey, spawnX, spawnY) {

    this.input.setTopOnly(false);

    this.isChangingScene = false;
    this.isTalking = false;

    const map = this.make.tilemap({ key: mapKey });
    this.map = map;

    const blockTiles = map.addTilesetImage("block1", "tiles");
    const decoTiles = map.addTilesetImage("collision", "collision");

    const layerName =
        map.layers.find(l => l.name === "mainmap")?.name ||
        map.layers.find(l => l.type === "tilelayer")?.name;

    const layer = map.createLayer(layerName, [blockTiles, decoTiles], 0, 0);
    this.mapLayer = layer;

    if (layer) {
        layer.setCollisionByProperty({ coli: true });
    }

    // background
this.bg1 = this.add.image(0, 0, "bg1")
    .setOrigin(0)
    .setDepth(-4)
    .setScrollFactor(0);

this.bg2 = this.add.image(0, 0, "bg2")
    .setOrigin(0)
    .setDepth(-3)
    .setScrollFactor(0);

this.bg3 = this.add.image(0, 0, "bg3")
    .setOrigin(0)
    .setDepth(-2)
    .setScrollFactor(0);

this.bg4 = this.add.image(0, 0, "bg4")
    .setOrigin(0)
    .setDepth(-1)
    .setScrollFactor(0);

// Hàm resize background
const resizeBG = (width, height) => {

    const scale = 0.8; 

    this.bg1.setDisplaySize(width * scale, height * scale);
    this.bg2.setDisplaySize(width * scale, height * scale);
    this.bg3.setDisplaySize(width * scale, height * scale);
    this.bg4.setDisplaySize(width * scale, height * scale);

   
    this.bg1.setPosition((width - width * scale) / 2, (height - height * scale) / 2);
    this.bg2.setPosition((width - width * scale) / 2, (height - height * scale) / 2);
    this.bg3.setPosition((width - width * scale) / 2, (height - height * scale) / 2);
    this.bg4.setPosition((width - width * scale) / 2, (height - height * scale) / 2);
};


resizeBG(this.scale.width, this.scale.height);


this.scale.on("resize", (gameSize) => {
    resizeBG(gameSize.width, gameSize.height);
});

    // player
    this.player = this.physics.add.sprite(spawnX, spawnY, "player");
    this.player.direction = "right";
    this.canAttack = true;  

    this.player.setCollideWorldBounds(true);
    this.player.setSize(30, 50);
    this.player.setOffset(25, 5);
    this.player.setMaxVelocity(200, 500);
    this.player.setDragX(600);

    if (layer) {
        this.physics.add.collider(this.player, layer);
    }

    //  TẠO ANIMATION 
    if (!this.anims.exists("enemy_walk")) {
        this.anims.create({
            key: "enemy_walk",
            frames: this.anims.generateFrameNumbers("enemy_walk", {
                start: 0,
                end: 5 
            }),
            frameRate: 6,
            repeat: -1
        });
    }

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    const cam = this.cameras.main;

this.cameras.main.startFollow(this.player);

this.cameras.main.setBounds(
    0,
    0,
    map.widthInPixels,
    map.heightInPixels
);


this.cameras.main.setZoom(2); 

    this.cursors = this.input.keyboard.createCursorKeys();
    this.createPortals(map);
    this.attackKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
);
}
    createNPC() {

        this.npc = this.physics.add.sprite(255, 485, "npc");

        this.npc.setImmovable(true);
        this.npc.body.setAllowGravity(false);

        this.npc.setInteractive({ useHandCursor: true });
        this.npc.setDepth(10);

        this.npc.on("pointerdown", (pointer, x, y, event) => {

            event.stopPropagation(); 

            if (this.isTalking) return;

            this.showDialogue([
                "Xin chào!",
                "Ta là nhà vua 👑",
                "Ngươi đã đến đúng nơi!",
                "Chúc ngươi may mắn!"
            ]);
        });
    }

    showDialogue(dialogues) {

        if (this.isTalking) return;

        this.isTalking = true;
        this.dialogIndex = 0;
        this.dialogues = dialogues;

        const width = this.scale.width;
        const height = this.scale.height;

        this.dialogBox = this.add.rectangle(
            width / 2,
            height -200,
            700,
            160,
            0x000000,
            0.8
        )
        .setScrollFactor(0)
        .setDepth(999);

        this.dialogText = this.add.text(
            width / 2 - 300,
            height - 250,
            this.dialogues[this.dialogIndex],
            {
                fontSize: "20px",
                fill: "#ffffff",
                wordWrap: { width: 640 }
            }
        )
        .setScrollFactor(0)
        .setDepth(1000);

       
        this.time.delayedCall(100, () => {
            this.input.on("pointerdown", this.nextDialogue, this);
        });
    }
    nextDialogue() {

        this.dialogIndex++;

        if (this.dialogIndex >= this.dialogues.length) {

            this.dialogBox.destroy();
            this.dialogText.destroy();

            this.isTalking = false;

            this.input.off("pointerdown", this.nextDialogue, this);
            return;
        }

        this.dialogText.setText(this.dialogues[this.dialogIndex]);
    }



    createPortals(map) {

        const objects = map.getObjectLayer("object");
        if (!objects) return;

        objects.objects.forEach(obj => {

            if (obj.name !== "portal") return;

            const zone = this.add.zone(
                obj.x + obj.width / 2,
                obj.y + obj.height / 2,
                obj.width,
                obj.height
            );

            this.physics.world.enable(zone);

            zone.body.setAllowGravity(false);
            zone.body.setImmovable(true);

            this.physics.add.overlap(this.player, zone, () => {

                if (this.isChangingScene) return;

                this.isChangingScene = true;
                zone.body.enable = false;

                const sceneProp = obj.properties?.find(p => p.name === "scene");
                const targetScene = sceneProp?.value;

                if (targetScene) {
                    this.scene.start(targetScene);
                }
            });
        });
    }



    updatePlayer() {

        if (!this.player) return;

        if (this.isTalking) {
            this.player.setVelocity(0);
            return;
        }

        const speed = 160;
this.player.setVelocityX(0);

// di chuyển + hướng
if (this.cursors.left.isDown) {
    this.player.setVelocityX(-speed);
    this.player.direction = "left";
}
else if (this.cursors.right.isDown) {
    this.player.setVelocityX(speed);
    this.player.direction = "right";
}

// nhảy (giữ nguyên riêng)
if (this.cursors.up.isDown && this.player.body.blocked.down) {
    this.player.setVelocityY(-300);
}
    }
    createEnemies() {
            
    this.enemies = this.physics.add.group();

    this.enemyData = [
        { x: 400, y: 485, range: 20 },
        { x: 800, y: 485, range: 20 }
    ];

    this.enemyData.forEach(data => {
         this.spawnEnemy(data);
    });
}   
    spawnEnemy(data) {

    const enemy = this.enemies.create(data.x, data.y, "enemy_walk");

    enemy.startX = data.x;
    enemy.range = data.range;
    enemy.direction = 1;
    enemy.speed = 50;
    enemy.maxHealth = 60;
    enemy.health = 60;
    enemy.isHit = false;
    // THANH hp
        enemy.hpBg = this.add.rectangle(enemy.x, enemy.y - 40, 40, 6, 0x000000);
enemy.hpBg.setDepth(10);

enemy.hpBar = this.add.rectangle(enemy.x, enemy.y - 40, 40, 6, 0xff0000);
enemy.hpBar.setDepth(11);
    enemy.body.setAllowGravity(false);
    enemy.play("enemy_walk");

    if (this.map) {
        this.physics.add.collider(enemy, this.mapLayer);
    }

    return enemy;
}
    updateEnemies() {

    this.enemies.children.iterate(enemy => {

        enemy.hpBg.setPosition(enemy.x, enemy.y - 40);
enemy.hpBar.setPosition(enemy.x, enemy.y - 40);

// scale theo máu
const hpPercent = enemy.health / enemy.maxHealth;
enemy.hpBar.width = 40 * hpPercent;
        enemy.setVelocityX(enemy.speed * enemy.direction);

        if (enemy.x > enemy.startX + enemy.range) {
            enemy.direction = -1;
        }
        else if (enemy.x < enemy.startX - enemy.range) {
            enemy.direction = 1;
        }

        // lật sprite
        enemy.setFlipX(enemy.direction > 0);
    });
}
    attack() {
    if (!this.canAttack || !this.enemies) return;

    this.canAttack = false;

    // xác định hướng đánh
    const offsetX = this.player.direction === "right" ? 30 : -30;

    const hitbox = this.physics.add.sprite(
        this.player.x + offsetX,
        this.player.y,
        null
    );

    hitbox.body.setSize(40, 40);
    hitbox.setVisible(false);

    // check trúng enemy
    this.physics.add.overlap(hitbox, this.enemies, (hitbox, enemy) => {

    if (!enemy.active || enemy.isHit) return;

    enemy.isHit = true;

    enemy.health -= 10;
    const dmg = 10;

const damageText = this.add.text(
    enemy.x,
    enemy.y - 50,
    "-" + dmg,
    {
        fontSize: "16px",
        fill: "#ff0000",
        fontStyle: "bold"
    }
).setOrigin(0.5);

this.tweens.add({
    targets: damageText,
    y: damageText.y - 30,
    alpha: 0,
    duration: 600,
    ease: "Power1",
    onComplete: () => damageText.destroy()
});

    enemy.setVelocityX(this.player.direction === "right" ? 100 : -100);

   if (enemy.health <= 0) {

    const data = {
        x: enemy.startX,
        y: enemy.y,
        range: enemy.range
    };

    enemy.hpBg.destroy();
    enemy.hpBar.destroy();
    enemy.destroy();

    this.time.delayedCall(3000, () => {
        this.spawnEnemy(data);
    });
}
    this.time.delayedCall(300, () => {
        enemy.isHit = false;
    });

});
    // xoá hitbox nhanh
    this.time.delayedCall(150, () => {
        hitbox.destroy();
    });

    // cooldown
    this.time.delayedCall(400, () => {
        this.canAttack = true;
    });
    
}
}
