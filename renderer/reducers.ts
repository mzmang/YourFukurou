import {List} from 'immutable';
import assign = require('object-assign');
import {Action, Kind} from './actions';
import Item from './item/item';
import Tweet from './item/tweet';
import Separator from './item/separator';

const electron = global.require('electron');
const ipc = electron.ipcRenderer;

function sendToMain(ch: ChannelFromRenderer, ...args: any[]) {
    'use strict';
    ipc.send(ch, ...args);
}

export interface State {
    current_items: List<Item>;
    current_message: MessageInfo;
}

const init: State = {
    current_items: List<Item>(),
    current_message: null,
};

function replaceStatus(items: List<Item>, status: Tweet) {
    'use strict';
    return items.map(item => {
        if (item instanceof Tweet) {
            const id = item.getMainStatus().id;
            if (id === status.id) {
                if (item.isRetweet()) {
                    const cloned = item.clone();
                    cloned.json.retweeted_status = status.json;
                    return cloned;
                } else {
                    return status;
                }
            }
        }
        return item;
    }).toList();
}

export default function root(state: State = init, action: Action) {
    'use strict';
    switch (action.type) {
        case Kind.AddTweetToTimeline: {
            const next_state = assign({}, state) as State;
            next_state.current_items = state.current_items.unshift(action.item);
            return next_state;
        }
        case Kind.ShowMessage: {
            const next_state = assign({}, state) as State;
            next_state.current_message = {
                text: action.text,
                kind: action.msg_kind,
            };
            return next_state;
        }
        case Kind.DismissMessage: {
            const next_state = assign({}, state) as State;
            next_state.current_message = null;
            return next_state;
        }
        case Kind.AddSeparator: {
            if (state.current_items.last() instanceof Separator) {
                // Note:
                // Do not add multiple separators continuously
                return state;
            }
            const next_state = assign({}, state) as State;
            next_state.current_items = state.current_items.unshift(action.item);
            return next_state;
        }
        case Kind.SendRetweet: {
            // Note:
            // The retweeted status will be sent on stream
            sendToMain('yf:request-retweet', action.tweet_id);
            return state;
        }
        case Kind.UndoRetweet: {
            sendToMain('yf:undo-retweet', action.tweet_id);
            return state;
        }
        case Kind.RetweetSucceeded: {
            const next_state = assign({}, state) as State;
            next_state.current_items = replaceStatus(state.current_items, action.status.getMainStatus());
            return next_state;
        }
        case Kind.UnretweetSucceeded: {
            const next_state = assign({}, state) as State;
            next_state.current_items = replaceStatus(state.current_items, action.status);
            return next_state;
        }
        default:
            break;
    }
    return state;
}
