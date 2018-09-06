import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IRfbUser } from 'app/shared/model/rfb-user.model';
import { RfbUserService } from './rfb-user.service';
import { IRfbLocation } from 'app/shared/model/rfb-location.model';
import { RfbLocationService } from 'app/entities/rfb-location';

@Component({
    selector: 'jhi-rfb-user-update',
    templateUrl: './rfb-user-update.component.html'
})
export class RfbUserUpdateComponent implements OnInit {
    private _rfbUser: IRfbUser;
    isSaving: boolean;

    homelocations: IRfbLocation[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private rfbUserService: RfbUserService,
        private rfbLocationService: RfbLocationService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ rfbUser }) => {
            this.rfbUser = rfbUser;
        });
        this.rfbLocationService.query({ filter: 'rfbuser-is-null' }).subscribe(
            (res: HttpResponse<IRfbLocation[]>) => {
                if (!this.rfbUser.homeLocationId) {
                    this.homelocations = res.body;
                } else {
                    this.rfbLocationService.find(this.rfbUser.homeLocationId).subscribe(
                        (subRes: HttpResponse<IRfbLocation>) => {
                            this.homelocations = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.rfbUser.id !== undefined) {
            this.subscribeToSaveResponse(this.rfbUserService.update(this.rfbUser));
        } else {
            this.subscribeToSaveResponse(this.rfbUserService.create(this.rfbUser));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IRfbUser>>) {
        result.subscribe((res: HttpResponse<IRfbUser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
    get rfbUser() {
        return this._rfbUser;
    }

    set rfbUser(rfbUser: IRfbUser) {
        this._rfbUser = rfbUser;
    }
}
