import * as React from 'react';
import Tooltip = require('rc-tooltip');
import {List} from 'immutable';
import Icon from '../icon';
import {TwitterUser} from '../../item/tweet';
import TwitterProfile from './profile';

interface TweetIconProps extends React.Props<any> {
    readonly user: TwitterUser;
    readonly friends?: List<number>;
}

// TODO:
// Calculate the placement from the position of icon
const PopupIcon = (props: TweetIconProps) => (
    <Tooltip
        placement="bottomRight"
        overlay={
            <TwitterProfile
                user={props.user}
                friends={props.friends}
            />
        }
    >
        <div className="tweet__icon">
            <Icon
                size={48}
                user={props.user}
                border="1px solid #d0d0d0"
            />
        </div>
    </Tooltip>
);
export default PopupIcon;
