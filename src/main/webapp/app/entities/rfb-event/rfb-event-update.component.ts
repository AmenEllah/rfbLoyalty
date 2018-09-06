import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IRfbEvent } from 'app/shared/model/rfb-event.model';
import { RfbEventService } from './rfb-event.service';
import { IRfbLocation } from 'app/shared/model/rfb-location.model';
import { RfbLocationService } from 'app/entities/rfb-location';

@Component({
    selector: 'jhi-rfb-event-update',
    templateUrl: './rfb-event-update.component.html'
})
export class RfbEventUpdateComponent implements OnInit {
    private _rfbEvent: IRfbEvent;
    isSaving: boolean;

    rfblocations: IRfbLocation[];
    eventDateDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private rfbEventService: RfbEventService,
        private rfbLocationService: RfbLocationService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ rfbEvent }) => {
            this.rfbEvent = rfbEvent;
        });
        this.rfbLocationService.query().subscribe(
            (res: HttpResponse<IRfbLocation[]>) => {
                this.rfblocations = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.rfbEvent.id !== undefined) {
            this.subscribeToSaveResponse(this.rfbEventService.update(this.rfbEvent));
        } else {
            this.subscribeToSaveResponse(this.rfbEventService.create(this.rfbEvent));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IRfbEvent>>) {
        result.subscribe((res: HttpResponse<IRfbEvent>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackRfbLocationById(index: number, item: IRfbLocation) {
        return item.id;
    }
    get rfbEvent() {
        return this._rfbEvent;
    }

    set rfbEvent(rfbEvent: IRfbEvent) {
        this._rfbEvent = rfbEvent;
    }
}
