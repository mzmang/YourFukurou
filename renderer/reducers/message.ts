import {Action, Kind} from '../actions';

export type MessageKind = 'info' | 'error';
export interface MessageState {
    text: string;
    kind: MessageKind;
}

export default function message(state: MessageState = null, action: Action) {
    'use strict';
    switch (action.type) {
        case Kind.ShowMessage:
            return {
                text: action.text,
                kind: action.msg_kind,
            };
        case Kind.DismissMessage:
            return null;
        default:
            return state;
    }
}