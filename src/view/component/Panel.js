/**
 * Slot game demo - Pure MVC, Pixi.js v4
 * @author      Murali Saripalli
 * @desc
 * @class       Panel
 */
puremvc.define(
    {
        name: 'slot.view.component.Panel',
        constructor: function () {
            this.stage = new PIXI.Container();
        }
    },

    // INSTANCE MEMBERS
    {
        // Stage Members
        stage: null,

        spin: null,
        btnSpin: null,

        win: null,
        txtWin: null,

        balance: null,
        txtBalance: null,

        bet: null,
        btnBetPlus: null,
        btnBetMinus: null,
        txtBet: null,

        currency: null,
        denominations: null,
        currentDenomination: null,

        init: function (data) {
            this.currency = data.uiConfigVO.currency;
            this.denominations = data.gameConfigVO.denominations;
            this.currentDenomination = data.gameConfigVO.defaultDenomination;

            this.addChildren(data.resources);
            this.setupView(data.windowSizeVO);

            PXRoot.addChild(this.stage);
        },

        addChildren: function(resources){
            // Spin component
            this.spin = new PIXI.Container();
            this.spin.addChild(new PIXI.Sprite(resources.spin_disabled.texture));
            this.spin.addChild(this.btnSpin = new PIXI.Sprite(resources.spin.texture));
            this.stage.addChild(this.spin);

            // Win component ==>
            this.win = new PIXI.Container();
            this.win.addChild(new PIXI.Sprite(resources.win.texture));

            this.txtWin = new PIXI.Text();
            this.txtWin.style = {fontSize: 24, align: 'center'};
            this.txtWin.x = 12;
            this.txtWin.y = 42;
            this.win.addChild(this.txtWin);

            this.stage.addChild(this.win);
            // Win component <==

            // Balance component ==>
            this.balance = new PIXI.Container();
            this.balance.addChild(new PIXI.Sprite(resources.balance.texture));

            this.txtBalance = new PIXI.Text();
            this.txtBalance.style = {fontSize: 24, align: 'center'};
            this.txtBalance.x = 12;
            this.txtBalance.y = 42;
            this.balance.addChild(this.txtBalance);

            this.stage.addChild(this.balance);
            // <== Balance component

            // Bet component ===>
            this.bet = new PIXI.Container();
            this.bet.addChild(new PIXI.Sprite(resources.bet_minus_disabled.texture));
            this.bet.addChild(this.btnBetMinus = new PIXI.Sprite(resources.bet_minus.texture));
            var betSprite = new PIXI.Sprite(resources.bet.texture);
            betSprite.x += this.btnBetMinus.width + 2;
            this.bet.addChild(betSprite);
            var betPlusDSprite = new PIXI.Sprite(resources.bet_plus_disabled.texture);
            betPlusDSprite.x = betSprite.x + betSprite.width + 2;
            this.bet.addChild(betPlusDSprite);
            this.bet.addChild(this.btnBetPlus = new PIXI.Sprite(resources.bet_plus.texture));
            this.btnBetPlus.x = betPlusDSprite.x;

            this.txtBet = new PIXI.Text();
            this.txtBet.style = {fontSize: 24, align: 'center'};
            this.txtBet.x = betSprite.x + 7;
            this.txtBet.y = betSprite.y + 40;
            this.bet.addChild(this.txtBet);

            this.stage.addChild(this.bet);
            // <=== Bet component

            // Buttons
            this.btnSpin.interactive = true;
            this.btnSpin.on("click", this.onSpinClick.bind(this));
            this.btnBetMinus.interactive = true;
            this.btnBetMinus.on("click", this.onBetMinusClick.bind(this));
            this.btnBetPlus.interactive = true;
            this.btnBetPlus.on("click", this.onBetPlusClick.bind(this));

            // Initial values
            this.updateBet();
        },

        setupView: function(windowSizeVO){
            this.spin.x = windowSizeVO.width - this.spin.width;
            this.spin.y = windowSizeVO.height - this.spin.height;

            this.win.x = (windowSizeVO.width - this.win.width)/2;
            this.win.y = 0;

            this.balance.x = (windowSizeVO.width - this.balance.width)/2;
            this.balance.y = windowSizeVO.height - this.balance.height;

            this.bet.x = 0;
            this.bet.y = windowSizeVO.height - this.bet.height;
        },

        updateBalance: function(balance){
            this.txtBalance.text = this.currency + balance.toFixed(2);
        },

        updateWin: function(win){
            this.txtWin.text = this.currency + win.toFixed(2);
        },

        updateBet: function(){
            this.txtBet.text = this.currency + this.denominations[this.currentDenomination].toFixed(2);
        },

        increaseBet: function(){
            if(this.currentDenomination < this.denominations.length - 1){
                this.currentDenomination++;
                this.updateBet();
                this.validateBetButtons();
            }
        },

        decreaseBet: function(){
            if(this.currentDenomination > 0){
                this.currentDenomination--;
                this.updateBet();
                this.validateBetButtons();
            }
        },

        validateBetButtons: function(){
            if(this.currentDenomination == this.denominations.length - 1){
                this.disableBetPlus();
            }else{
                this.enableBetPlus();
            }

            if(this.currentDenomination == 0){
                this.disableBetMinus();
            }else{
                this.enableBetMinus();
            }
        },

        disableSpin: function(){
            this.btnSpin.visible = false;
        },

        enableSpin: function(){
            this.btnSpin.visible = true;
        },

        disableBet: function(){
            this.disableBetPlus();
            this.disableBetMinus();
        },
        enableBet: function(){
            this.validateBetButtons();
        },

        disableBetPlus: function(){
            this.btnBetPlus.visible = false;
        },

        enableBetPlus: function(){
            this.btnBetPlus.visible = true;
        },

        disableBetMinus: function(){
            this.btnBetMinus.visible = false;
        },

        enableBetMinus: function(){
            this.btnBetMinus.visible = true;
        },

        // Event Handlers
        onSpinClick: function(evt){
            this.disableSpin();
            this.disableBet();
            this.stage.emit(slot.view.event.ViewEvents.SPIN_CLICK);
        },

        onBetMinusClick: function(evt){
            this.decreaseBet();
        },

        onBetPlusClick: function(evt){
            this.increaseBet();
        },

        handleResize: function (windowSizeVO) {
            this.setupView(windowSizeVO);
        }
    },

    // STATIC MEMBERS
    {
        NAME: 'Panel'
    }
);
