import {EditorState} from 'draft-js';
import {Twitter} from 'twit';
import Item from '../item/item';
import Tweet, {TwitterUser} from '../item/tweet';
import {AutoCompleteLabel} from '../components/editor/auto_complete_decorator';
import {TimelineKind} from '../states/timeline';
import {MessageKind} from '../reducers/message';
import {SuggestionItem} from '../components/editor/suggestions';
import {Dispatch} from '../store';
import State from '../states/root';

type ActionType = {
    readonly type: 'AddSeparator';
} | {
    readonly type: 'ChangeCurrentTimeline';
    readonly timeline: TimelineKind;
} | {
    readonly type: 'ShowMessage';
    readonly text: string;
    readonly msg_kind: MessageKind;
} | {
    readonly type: 'DismissMessage';
} | {
    readonly type: 'NotImplementedYet';
} | {
    readonly type: 'AddTweetToTimeline';
    readonly status: Tweet;
} | {
    readonly type: 'AddTweetsToTimeline';
    readonly statuses: Tweet[];
} | {
    readonly type: 'SetCurrentUser';
    readonly user: TwitterUser;
} | {
    readonly type: 'UpdateCurrentUser';
    readonly user_json: Twitter.User;
} | {
    readonly type: 'DeleteStatusInTimeline';
    readonly tweet_id: string;
} | {
    readonly type: 'AddMentions';
    readonly mentions: Tweet[];
} | {
    readonly type: 'AddRejectedUserIds';
    readonly ids: number[];
} | {
    readonly type: 'RemoveRejectedUserIds';
    readonly ids: number[];
} | {
    readonly type: 'AddNoRetweetUserIds';
    readonly ids: number[];
} | {
    readonly type: 'CompleteMissingStatuses';
    readonly timeline: TimelineKind;
    readonly index: number;
    readonly items: Item[];
} | {
    readonly type: 'RetweetSucceeded';
    readonly status: Tweet;
} | {
    readonly type: 'UnretweetSucceeded';
    readonly status: Tweet;
} | {
    readonly type: 'LikeSucceeded';
    readonly status: Tweet;
} | {
    readonly type: 'UnlikeSucceeded';
    readonly status: Tweet;
} | {
    readonly type: 'StatusLiked';
    readonly user: TwitterUser;
    readonly status: Tweet;
} | {
    readonly type: 'ChangeEditorState';
    readonly editor: EditorState;
} | {
    readonly type: 'OpenEditor';
    readonly text?: string;
} | {
    readonly type: 'OpenEditorForReply';
    readonly status: Tweet;
    readonly user: TwitterUser;
    readonly text?: string;
} | {
    readonly type: 'CloseEditor';
} | {
    readonly type: 'SelectAutoCompleteSuggestion';
    readonly text: string;
    readonly query: string;
} | {
    readonly type: 'UpdateAutoCompletion';
    readonly left: number;
    readonly top: number;
    readonly query: string;
    readonly suggestions: SuggestionItem[];
    readonly completion_label: AutoCompleteLabel;
} | {
    readonly type: 'StopAutoCompletion';
} | {
    readonly type: 'DownAutoCompletionFocus';
} | {
    readonly type: 'UpAutoCompletionFocus';
} | {
    readonly type: 'OpenPicturePreview';
    readonly media_urls: string[];
    readonly index?: number;
} | {
    readonly type: 'CloseTweetMedia';
} | {
    readonly type: 'MoveToNthPicturePreview';
    readonly index: number;
} | {
    readonly type: 'FocusOnItem';
    readonly index: number;
} | {
    readonly type: 'UnfocusItem';
} | {
    readonly type: 'FocusNextItem';
} | {
    readonly type: 'FocusPrevItem';
} | {
    readonly type: 'FocusTopItem';
} | {
    readonly type: 'FocusBottomItem';
} | {
    readonly type: 'AddFriends';
    readonly ids: number[];
} | {
    readonly type: 'RemoveFriends';
    readonly ids: number[];
} | {
    readonly type: 'ResetFriends';
    readonly ids: number[];
} | {
    readonly type: 'OpenUserTimeline';
    readonly user: TwitterUser;
} | {
    readonly type: 'OpenConversationTimeline';
    readonly statuses: Tweet[];
} | {
    readonly type: 'CloseSlaveTimeline';
} | {
    readonly type: 'BackSlaveTimeline';
} | {
    readonly type: 'AddUserTweets';
    readonly user_id: number;
    readonly statuses: Tweet[];
} | {
    readonly type: 'AppendPastItems';
    readonly user_id: number;
    readonly items: Item[];
} | {
    readonly type: 'BlurSlaveTimeline';
} | {
    readonly type: 'FocusSlaveNext';
} | {
    readonly type: 'FocusSlavePrev';
} | {
    readonly type: 'FocusSlaveTop';
} | {
    readonly type: 'FocusSlaveBottom';
} | {
    readonly type: 'FocusSlaveOn';
    readonly index: number;
};

export default ActionType;

export type ThunkAction = (dispatch: Dispatch, getState: () => State) => void;
