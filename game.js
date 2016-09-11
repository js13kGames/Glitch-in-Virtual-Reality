//SPRITES
var tilesImage = new Image();
tilesImage.src = "img/minirogue-all.png";
var spriteTileSize = 8;

//MAPS
var tileSize = 32;
var mapArray = [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]

];

var screenOffset = {
    x: 0,
    y: 0
};

function generateMap(width, height) {
    //Initialize the array
    mapArray = [];
    for (var y = 0; y < height; y++) {
        mapArray[y] = [];
        for (var x = 0; x < width; x++) {
            mapArray[y][x] = 3; //We are digging out the rooms
        }
    }

    for (var i = 0; i < 100; i++) {
        var minimumWidth = 4;
        var minimumHeight = 4;
        var roomWidth = 1;
        var roomHeight = 1;
        var roomX = 1;
        var roomY = 1;
        var tries = 0;
        do {
            if (roomIntersects(roomX, roomY, roomWidth, roomHeight)) {
                tries++;
            }

            if (tries > 100) {
                break;
            }
            roomWidth = Math.ceil(Math.random() * 10) + minimumWidth;
            roomHeight = Math.ceil(Math.random() * 10) + minimumHeight;
            roomX = Math.floor(Math.random() * width);
            roomY = Math.floor(Math.random() * height);
        } while (roomX + roomWidth > width || roomY + roomHeight > height || roomIntersects(roomX, roomY, roomWidth, roomHeight))

        carveRoom(roomX, roomY, roomWidth, roomHeight);
    }



}

function roomIntersects(x, y, width, height) {
    if (x + width > mapArray[0].length || y + height > mapArray.length) {
        return true;
    }
    for (var currentY = 0; currentY < height; currentY++) {
        for (var currentX = 0; currentX < width; currentX++) {
            if (mapArray[currentY + y][currentX + x] != 3) {
                return true;
            }

        }
    }
    return false;
}

function carveRoom(x, y, width, height) {
    if (x + width > mapArray[0].length || y + height > mapArray.length) {
        return true;
    }
    for (var currentY = 0; currentY < height; currentY++) {
        for (var currentX = 0; currentX < width; currentX++) {
            if (currentY == 0 || currentX == 0 || currentY == height - 1 || currentX == width - 1) {
                mapArray[currentY + y][currentX + x] = 1;
            } else {
                mapArray[currentY + y][currentX + x] = 0;
            }
        }
    }
}
generateMap(100, 100);

var itemTypes = ["FOOD", "POTION", "SWORD", "ARMOR"];
var enemyTypes = ["RAT", "BAT", "ZOMBIE", "GOBLIN"];
var trapTypes = ["PIT", "SPIKES", "FIRE RUNES", "POISON VENTS"];
var trapText = ["You fell down a pit.", "You were impaled by spikes.", "You set off fire runes.", "Poison blasts you in the face."];


