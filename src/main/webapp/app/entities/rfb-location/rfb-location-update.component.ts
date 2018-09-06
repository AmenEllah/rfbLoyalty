import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IRfbLocation } from 'app/shared/model/rfb-location.model';
import { RfbLocationService } from './rfb-location.service';

@Component({
    selector: 'jhi-rfb-location-update',
    templateUrl: './rfb-location-update.component.html'
})
export class RfbLocationUpdateComponent implements OnInit {
    private _rfbLocation: IRfbLocation;
    isSaving: boolean;

    constructor(private rfbLocationService: RfbLocationService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ rfbLocation }) => {
            this.rfbLocation = rfbLocation;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.rfbLocation.id !== undefined) {
            this.subscribeToSaveResponse(this.rfbLocationService.update(this.rfbLocation));
        } else {
            this.subscribeToSaveResponse(this.rfbLocationService.create(this.rfbLocation));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IRfbLocation>>) {
        result.subscribe((res: HttpResponse<IRfbLocation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get rfbLocation() {
        return this._rfbLocation;
    }

    set rfbLocation(rfbLocation: IRfbLocation) {
        this._rfbLocation = rfbLocation;
    }
}
