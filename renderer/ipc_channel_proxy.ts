const {ipcRenderer: ipc} = global.require('electron');
import {
    addTweetToTimeline,
    addSeparator,
    retweetSucceeded,
    unretweetSucceeded,
    showMessage,
} from './actions';
import Store from './store';
import log from './log';
import Tweet from './item/tweet';

interface Listeners {
    [c: string]: Electron.IpcRendererEventListener;
}

export default class IpcChannelProxy {
    private listeners: Listeners;

    constructor() {
        this.listeners = {};
    }

    subscribe(c: ChannelFromMain, cb: Electron.IpcRendererEventListener) {
        ipc.on(c, cb);
        this.listeners[c] = cb;
    }

    start() {
        this.subscribe('yf:tweet', (_: Electron.IpcRendererEvent, json: TweetJson) => {
            log.debug('Received channel yf:tweet', json);
            Store.dispatch(addTweetToTimeline(new Tweet(json)));
        });
        this.subscribe('yf:connection-failure', (_: Electron.IpcRendererEvent) => {
            log.debug('Received channel yf:connection-failure');
            Store.dispatch(addSeparator());
        });
        this.subscribe('yf:api-failure', (_: Electron.IpcRendererEvent, msg: string) => {
            log.debug('Received channel yf:api-failure');
            Store.dispatch(showMessage('API error: ' + msg, 'error'));
        });
        this.subscribe('yf:retweet-success', (_: Electron.IpcRendererEvent, json: TweetJson) => {
            log.debug('Received channel yf:retweet-success', json.id_str);
            if (json.retweeted_status) {
                Store.dispatch(retweetSucceeded(json.retweeted_status.id_str));
            } else {
                log.error('yf:retweet-success: Received status is not an retweet status: ', json);
            }
        });
        this.subscribe('yf:unretweet-success', (_: Electron.IpcRendererEvent, json: TweetJson) => {
            // Note:
            // The JSON is an original retweeted tweet
            log.debug('Received channel yf:unretweet-success', json.id_str);
            Store.dispatch(unretweetSucceeded(json.id_str));
        });
        log.debug('Started to receive messages');
        return this;
    }

    terminate() {
        for (const c in this.listeners) {
            ipc.removeListener(c, this.listeners[c]);
        }
        this.listeners = {};
        log.debug('Terminated receivers');
    }
}
