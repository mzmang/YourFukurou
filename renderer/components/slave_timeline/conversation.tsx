import * as React from 'react';
import {List} from 'immutable';
import IndexAutoScroll from './index_auto_scroll';
import {ConversationTimeline} from '../../states/slave_timeline';
import Tweet from '../tweet/index';
import {TwitterUser} from '../../item/tweet';

interface ConversationSlaveProps extends React.Props<any> {
    timeline: ConversationTimeline;
    owner: TwitterUser;
    friends: List<number>;
}

function renderTweets(props: ConversationSlaveProps) {
    const {timeline, owner, friends} = props;
    const focused_idx = timeline.focus_index;
    return timeline.items.map((status, idx) => (
        <Tweet
            status={status}
            owner={owner}
            friends={friends}
            focused={focused_idx === idx}
            itemIndex={idx}
            inSlaveTimeline
            key={idx}
        />
    ));
}

const ConversationSlave: React.StatelessComponent<ConversationSlaveProps> = props => (
    <IndexAutoScroll
        className="conversation-timeline__tweets"
        index={props.timeline.focus_index}
    >
        {renderTweets(props)}
    </IndexAutoScroll>
);
export default ConversationSlave;