//Player location is going to be maintained in map array index notation to prevent conversions
function Player() {
    this.x = 1;
    this.y = 1;
    this.hp = 50;
    this.armor = 0;
    this.damage = 2;
    this.sightRange = 3;
    this.inventory = [];
    this.hitRate = 0.7;

    this.equippedWeapon = "";
    this.equippedArmor = "";

    this.useItem = function(i) {
        if (i < this.inventory.length) {
            if (this.inventory[i].use(this)) { //item.use returns true if item should be removed from bag.
                this.inventory.splice(i, 1);
            }
        }

    };

    this.tossItem = function(i) {
        if (i < this.inventory.length) {
            this.inventory.splice(i, 1);
        }
    }

    this.equipItem = function(i) {
        if (i < this.inventory.length) {
            var item = this.inventory[i];

            if (item.type == "SWORD") {
                if (this.equippedWeapon != "") {
                    this.equippedWeapon.equipped = false;
                    this.damage -= this.equippedWeapon.buff;
                }

                this.equippedWeapon = item;
                this.equippedWeapon.equipped = true;
                this.damage += this.equippedWeapon.buff;
            } else if (item.type == "ARMOR") {
                if (this.equippedArmor != "") {
                    this.equippedArmor.equipped = false;
                    this.armor -= this.equippedArmor.buff;
                }

                this.equippedArmor = item;
                this.equippedArmor.equipped = true;
                this.armor += this.equippedArmor.buff;
            } else {
                addMessage("PLAYER", "You can't equip that.");
            }
        }
    }

    this.takeDamage = function(amount) {
        var damage = amount - this.armor;
        if (damage < 0) {
            damage = 0;
        }
        this.hp -= damage
    };
    this.updateUI = function() {
        var hpSpan = document.getElementById('hp');
        hpSpan.innerHTML = this.hp;
        var damageSpan = document.getElementById('damage');
        damageSpan.innerHTML = this.damage;
        var armorSpan = document.getElementById('armor');
        armorSpan.innerHTML = this.armor;
        var sightRangeSpan = document.getElementById('sightrange');
        sightRangeSpan.innerHTML = this.sightRange;

        var hitrateSpan = document.getElementById('hitrate');
        hitrateSpan.innerHTML = this.hitRate;

    };
    this.move = function(dirX, dirY, avoidCollisions) {
        if (avoidCollisions) {
            this.x += dirX;
            this.y += dirY;
            return;
        }

        var newPosX = this.x + dirX;
        var newPosY = this.y + dirY;

        //This is a roguelike.  I don't need very fancy collision detection.
        //When enemies get added I may have to iterate through them to see if I touch one though.
        if (mapArray[newPosY] != undefined) {
            if (mapArray[newPosY][newPosX] != undefined) {
                if (mapArray[newPosY][newPosX] == 0) {
                    if (!theGame.checkForEnemyAt(newPosX, newPosY, true, this.damage)) {
                        this.x = newPosX;
                        this.y = newPosY;
                    }

                    theGame.checkTraps();
                    theGame.checkForItems();
                }
            }
        }

        theGame.updateEnemies();
    }
}

function Enemy(x, y, type) {
    this.x = x;
    this.y = y;
    this.hp = 10;
    this.damage = 1;
    this.hitRate = 0.5;
    this.dead = false;
    this.type = type || "RAT";
    this.sightRange = 5;
    this.chasing = false;
    this.attackText = "has attacked the player!";
    this.spotsPlayerText = "has spotted the player!";
    this.lostPlayerText = "has lost the trail of the player..";
}

function Trap(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type || "Pit";
    this.damage = 5;
    this.setOff = false;
    this.spotted = false;
    this.spotText = "You see a trap nearby!";
    this.triggerText = "You have set off the trap!";
}

function Item(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type || "FOOD";
    this.equipped = false;
    this.useText = "Food has been collected!"
    this.buff = Math.floor(Math.random() * 20)
    this.use = function(player) {
        if (this.type == "FOOD") {
            addMessage("PLAYER", "Consumed food.");
            that.player.hp += Math.floor(Math.random() * 10);
            return true;
        } else if (this.type == "POTION") {
            this.generateRandomPotionEffect(player);
            return true;
        } else {
            addMessage("PLAYER", "You can't use that.  Try equipping it.");
        }
    }

    this.generateRandomPotionEffect = function(player) {
        var effects = ['hp', 'sightRange', 'hitRate', 'damage', 'armor'];
        var effect = effects[Math.floor(Math.random() * effects.length)];
        var multiplier = Math.random();
        var badEffect = Math.round(Math.random()); //50/50 good or bad
        var amount = player[effect] * multiplier;
        if (effect != "hitRate") {
            amount = Math.round(amount);
        }
        if (badEffect) {
            player[effect] -= amount;
            addMessage("ITEM", "The potion made you fill ill.")
        } else {
            player[effect] += amount;
            addMessage("ITEM", "The potion made you fill impowered.")
        }
    }
}


