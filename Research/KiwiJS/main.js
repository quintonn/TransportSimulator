var gameOptions = {
    width: screen.width * 99 / 100,
    height: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) * 97 / 100
};

var myGame = new Kiwi.Game("", "MyGame", null, gameOptions);

var myState = new Kiwi.State("myState");

myState.init = function ()
{
    //this.game.stage.scaleType = 2; /// stretches the images
    //this.game.stage.width = screen.width;
    //this.game.stage.height = screen.availHeight;
}

myState.preload = function ()
{
    Kiwi.State.prototype.preload.call(this);
    this.addSpriteSheet('characterSprite', 'antlion_0.png', 128, 128);
    this.addImage('background', 'grass.jpg');
}

myState.create = function ()
{

    Kiwi.State.prototype.create.call(this);

    this.character = new Kiwi.GameObjects.Sprite(this, this.textures.characterSprite, 10, 10);

    var bg = new Kiwi.Plugins.GameObjects.RepeatingTexture(this, this.textures.background, 0, 0, this.game.stage.width, this.game.stage.height);
    

    this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
    this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
    this.downKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.S);
    this.upKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.W);

    this.character.animation.add("idleleft", [0], 0.1, false);
    this.character.animation.add("moveleft", [4, 5, 6, 7, 8, 9, 10, 11], 0.1, true);

    this.character.animation.add("idleright", [128], 0.1, false);
    this.character.animation.add("moveright", [132, 133, 134, 135, 136, 137, 138, 139], 0.1, true);

    this.character.animation.add('idledown', [192], 0.1, true);
    this.character.animation.add("movedown", [196, 197, 198, 199, 200, 201, 202, 203], 0.1, true);

    this.character.animation.add('idleup', [64], 0.1, true);
    this.character.animation.add("moveup", [68, 69, 70, 71, 72, 73, 74, 75], 0.1, true);

    this.facing = "left";

    this.character.animation.play("idleleft");

    this.addChild(bg);
    this.addChild(this.character);
};

myState.update = function ()
{
    Kiwi.State.prototype.update.call(this);
    //if ( this.downKey.isDown ) {
    //    if ( this.character.animation.currentAnimation.name != ( "crouch" + this.facing ))
    //        this.character.animation.play( "crouch" + this.facing );
    //}
    //else 
    if (this.leftKey.isDown && this.downKey.isDown)
    {
        
    }
    if (this.leftKey.isDown)
    {
        this.facing = "left";

        if (this.character.transform.x > -40)
        {
            this.character.transform.x -= 3;
        }
        if (this.character.animation.currentAnimation.name != "moveleft")
        {
            this.character.animation.play("moveleft");
        }
    }
    else if (this.rightKey.isDown)
    {
        this.facing = "right";

        if (this.character.transform.x < (this.game.stage.width - this.character.width))
        {
            console.log(this.character.height);
            this.character.transform.x += 3;
        }
        if (this.character.animation.currentAnimation.name != "moveright")
        {
            this.character.animation.play("moveright");
        }
    }
    else if (this.downKey.isDown)
    {
        this.facing = "down";
        if (this.character.transform.y < (this.game.stage.height - this.character.height))
        {
            this.character.transform.y += 3;
        }
        if (this.character.animation.currentAnimation.name != "movedown")
        {
            this.character.animation.play("movedown");
        }
    }
    else if (this.upKey.isDown)
    {
        this.facing = "up";
        if (this.character.transform.y > -60)
        {
            this.character.transform.y -= 3;
        }
        if (this.character.animation.currentAnimation.name != "moveup")
        {
            this.character.animation.play("moveup");
        }
    }
    else
    {
        if (this.character.animation.currentAnimation.name != "idle" + this.facing)
        {
            this.character.animation.play("idle" + this.facing);
        }
    }
}

myGame.states.addState(myState);
myGame.states.switchState("myState");