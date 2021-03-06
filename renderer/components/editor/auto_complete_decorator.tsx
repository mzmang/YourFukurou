import * as React from 'react';
import {connect} from 'react-redux';
import {ContentBlock} from 'draft-js';
import {updateAutoCompletion, stopAutoCompletion} from '../../actions/editor_completion';
import {Dispatch} from '../../store';

export type AutoCompleteLabel = 'EMOJI' | 'SCREENNAME' | 'HASHTAG';

function createAutoCompleteStrategy(re: RegExp) {
    return function autoCompleteStrategy(contentBlock: ContentBlock, callback: (s: number, e: number) => void) {
        const text = contentBlock.getText();
        while (true) {
            const match = re.exec(text);
            if (match === null) {
                return;
            }
            const start = match.index;
            callback(start, start + match[0].length);
        }
    };
}

export interface AutoCompleteProps extends React.Props<any> {
    readonly decoratedText: string;
    readonly dir: string;
    readonly entityKey: string;
    readonly offsetKey: string;
    readonly dispatch?: Dispatch;
}

function createAutoCompleteComponent(label: AutoCompleteLabel) {
    class AutoComplete extends React.Component<AutoCompleteProps, {}> {
        node: HTMLElement;
        label: AutoCompleteLabel;

        onNodeRef = (ref: HTMLElement) => {
            this.node = ref;
        }

        constructor(props: AutoCompleteProps) {
            super(props);
            this.label = label;
        }

        updateComplationState() {
            const rect = this.node.getBoundingClientRect();
            this.props.dispatch!(
                updateAutoCompletion(rect.left, rect.bottom + 1, this.props.decoratedText, this.label)
            );
        }

        componentDidUpdate() {
            this.updateComplationState();
        }

        componentDidMount() {
            this.updateComplationState();
        }

        componentWillUnmount() {
            this.props.dispatch!(stopAutoCompletion());
        }

        render() {
            return <span
                className={'tweet-form__decorated-' + label}
                ref={this.onNodeRef}
            >{this.props.children}</span>;
        }
    }

    return connect()(AutoComplete);
}

export default function autoCompleteFactory(re: RegExp, label: AutoCompleteLabel) {
    return {
        strategy: createAutoCompleteStrategy(re),
        component: createAutoCompleteComponent(label),
    };
}
