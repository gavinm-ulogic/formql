import { UUID } from 'angular2-uuid';

export class BroadcastSubscriber {
    constructor(public sourceId: string, sourceName: string , public key: string) {}
}

export class BroadcastMessage {
    constructor(public operation: string, public sourceId: string, public sourceName: string, public key: string, public message: any) {}
}

export class BroadcastLogic {
    private channelName: string;
    private id: string;
    private name: string;
    private key: string;
    private callback: Function;
    private broadcastChannel: BroadcastChannel;
    private subscribers: BroadcastSubscriber[] = [];

    constructor(channel: string, name: string, key: string, callback: Function) {
        this.channelName = channel;
        this.id = UUID.UUID();
        this.name = name;
        this.key = key;
        this.callback = callback;
        this.broadcastChannel = new BroadcastChannel(channel);
        let self = this;
        this.broadcastChannel.onmessage = function(event) {
            self.handleMessage(event);
        }
        this.ping();
    }

    private handleMessage(event: MessageEvent) {
        let message: BroadcastMessage = event.data;
        if (message.sourceId === this.id) return;
        switch (message.operation) {
            case 'ping-reply':
                if (!this.subscribers.find(x => x.sourceId === message.sourceId)) {
                    this.subscribers.push(new BroadcastSubscriber(message.sourceId, message.sourceName, message.key));
                }
                break;
            case 'ping':
                this.broadcastChannel.postMessage(new BroadcastMessage('ping-reply', this.id, this.name, this.key, null));
                break;
            default:
                if (event.data) this.callback(event);
                break;
        }
    }

    private ping() {
        this.broadcastChannel.postMessage(new BroadcastMessage('ping', this.id, this.name, this.key, null));
    }

    public postMessage(operation: string, message: any) {
        this.broadcastChannel.postMessage(new BroadcastMessage(operation, this.id, this.name, this.key, message));
    }
}