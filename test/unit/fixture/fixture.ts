global.require = require;
import {readFileSync, lstatSync} from 'fs';
import * as path from 'path';
import {Twitter} from 'twit';
import Tweet, {TwitterUser} from '../../../renderer/item/tweet';

export default class Fixture {
    private cache: {[name: string]: any};

    constructor() {
        this.cache = {};
    }

    getJsonFile(name: string) {
        let dir = __dirname;
        const root = path.parse(dir).root;
        while (dir !== root) {
            try {
                const p = path.join(dir, 'fixture', `${name}.json`);
                lstatSync(p);
                return p;
            } catch (e) {
                // Skip
            }
            dir = path.dirname(dir);
        }
        throw new Error(`JSON file for ${name} was not found!`);
    }

    readJson<T>(name: string): T {
        const cache = this.cache[name];
        if (cache) {
            return cache as T;
        }
        const file = this.getJsonFile(name);
        const parsed = JSON.parse(readFileSync(file, 'utf8'));
        this.cache[name] = parsed;
        return parsed as T;
    }

    tweet() {
        return new Tweet(this.readJson<Twitter.Status>('tweet'));
    }

    tweet_other() {
        return new Tweet(this.readJson<Twitter.Status>('tweet_other'));
    }

    reply_myself() {
        return new Tweet(this.readJson<Twitter.Status>('reply_myself'));
    }

    reply_from_other_to_others() {
        return new Tweet(this.readJson<Twitter.Status>('reply_from_other_to_others'));
    }

    retweet() {
        return new Tweet(this.readJson<Twitter.Status>('retweet'));
    }

    retweet_other() {
        return new Tweet(this.readJson<Twitter.Status>('retweet_other'));
    }

    retweeted() {
        return new Tweet(this.readJson<Twitter.Status>('retweeted'));
    }

    retweeted2() {
        return new Tweet(this.readJson<Twitter.Status>('retweeted2'));
    }

    media() {
        return new Tweet(this.readJson<Twitter.Status>('media'));
    }

    retweet_media() {
        return new Tweet(this.readJson<Twitter.Status>('retweet_media'));
    }

    quote() {
        return new Tweet(this.readJson<Twitter.Status>('quote_media'));
    }

    quote_media() {
        return new Tweet(this.readJson<Twitter.Status>('quote_media'));
    }

    in_reply_to() {
        return new Tweet(this.readJson<Twitter.Status>('in_reply_to'));
    }

    in_reply_to_from_other() {
        return new Tweet(this.readJson<Twitter.Status>('in_reply_to_from_other'));
    }

    user() {
        return new TwitterUser(this.readJson<Twitter.User>('user'));
    }

    other_user() {
        return new TwitterUser(this.readJson<Twitter.User>('other_user'));
    }

    other_user2() {
        return new TwitterUser(this.readJson<Twitter.User>('other_user2'));
    }
}
