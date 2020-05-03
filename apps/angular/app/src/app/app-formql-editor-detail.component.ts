import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BroadcastLogic } from 'packages/editor/src/logic/broadcast-logic';

@Component({
    selector: 'app-formql-editor-detail',
    styles: [`.mainDiv { position: absolute; top: 0; left: 0; right: 0;bottom: 0;}`],
    template: `<formql-component-editor *ngIf="component" [component]="component" [data]="data" [mode]="mode"></formql-component-editor>`,
})
export class AppFormQLEditorDetailComponent implements OnInit {

    public type: string;
    public id: string;

    public component = null;
    public data = null;
    public mode = 1;

    private broadcastLogic: BroadcastLogic;

    constructor(private ngZone: NgZone, private route: ActivatedRoute) {
        
        let self = this;
        this.broadcastLogic = new BroadcastLogic('formql_editor_channel','AppFormQLEditorDetailComponent','', function (event: MessageEvent) {
            self.ngZone.run(() => {
                self.handleMessages(event);
            });    
        });

        this.route.url.subscribe(() =>{
            this.handleRouteChange();
        });
        this.handleRouteChange();        
    }
    
    private handleRouteChange() {
        let routeSnap = this.route.snapshot;
        this.type = routeSnap.params["type"];
        this.id = routeSnap.params["id"];
        this.broadcastLogic.postMessage('get', {'type': this.type, 'id': this.id});
    }

    ngOnInit(): void {
    }

    private handleMessages(event: MessageEvent) {
        let self = this;
        
        switch (event.data.operation) {
            case 'get-reply':
            case 'refresh':
                self.component = event.data.message.component;
                self.data = event.data.message.data;
                self.mode = event.data.message.mode;
                break;
        }
    }

}
