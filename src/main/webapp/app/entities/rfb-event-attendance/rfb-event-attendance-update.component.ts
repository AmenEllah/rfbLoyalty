import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IRfbEventAttendance } from 'app/shared/model/rfb-event-attendance.model';
import { RfbEventAttendanceService } from './rfb-event-attendance.service';
import { IRfbEvent } from 'app/shared/model/rfb-event.model';
import { RfbEventService } from 'app/entities/rfb-event';
import { IRfbUser } from 'app/shared/model/rfb-user.model';
import { RfbUserService } from 'app/entities/rfb-user';

@Component({
    selector: 'jhi-rfb-event-attendance-update',
    templateUrl: './rfb-event-attendance-update.component.html'
})
export class RfbEventAttendanceUpdateComponent implements OnInit {
    private _rfbEventAttendance: IRfbEventAttendance;
    isSaving: boolean;

    rfbevents: IRfbEvent[];

    rfbusers: IRfbUser[];
    attendanceDateDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private rfbEventAttendanceService: RfbEventAttendanceService,
        private rfbEventService: RfbEventService,
        private rfbUserService: RfbUserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ rfbEventAttendance }) => {
            this.rfbEventAttendance = rfbEventAttendance;
        });
        this.rfbEventService.query().subscribe(
            (res: HttpResponse<IRfbEvent[]>) => {
                this.rfbevents = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.rfbUserService.query({ filter: 'rfbeventattendance-is-null' }).subscribe(
            (res: HttpResponse<IRfbUser[]>) => {
                if (!this.rfbEventAttendance.rfbUserId) {
                    this.rfbusers = res.body;
                } else {
                    this.rfbUserService.find(this.rfbEventAttendance.rfbUserId).subscribe(
                        (subRes: HttpResponse<IRfbUser>) => {
                            this.rfbusers = [subRes.body].concat(res.body);
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
        if (this.rfbEventAttendance.id !== undefined) {
            this.subscribeToSaveResponse(this.rfbEventAttendanceService.update(this.rfbEventAttendance));
        } else {
            this.subscribeToSaveResponse(this.rfbEventAttendanceService.create(this.rfbEventAttendance));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IRfbEventAttendance>>) {
        result.subscribe((res: HttpResponse<IRfbEventAttendance>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackRfbEventById(index: number, item: IRfbEvent) {
        return item.id;
    }

    trackRfbUserById(index: number, item: IRfbUser) {
        return item.id;
    }
    get rfbEventAttendance() {
        return this._rfbEventAttendance;
    }

    set rfbEventAttendance(rfbEventAttendance: IRfbEventAttendance) {
        this._rfbEventAttendance = rfbEventAttendance;
    }
}
