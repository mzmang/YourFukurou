// Note:
// Configuration is not a state, but a contstant because it's fixed at app starting.
// So an application configuration is not managed in Redux's state.
//
// Note:
// remote.getGlobal() doesn't cache remote object.  This class simply provides configuration
// cache and normalize some values (e.g. 'notification', 'mute', ...)
//
// Note:
// Should we validate configuration and show an alert if invalid configuration is found?
export class CachedConfig {
    private remote_config_memo: Config;
    private notification_memo: NotificationConfig;
    private mute_memo: MuteConfig;

    constructor() {
        this.remote_config_memo = null;
        this.notification_memo = null;
        this.mute_memo = null;
    }

    get remote_config() {
        if (this.remote_config_memo === null) {
            this.remote_config_memo = global.require('electron').remote.getGlobal('config');
        }
        return this.remote_config_memo;
    }

    get notification() {
        if (this.notification_memo === null) {
            const n = this.remote_config.notification;
            if (typeof n === 'boolean') {
                this.notification_memo = {
                    reply: n,
                    retweet: n,
                    quoted: n,
                };
            } else {
                this.notification_memo = {
                    reply: !!n.reply,
                    retweet: !!n.retweet,
                    quoted: !!n.quoted,
                };
            }
        }
        return this.notification_memo;
    }

    get mute() {
        if (this.mute_memo === null) {
            const m = this.remote_config.mute;
            if (typeof m === 'boolean') {
                this.mute_memo = {
                    home: m,
                    mention: m,
                };
            } else {
                this.mute_memo = {
                    home: !!m.home,
                    mention: !!m.mention,
                };
            }
        }
        return this.mute_memo;
    }
}

export default new CachedConfig();
