import {combineReducers} from 'redux';
import timeline from './timeline';
import editor from './editor';
import editorCompletion from './editor_completion';
import remoteActions from './remote_actions';
import message from './message';
import tweetMedia from './tweet_media';

const root = combineReducers({
    timeline,
    editor,
    editorCompletion,
    message,
    tweetMedia,
    remoteActions,
});
export default root;
