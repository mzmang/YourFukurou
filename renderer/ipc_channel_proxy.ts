const {ipcRenderer: ipc} = global.require('electron');
import {
    addTweetToTimeline,
    addTweetsToTimeline,
    addMentions,
    addUserTweets,
    addRejectedUserIds,
    addFriends,
    removeFriends,
    removeRejectedUserIds,
    addNoRetweetUserIds,
    addSeparator,
    unretweetSucceeded,
    showMessage,
    likeSucceeded,
    unlikeSucceeded,
    statusLiked,
    setCurrentUser,
    updateCurrentUser,
    deleteStatusInTimeline,
} from './actions';
import Store from './store';
import log from './log';
import Tweet, {TwitterUser} from './item/tweet';
import DB from './database/db';
import {Twitter, Options} from 'twit';
import TwitterRestApi from './twitter/rest_api';

interface Listeners {
    [c: string]: Electron.IpcRendererEventListener;
}

export default class IpcChannelProxy {
    private listeners: Listeners;

    constructor() {
        this.listeners = {};
    }

    subscribe(c: ChannelFromMain, cb: Function) {
        const callback: Electron.IpcRendererEventListener =
            (_, ...args) => {
                log.debug('--->', c, ...args);
                cb.apply(this, args);
            };
        ipc.on(c, callback);
        this.listeners[c] = callback;
    }

    start() {
        this.subscribe('yf:auth-tokens', (options: Options) => {
            TwitterRestApi.setupClient(options);
            // TODO:
            // Move bootstrapping to actions or dispatch actions in TwitterRestApi directly?
            return Promise.all([
                TwitterRestApi.verifyCredentials(),
                TwitterRestApi.rejectedIds(),
                TwitterRestApi.noRetweetIds(),
                TwitterRestApi.homeTimeline({
                    include_entities: true,
                    count: 20,  // TODO: fetch 40 tweets on expand_tweet == 'always'
                }),
                TwitterRestApi.mentionTimeline(),
            ])
            .then(([my_account, rejected_ids, no_retweet_ids, tweets, mentions]) => {
                Store.dispatch(setCurrentUser(new TwitterUser(my_account)));

                Store.dispatch(addRejectedUserIds(rejected_ids));
                Store.dispatch(addNoRetweetUserIds(no_retweet_ids));

                Store.dispatch(addTweetsToTimeline(tweets.reverse().map(tw => new Tweet(tw))));
                DB.accounts.storeAccountsInTweets(tweets);
                DB.hashtags.storeHashtagsInTweets(tweets);

                Store.dispatch(addMentions(mentions.map(j => new Tweet(j))));
                DB.accounts.storeAccountsInTweets(mentions);
                DB.hashtags.storeHashtagsInTweets(mentions);

                ipc.send('yf:start-user-stream' as ChannelFromRenderer);
            });
        });

        this.subscribe('yf:tweet', (json: Twitter.Status) => {
            const tw = new Tweet(json);
            Store.dispatch(addTweetToTimeline(tw));
            DB.accounts.storeAccountsInTweet(json);
            DB.hashtags.storeHashtagsInTweet(json);
        });

        this.subscribe('yf:connection-failure', () => {
            Store.dispatch(addSeparator());
        });

        this.subscribe('yf:api-failure', (msg: string) => {
            Store.dispatch(showMessage('API error: ' + msg, 'error'));
        });

        this.subscribe('yf:friends', (ids: number[]) => {
            Store.dispatch(addFriends(ids));
        });

        /*
        this.subscribe('yf:like-success', (json: Twitter.Status) => {
            Store.dispatch(likeSucceeded(new Tweet(json)));
        });

        this.subscribe('yf:unlike-success', (json: Twitter.Status) => {
            Store.dispatch(unlikeSucceeded(new Tweet(json)));
        });
        */

        this.subscribe('yf:my-account-update', (json: Twitter.User) => {
            Store.dispatch(updateCurrentUser(json));
        });

        this.subscribe('yf:delete-status', (status: Twitter.StreamingDeleteStatus) => {
            Store.dispatch(deleteStatusInTimeline(status.id_str));
        });

        this.subscribe('yf:liked-status', (status: Twitter.Status, from_user: Twitter.User) => {
            Store.dispatch(statusLiked(new Tweet(status), new TwitterUser(from_user)));
        });

        /*
        this.subscribe('yf:update-status-success', (json: Twitter.Status) => {
            Store.dispatch(showMessage('Tweeted!', 'info'));
            DB.hashtag_completion_history.storeHashtagsInTweet(json);
            DB.accounts.upCompletionCountOfMentions(json);
        });
        */

        /*
        this.subscribe('yf:mentions', (json: Twitter.Status[]) => {
            Store.dispatch(addMentions(json.map(j => new Tweet(j))));
            DB.accounts.storeAccountsInTweets(json);
            DB.hashtags.storeHashtagsInTweets(json);
            // Note:
            // Do not notify mentions because this IPC message is sent from main
            // process at app starting.  If we were to notify mentions here, so many
            // notifications are sent to a user.
        });
        */

        /*
        this.subscribe('yf:user-timeline', (user_id: number, json: Twitter.Status[]) => {
            window.requestIdleCallback(() => Store.dispatch(addUserTweets(user_id, json.map(j => new Tweet(j)))));
            // Note:
            // This is user specific timeline.  So we need not to store hashtags and accounts
            // in the tweet texts.
        });
        */

        this.subscribe('yf:rejected-ids', (ids: number[]) => {
            Store.dispatch(addRejectedUserIds(ids));
        });

        this.subscribe('yf:unrejected-ids', (ids: number[]) => {
            Store.dispatch(removeRejectedUserIds(ids));
        });

        /*
        this.subscribe('yf:no-retweet-ids', (ids: number[]) => {
            Store.dispatch(addNoRetweetUserIds(ids));
        });
        */

        this.subscribe('yf:follow', (source: Twitter.User, target: Twitter.User) => {
            if (Store.getState().timeline.user.id === source.id) {
                // Note: When I follows someone
                Store.dispatch(addFriends([target.id]));
                Store.dispatch(setCurrentUser(new TwitterUser(source)));
            } else {
                // Note: When Someone follows me
                Store.dispatch(setCurrentUser(new TwitterUser(target)));
            }
        });

        this.subscribe('yf:unfollow', (target: Twitter.User) => {
            Store.dispatch(removeFriends([target.id]));
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
