import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RfbUser } from 'app/shared/model/rfb-user.model';
import { RfbUserService } from './rfb-user.service';
import { RfbUserComponent } from './rfb-user.component';
import { RfbUserDetailComponent } from './rfb-user-detail.component';
import { RfbUserUpdateComponent } from './rfb-user-update.component';
import { RfbUserDeletePopupComponent } from './rfb-user-delete-dialog.component';
import { IRfbUser } from 'app/shared/model/rfb-user.model';

@Injectable({ providedIn: 'root' })
export class RfbUserResolve implements Resolve<IRfbUser> {
    constructor(private service: RfbUserService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((rfbUser: HttpResponse<RfbUser>) => rfbUser.body));
        }
        return of(new RfbUser());
    }
}

export const rfbUserRoute: Routes = [
    {
        path: 'rfb-user',
        component: RfbUserComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RfbUsers'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'rfb-user/:id/view',
        component: RfbUserDetailComponent,
        resolve: {
            rfbUser: RfbUserResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RfbUsers'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'rfb-user/new',
        component: RfbUserUpdateComponent,
        resolve: {
            rfbUser: RfbUserResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RfbUsers'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'rfb-user/:id/edit',
        component: RfbUserUpdateComponent,
        resolve: {
            rfbUser: RfbUserResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RfbUsers'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const rfbUserPopupRoute: Routes = [
    {
        path: 'rfb-user/:id/delete',
        component: RfbUserDeletePopupComponent,
        resolve: {
            rfbUser: RfbUserResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RfbUsers'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
