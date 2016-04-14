import {BrowserWindow} from 'electron';

export default class IpcSender {
    constructor(
        public sender: Electron.WebContents = BrowserWindow.getFocusedWindow().webContents
    ) {}

    send(channel: Channel, ...args: any[]) {
        log.debug('Send to channel: ' + channel);
        this.sender.send(channel, ...args);
    }
}
