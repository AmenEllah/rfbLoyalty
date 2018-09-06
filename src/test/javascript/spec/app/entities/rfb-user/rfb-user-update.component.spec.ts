/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { RfbloyaltyTestModule } from '../../../test.module';
import { RfbUserUpdateComponent } from 'app/entities/rfb-user/rfb-user-update.component';
import { RfbUserService } from 'app/entities/rfb-user/rfb-user.service';
import { RfbUser } from 'app/shared/model/rfb-user.model';

describe('Component Tests', () => {
    describe('RfbUser Management Update Component', () => {
        let comp: RfbUserUpdateComponent;
        let fixture: ComponentFixture<RfbUserUpdateComponent>;
        let service: RfbUserService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [RfbloyaltyTestModule],
                declarations: [RfbUserUpdateComponent]
            })
                .overrideTemplate(RfbUserUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(RfbUserUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RfbUserService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new RfbUser(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.rfbUser = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new RfbUser();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.rfbUser = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
