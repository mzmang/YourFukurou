import {EditorState} from 'draft-js';
import Tweet, {TwitterUser} from './item/tweet';
import Item from './item/item';
import Separator from './item/separator';
import {AutoCompleteLabel} from './components/editor/auto_complete_decorator';

export enum Kind {
    ShowMessage,
    DismissMessage,
    AddSeparator,

    AddTweetToTimeline,
    SetCurrentUser,
    DeleteStatus,

    SendRetweet,
    UndoRetweet,
    RetweetSucceeded,
    UnretweetSucceeded,

    CreateLike,
    DestroyLike,
    LikeSucceeded,
    UnlikeSucceeded,

    ChangeEditorState,
    OpenEditor,
    CloseEditor,
    ToggleEditor,

    UpdateStatus,

    SelectAutoCompleteSuggestion,
    UpdateAutoCompletion,
    StopAutoCompletion,
    DownAutoCompletionFocus,
    UpAutoCompletionFocus,
}

export interface Action {
    type: Kind;
    item?: Item;
    text?: string;
    msg_kind?: MessageKind;
    tweet_id?: string;
    status?: Tweet;
    user?: TwitterUser;
    editor?: EditorState;
    in_reply_to_id?: string;
    query?: string;
    left?: number;
    top?: number;
    completion_label?: AutoCompleteLabel;
}

export function addTweetToTimeline(item: Tweet) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.AddTweetToTimeline,
            item,
        }));
    };
}

export function showMessage(text: string, msg_kind: MessageKind) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.ShowMessage,
            text,
            msg_kind,
        }));
    };
}

export function dismissMessage() {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.DismissMessage,
        }));
    };
}

export function addSeparator() {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.AddSeparator,
            item: new Separator(),
        }));
    };
}

export function sendRetweet(tweet_id: string) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.SendRetweet,
            tweet_id,
        }));
    };
}

export function undoRetweet(tweet_id: string) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.UndoRetweet,
            tweet_id,
        }));
    };
}

export function retweetSucceeded(status: Tweet) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.RetweetSucceeded,
            status,
        }));
    };
}

export function unretweetSucceeded(status: Tweet) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.UnretweetSucceeded,
            status,
        }));
    };
}

export function createLike(tweet_id: string) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.CreateLike,
            tweet_id,
        }));
    };
}

export function destroyLike(tweet_id: string) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.DestroyLike,
            tweet_id,
        }));
    };
}

export function likeSucceeded(status: Tweet) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.LikeSucceeded,
            status,
        }));
    };
}

export function unlikeSucceeded(status: Tweet) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.UnlikeSucceeded,
            status,
        }));
    };
}

export function setCurrentUser(user: TwitterUser) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.SetCurrentUser,
            user,
        }));
    };
}

export function deleteStatus(tweet_id: string) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.DeleteStatus,
            tweet_id,
        }));
    };
}

export function changeEditorState(editor: EditorState) {
    'use strict';
    return {
        type: Kind.ChangeEditorState,
        editor,
    };
}

export function openEditor(in_reply_to: Tweet = null) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.OpenEditor,
            status: in_reply_to,
        }));
    };
}

export function closeEditor() {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.CloseEditor,
        }));
    };
}

export function toggleEditor(in_reply_to: Tweet = null) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.ToggleEditor,
            status: in_reply_to,
        }));
    };
}

export function updateStatus(text: string, in_reply_to_id?: string) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.UpdateStatus,
            text,
            in_reply_to_id,
        }));
    };
}

export function selectAutoCompleteSuggestion(text: string, query: string) {
    'use strict';
    return {
        type: Kind.SelectAutoCompleteSuggestion,
        text,
        query,
    };
}

export function updateAutoCompletion(left: number, top: number, query: string, completion_label: AutoCompleteLabel) {
    'use strict';
    return (dispatch: Redux.Dispatch) => {
        setImmediate(() => dispatch({
            type: Kind.UpdateAutoCompletion,
            left,
            top,
            query,
            completion_label,
        }));
    };
}

export function stopAutoCompletion() {
    'use strict';
    return {
        type: Kind.StopAutoCompletion,
    };
}

export function downAutoCompletionFocus() {
    'use strict';
    return {
        type: Kind.DownAutoCompletionFocus,
    };
}

export function upAutoCompletionFocus() {
    'use strict';
    return {
        type: Kind.UpAutoCompletionFocus,
    };
}
