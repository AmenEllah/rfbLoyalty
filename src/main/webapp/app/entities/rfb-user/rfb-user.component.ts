import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IRfbUser } from 'app/shared/model/rfb-user.model';
import { Principal } from 'app/core';
import { RfbUserService } from './rfb-user.service';

@Component({
    selector: 'jhi-rfb-user',
    templateUrl: './rfb-user.component.html'
})
export class RfbUserComponent implements OnInit, OnDestroy {
    rfbUsers: IRfbUser[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private rfbUserService: RfbUserService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.rfbUserService.query().subscribe(
            (res: HttpResponse<IRfbUser[]>) => {
                this.rfbUsers = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInRfbUsers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IRfbUser) {
        return item.id;
    }

    registerChangeInRfbUsers() {
        this.eventSubscriber = this.eventManager.subscribe('rfbUserListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
