import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BroadcastLogic } from 'packages/editor/src/logic/broadcast-logic';

@Component({
    selector: 'app-formql-editor-detail',
    styles: [`.mainDiv { position: absolute; top: 0; left: 0; right: 0;bottom: 0;}`],
    template: `<formql-component-editor *ngIf="component" [component]="component" [data]="data" [mode]="mode"></formql-component-editor>`,
})
export class AppFormQLEditorDetailComponent implements OnInit {

    public testText = '';
    public component = null;
    public data = null;
    public mode = 1;

    private broadcastLogic: BroadcastLogic;

    constructor(private ngZone: NgZone, private route: ActivatedRoute) {
        let self = this;
        this.broadcastLogic = new BroadcastLogic('formql_editor_channel','AppFormQLEditorDetailComponent','1111', function (event: MessageEvent) {
            self.ngZone.run(() => {
                self.handleMessages(event);
            });    
        });        
    }    

    ngOnInit(): void {
    }

    private handleMessages(event: MessageEvent) {
        let self = this;
        if (event.data && event.data.operation === 'show-detail') {
            self.component = event.data.message.component;
            self.data = event.data.message.data;
            self.mode = event.data.message.mode;
        }
    }

}
