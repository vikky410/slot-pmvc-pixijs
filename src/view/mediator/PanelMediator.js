/**
 * Slot game demo - Pure MVC, Pixi.js v4
 * @author      Murali Saripalli
 * @desc
 * @class       PanelMediator
 */
puremvc.define(
    {
        name: 'slot.view.mediator.PanelMediator',
        parent: puremvc.Mediator
    },

    // INSTANCE MEMBERS
    {
        // References
        windowSizeProxy: null,
        configProxy: null,
        serverProxy: null,

        // Notifications this mediator is interested in 
        listNotificationInterests: function () {
            return [
                slot.AppConstants.WINDOW_RESIZED,
                slot.AppConstants.ASSETS_LOADED,
                slot.AppConstants.SPIN_END
            ];
        },

        onRegister: function () {
            this.setViewComponent(new slot.view.component.Panel());
            this.viewComponent.stage.on(
                slot.view.event.ViewEvents.SPIN_CLICK,
                this.onSpinClick.bind(this)
            );

            this.windowSizeProxy = this.facade.retrieveProxy(slot.model.proxy.WindowSizeProxy.NAME);
            this.configProxy = this.facade.retrieveProxy(slot.model.proxy.ConfigProxy.NAME);
            this.serverProxy = this.facade.retrieveProxy(slot.model.proxy.ServerProxy.NAME);
        },

        onSpinClick: function(){
            this.sendNotification(slot.AppConstants.SPIN);
        },

        // Handle notifications from other PureMVC actors
        handleNotification: function (note) {
            switch ( note.getName() ) {
                case slot.AppConstants.WINDOW_RESIZED:
                    this.viewComponent.handleResize(note.getBody());
                    break;
                case slot.AppConstants.ASSETS_LOADED:
                    this.viewComponent.init(
                        {
                            resources: note.getBody(),
                            gameConfigVO: this.configProxy.gameConfigVO,
                            uiConfigVO: this.configProxy.uiConfigVO,
                            windowSizeVO: this.windowSizeProxy.windowSizeVO
                        }
                    );
                    this.viewComponent.updateBalance(this.serverProxy.resultVO.balance);
                    break;
                case slot.AppConstants.SPIN_END:
                    var resultVO = note.getBody();
                    this.viewComponent.enableBet();
                    this.viewComponent.enableSpin();
                    this.viewComponent.updateBalance(this.serverProxy.resultVO.balance);
                    this.viewComponent.updateWin(this.serverProxy.resultVO.totalWin);
                    break;
            }
        }
    },

    // STATIC MEMBERS
    {
        NAME: 'PanelMediator'
    }
);