function Game() {
    that = this;
    this.state = "menu"; //menu, play, lose, win
    this.traps = [];
    this.enemies = [];
    this.items = [];
    this.player = new Player();
    this.inventoryUp = false;
    this.inventoryCursor = 0;
    //Canvas
    this.gameCanvas = document.getElementById('game');
    this.gameCtx = this.gameCanvas.getContext("2d");
    this.gameCtx.imageSmoothingEnabled = false;

    this.gameCanvas.width = 640;
    this.gameCanvas.height = 480;

    this.handleKeyPressed = function(e) {
        if (that.state == "play") {
            if (that.inventoryUp == false) {
                switch (String.fromCharCode(e.keyCode)) {
                    case 'W':
                        that.player.move(0, -1);
                        break;
                    case 'A':
                        that.player.move(-1, 0);
                        break;
                    case 'S':
                        that.player.move(0, 1);
                        break;
                    case 'D':
                        that.player.move(1, 0);
                        break;
                }

                if (e.keyCode == 13) {
                    if (that.inventoryUp == true) {
                        that.inventoryUp = false;
                    } else {
                        that.inventoryUp = true;
                    }
                }

            } else {
                switch (String.fromCharCode(e.keyCode)) {
                    case 'E': //equip
                        that.player.equipItem(that.inventoryCursor);
                        break;
                    case 'T': //toss
                        that.player.tossItem(that.inventoryCursor);
                        break;
                    case 'U': //use
                        that.player.useItem(that.inventoryCursor);
                        break;
                    case 'W': //Up
                        if (that.inventoryCursor > 0) {
                            that.inventoryCursor -= 1;
                        }

                        break;
                    case 'S': //Down
                        if (that.inventoryCursor < that.player.inventory.length - 1) {
                            that.inventoryCursor += 1;
                        }

                        break;
                }

                if (e.keyCode == 13) {
                    if (that.inventoryUp == true) {
                        that.inventoryUp = false;
                    } else {
                        that.inventoryUp = true;
                    }
                }
            }

        }
        if (that.state != "play") {
            if (e.keyCode == 13) {
                that.start();
            }
        }
    }

    this.start = function() {
        //generate map, position player, create enemies, all that fun stuff.
        this.state = "play";
        clearMessages();
        addMessage("GM", "I am zzzzhe game master.");
        addMessage("SYSTEM", "*malfunction on level 5*");
        addMessage("GM", "Welcome to the Dungeons of Ma'kidar.");
        addMessage("SYSTEM", "*ERROR 503 can not disengage virtual reality helmet*");
        addMessage("UNKNOWN", "You must defeat me to live.");
        this.player = new Player();
        this.populateTraps(10);
        this.populateEnemies(40);
        this.populateItems(50);
        this.inventoryUp = false;
        this.inventoryCursor = 0;
        var x = 0;
        var y = 0;

        do {
            x = Math.floor(Math.random() * mapArray[0].length)
            y = Math.floor(Math.random() * mapArray.length)
        } while (mapArray[y][x] != 0)
        this.player.x = x;
        this.player.y = y;
    }

    this.update = function() {
        this.player.updateUI();
        //Screen move
        if (this.player.x * tileSize + screenOffset.x + tileSize > this.gameCanvas.width)
            screenOffset.x -= this.gameCanvas.width;
        if (this.player.x * tileSize + screenOffset.x < 0)
            screenOffset.x += this.gameCanvas.width;
        if (this.player.y * tileSize + screenOffset.y + tileSize > this.gameCanvas.height)
            screenOffset.y -= this.gameCanvas.height;
        if (this.player.y * tileSize + screenOffset.y < 0)
            screenOffset.y += this.gameCanvas.height;
    }

    this.draw = function() {
        this.gameCanvas.width = this.gameCanvas.width; //clear the canvas
        this.gameCtx.imageSmoothingEnabled = false;
        if (this.state == "menu") {
            this.gameCtx.fillStyle = "black";
            this.gameCtx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

            this.gameCtx.fillStyle = "white";
            this.gameCtx.font = "20px Courier New";
            this.gameCtx.fillText("Hit Enter To Start", 240, 240);
        }

        if (this.state == "play") {
            for (var y = 0; y < mapArray.length; y++) {
                for (var x = 0; x < mapArray[y].length; x++) {
                    var tile = mapArray[y][x];

                    if (tile == 1) {
                        this.drawSprite(tilesImage, 2, 0, spriteTileSize, tileSize, x, y);
                    }
                }
            }

            //draw traps
            for (var i = 0; i < this.traps.length; i++) {
                var trap = this.traps[i];
                if (trap.spotted && !trap.setOff) {
                    this.drawSprite(tilesImage, 7, 0, spriteTileSize, tileSize, trap.x, trap.y);
                }

                if (trap.setOff) {
                    this.drawSprite(tilesImage, 6, 0, spriteTileSize, tileSize, trap.x, trap.y);
                }

            }

            //Draw Items
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];

                var xOffset = 0;
                var yOffset = 0;

                switch (item.type) {
                    case "POTION":
                        xOffset = 5;
                        yOffset = 3;
                        break;

                    case "FOOD":
                        xOffset = 1;
                        yOffset = 3;
                        break;

                    case "SWORD":
                        xOffset = 1;
                        yOffset = 4;
                        break;

                    case "ARMOR":
                        xOffset = 14;
                        yOffset = 4;
                        break;
                }

                this.drawSprite(tilesImage, xOffset, yOffset, spriteTileSize, tileSize, item.x, item.y)

            }

            //draw enemies
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];

                var xOffset = 0;
                var yOffset = 0;

                switch (enemy.type) {
                    case "RAT":
                        xOffset = 14;
                        yOffset = 6;

                        break;
                }

                if (enemy.dead == false) {
                    this.drawSprite(tilesImage, xOffset, yOffset, spriteTileSize, tileSize, enemy.x, enemy.y)
                } else {
                    this.drawSprite(tilesImage, 10, 1, spriteTileSize, tileSize, enemy.x, enemy.y)
                }
            }

            this.gameCtx.fillRect(this.player.x * tileSize + screenOffset.x, this.player.y * tileSize + screenOffset.y, tileSize, tileSize);

            this.drawSprite(tilesImage, 5, 5, spriteTileSize, tileSize, this.player.x, this.player.y)

            //draw inventory
            if (this.inventoryUp) {
                var inventoryX = this.gameCanvas.width / 4;
                var inventoryY = this.gameCanvas.height / 4;
                var inventoryWidth = this.gameCanvas.width / 2;
                var inventoryHeight = this.gameCanvas.height / 2
                this.gameCtx.fillStyle = "black";
                this.gameCtx.fillRect(inventoryX, inventoryY, inventoryWidth, inventoryHeight);

                this.gameCtx.fillStyle = "white";
                this.gameCtx.fillRect(inventoryX, inventoryY + this.inventoryCursor * tileSize, tileSize, tileSize);

                for (var i = 0; i < this.player.inventory.length; i++) {
                    this.gameCtx.fillStyle = "white";
                    if (this.player.inventory[i].equipped == true) {
                        this.gameCtx.fillStyle = "blue";
                    }
                    this.gameCtx.font = "20px Courier New";
                    this.gameCtx.fillText(this.player.inventory[i].type, inventoryX + tileSize, inventoryY + 20 + i * tileSize);
                }
            }
        }
    }

    this.cleanUp = function() {

    }

    this.drawSprite = function(img, xOffset, yOffset, spriteSize, tileSize, x, y) {
        this.gameCtx.drawImage(img, xOffset * spriteSize, yOffset * spriteSize, spriteSize, spriteSize, x * tileSize + screenOffset.x, y * tileSize + screenOffset.y, tileSize, tileSize);
    }
    this.populateItems = function(count) {
        for (var i = 0; i < count; i++) {
            var x = 0;
            var y = 0
            do {
                x = Math.floor(Math.random() * mapArray[0].length)
                y = Math.floor(Math.random() * mapArray.length)
            } while (mapArray[y][x] != 0)
            this.items.push(new Item(x, y, itemTypes[Math.floor(Math.random() * itemTypes.length)]))
        }
    }

    this.populateTraps = function(count) {
        for (var i = 0; i < count; i++) {
            var x = 0;
            var y = 0
            do {
                x = Math.floor(Math.random() * mapArray[0].length)
                y = Math.floor(Math.random() * mapArray.length)
            } while (mapArray[y][x] != 0)
            this.traps.push(new Trap(x, y))
        }
    }

    this.populateEnemies = function(count) {
        for (var i = 0; i < count; i++) {
            var x = 0;
            var y = 0
            do {
                x = Math.floor(Math.random() * mapArray[0].length)
                y = Math.floor(Math.random() * mapArray.length)
            } while (mapArray[y][x] != 0)
            this.enemies.push(new Enemy(x, y))
        }
    }

    this.updateEnemies = function() {
        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];
            if (enemy.dead == false) {
                var newEnemyX = enemy.x;
                var newEnemyY = enemy.y;
                if (Math.abs(enemy.x - this.player.x) < enemy.sightRange && Math.abs(enemy.y - this.player.y) < enemy.sightRange) {
                    if (enemy.chasing == false) {
                        enemy.chasing = true;
                        addMessage(enemy.type, enemy.spotsPlayerText);
                    }

                    //very primative AI
                    if (enemy.x < this.player.x) {
                        newEnemyX += 1;
                    } else if (enemy.x > this.player.x) {
                        newEnemyX -= 1;
                    }
                    if (enemy.y > this.player.y) {
                        newEnemyY -= 1;
                    } else if (enemy.y < this.player.y) {
                        newEnemyY += 1;
                    }
                } else {
                    if (enemy.chasing == true) {
                        enemy.chasing = false;
                        addMessage(enemy.type, enemy.lostPlayerText);
                    }

                    newEnemyX += Math.floor(Math.random() * 3) - 1
                    newEnemyY += Math.floor(Math.random() * 3) - 1
                }

                if (mapArray[newEnemyY] != undefined) {
                    if (mapArray[newEnemyY][newEnemyX] != undefined) {
                        if (mapArray[newEnemyY][newEnemyX] == 0) {
                            //check if player
                            if (this.player.x == newEnemyX && this.player.y == newEnemyY) {
                                var hitChance = Math.random();
                                if (hitChance < enemy.hitRate) {
                                    addMessage(enemy.type, enemy.attackText);
                                    this.player.takeDamage(enemy.damage)
                                } else {
                                    addMessage(enemy.type, "Attack missed the player!");
                                }

                            } else if (!this.checkForEnemyAt(newEnemyX, newEnemyY, false)) {
                                enemy.x = newEnemyX;
                                enemy.y = newEnemyY;
                            }

                        }
                    }
                }
            }
        }
    }

    this.checkForItems = function() {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];

            if (item.x == this.player.x && item.y == this.player.y) {
                this.player.inventory.push(item);
                //remove item
                addMessage("PLAYER", "Picked up " + item.type)
                this.items.splice(i, 1);
                return;
            }
        }
    }

    this.checkTraps = function() {
        for (var i = 0; i < this.traps.length; i++) {
            var trap = this.traps[i];
            if (!trap.setOff) {
                if (trap.x == this.player.x && trap.y == this.player.y) {
                    trap.setOff = true;
                    addMessage("TRAP", trap.triggerText);
                    this.player.takeDamage(trap.damage);
                }

                if (!trap.spotted) {
                    if (Math.abs(trap.x - this.player.x) < this.player.sightRange && Math.abs(trap.y - this.player.y) < this.player.sightRange) {
                        trap.spotted = true;
                        addMessage("TRAP", trap.spotText);
                    }
                }
            }
        }
    }

    this.checkForEnemyAt = function(x, y, attack, damage) {
        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];

            if (enemy.x == x && enemy.y == y && enemy.dead == false) {
                if (attack) {
                    var hitChance = Math.random();
                    if (hitChance < this.player.hitRate) {
                        addMessage("PLAYER", "You have attacked the enemy.");
                        enemy.hp -= damage;
                        if (enemy.hp <= 0) {
                            enemy.dead = true;
                            addMessage("PLAYER", enemy.type + " has been slain!");
                        }
                    } else {
                        addMessage("PLAYER", "Attack misssed the enemy!");
                    }

                }

                return true;
            }
        }

        return false;
    }
}


theGame = new Game();
//Main Loop
var mainloop = function() {
    theGame.update();
    theGame.draw();
};

var animFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    null;

var recursiveAnim = function() {
    mainloop();
    animFrame(recursiveAnim);
};


// start the mainloop
document.addEventListener("keydown", theGame.handleKeyPressed, false);
animFrame(recursiveAnim);

function addMessage(from, message) {
    var messageLog = document.getElementById("messageLog");
    var currentMessageLogText = messageLog.innerHTML;

    var newMessage = "<b>" + from + "</b>: " + message + "</br>";

    currentMessageLogText = currentMessageLogText + newMessage;

    messageLog.innerHTML = currentMessageLogText;

    messageLog.scrollTop = messageLog.scrollHeight;
}

function clearMessages() {
    var messageLog = document.getElementById("messageLog");
    messageLog.innerHTML = "<b>Message Log</b></br>";
}
