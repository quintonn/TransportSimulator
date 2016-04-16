document.oncontextmenu = function ()
{
    return false;
}

function mouseMovement()
{
    var self = this;
    self.originX = 0;
    self.originY = 0;
    self.targetX = 0;
    self.targetY = 0;
    self.angle = 0;
    self.move = false;
    self.xSpeed = 0;
    self.ySpeed = 0;
}

var gameOptions = {
    width: screen.width * 99 / 100,
    height: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 97 / 100
};

var myGame = new Kiwi.Game("", "MyGame", null, gameOptions);
var myState = new Kiwi.State("myState");

myState.preload = function ()
{
    Kiwi.State.prototype.preload.call(this);
    //this.addSpriteSheet('characterSprite', 'antlion_0.png', 128, 128);
    this.addSpriteSheet('characterSprite', 'Ants.png', 32, 32);
    this.addSpriteSheet('antlionSprite', 'antlion_0.png', 128, 128);
    this.addImage('background', 'grass.jpg');
}

myState.create = function ()
{
    this.mouse = this.game.input.mouse;
    this.clickMove = new mouseMovement();

    Kiwi.State.prototype.create.call(this);

    this.character = new Kiwi.GameObjects.Sprite(this, this.textures.characterSprite, 10, 10);
    this.antlion = new Kiwi.GameObjects.Sprite(this, this.textures.antlionSprite, 100, 100);

    var bg = new Kiwi.Plugins.GameObjects.RepeatingTexture(this, this.textures.background, 0, 0, this.game.stage.width, this.game.stage.height);

    this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
    this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
    this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);
    this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);

    this.character.animation.add("idleright", [33], 0.1, false);
    this.character.animation.add("moveright", [33, 34, 35], 0.1, true);

    this.character.transform.rotPointX = this.character.width / 2;
    this.character.transform.rotPointY = this.character.height / 2;

    this.antlion.animation.add("idleleft", [0], 0.1, false);
    this.antlion.animation.add("moveleft", [4, 5, 6, 7, 8, 9, 10, 11], 0.1, true);
           
    this.antlion.animation.add("idleright", [128], 0.1, false);
    this.antlion.animation.add("moveright", [132, 133, 134, 135, 136, 137, 138, 139], 0.1, true);
           
    this.antlion.animation.add('idledown', [192], 0.1, true);
    this.antlion.animation.add("movedown", [196, 197, 198, 199, 200, 201, 202, 203], 0.1, true);
           
    this.antlion.animation.add('idleup', [64], 0.1, true);
    this.antlion.animation.add("moveup", [68, 69, 70, 71, 72, 73, 74, 75], 0.1, true);

    this.facing = "right";

    this.antlion.facing = "right";
    this.antlion.animation.play("idleright");

    this.character.animation.play("idleright");

    this.addChild(bg);
    this.addChild(this.character);
    this.addChild(this.antlion);

    console.clear();
};

myState.update = function ()
{
    Kiwi.State.prototype.update.call(this);

    if (this.mouse.isDown && this.mouse.button === Kiwi.Input.Mouse.RIGHT_BUTTON )
    {
        this.clickMove.targetX = this.game.input.x;
        this.clickMove.targetY = this.game.input.y;
        
        this.clickMove.originX = this.character.x + (this.character.width / 2);
        this.clickMove.originY = this.character.y + (this.character.height / 2);

        console.log(this.character.x + "|" + this.clickMove.originX);

        this.clickMove.move = true;

        var target = new Kiwi.Geom.Point(this.clickMove.targetX, this.clickMove.targetY);
        var origin = new Kiwi.Geom.Point(this.clickMove.originX, this.clickMove.originY);
        this.clickMove.angle = origin.angleTo(target);

        if (this.line != null)
        {
            this.removeChild(this.line);
        }
        this.line = new Kiwi.Plugins.Primitives.Line({
            state: myState,
            points: [[this.clickMove.originX, this.clickMove.originY], [this.clickMove.targetX, this.clickMove.targetY]]
        });
        //this.addChild(this.line);

        this.character.transform.rotation = this.clickMove.angle;// Kiwi.Utils.GameMath.degreesToRadians(this.clickMove.angle);

        var horizontalDist = this.clickMove.targetX - this.clickMove.originX;
        var verticalDist = this.clickMove.targetY - this.clickMove.originY;
        var slope = verticalDist / horizontalDist;

        var speed = 3;
        var distance = Math.sqrt(Math.pow(this.clickMove.targetX - this.clickMove.originX, 2) + Math.pow(this.clickMove.targetY - this.clickMove.originY, 2));
        var directionX = (this.clickMove.targetX - this.clickMove.originX) / distance;
        var directionY = (this.clickMove.targetY - this.clickMove.originY) / distance;
        
        this.clickMove.xSpeed = directionX * speed;
        this.clickMove.ySpeed = directionY * speed;

        this.mouse.reset();
    }

    if (this.clickMove.move == true)
    {
        var xDist = Math.abs(this.clickMove.targetX - this.clickMove.originX);
        var yDist = Math.abs(this.clickMove.targetY - this.clickMove.originY);

        var xMoved = Math.abs(this.clickMove.originX - this.character.x - (this.character.width / 2));
        var yMoved = Math.abs(this.clickMove.originY - this.character.y - (this.character.height / 2));
        
        if ((xDist - xMoved) > 0 && (yDist - yMoved) > 0)
        {
            this.character.transform.x += this.clickMove.xSpeed;
            this.character.transform.y += this.clickMove.ySpeed;
            if (this.character.animation.currentAnimation.name != "moveright")
            {
                this.character.animation.play("moveright");
            }
        }
        else
        {
            this.character.animation.play("idleright");
        }
    }

    if (this.leftKey.isDown)
    {
        this.antlion.facing = "left";

        if (this.antlion.transform.x > -40)
        {
            this.antlion.transform.x -= 3;
        }
        if (this.antlion.animation.currentAnimation.name != "moveleft")
        {
            this.antlion.animation.play("moveleft");
        }
    }
    else if (this.rightKey.isDown)
    {
        this.antlion.facing = "right";
        if (this.antlion.transform.x < (this.game.stage.width - this.antlion.width))
        {
            this.antlion.transform.x += 3;
        }
        if (this.antlion.animation.currentAnimation.name != "moveright")
        {
            this.antlion.animation.play("moveright");
        }
    }
    else if (this.downKey.isDown)
    {
        this.antlion.facing = "down";
        if (this.antlion.transform.y < (this.game.stage.height - this.antlion.height))
        {
            this.antlion.transform.y += 3;
        }
        if (this.antlion.animation.currentAnimation.name != "movedown")
        {
            this.antlion.animation.play("movedown");
        }
    }
    else if (this.upKey.isDown)
    {
        this.antlion.facing = "up";
        if (this.antlion.transform.y > -60)
        {
            this.antlion.transform.y -= 3;
        }
        if (this.antlion.animation.currentAnimation.name != "moveup")
        {
            this.antlion.animation.play("moveup");
        }
    }
    else
    {
        if (this.antlion.animation.currentAnimation.name != "idle" + this.facing)
        {
            this.antlion.animation.play("idle" + this.facing);
        }
    }
}

myGame.states.addState(myState);
myGame.states.switchState("myState");