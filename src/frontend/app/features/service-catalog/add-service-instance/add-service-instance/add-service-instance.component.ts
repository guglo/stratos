import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { AppState } from '../../../../store/app-state';
import { servicesServiceFactoryProvider } from '../../service-catalog.helpers';
import { ServicesService } from '../../services.service';
import { SetCreateServiceInstanceCFDetails } from '../../../../store/actions/create-service-instance.actions';
import { CfOrgSpaceDataService } from '../../../../shared/data-services/cf-org-space-service.service';
import { CreateServiceInstanceHelperService } from '../create-service-instance-helper.service';

@Component({
  selector: 'app-add-service-instance',
  templateUrl: './add-service-instance.component.html',
  styleUrls: ['./add-service-instance.component.scss'],
  providers: [
    servicesServiceFactoryProvider,
    CreateServiceInstanceHelperService,
    TitleCasePipe
  ]
})
export class AddServiceInstanceComponent {
  marketPlaceMode: boolean;
  title$: Observable<string>;
  serviceInstancesUrl: string;
  servicesWallCreateInstance = false;
  stepperText = 'Select a Cloud Foundry instance, organization and space for the service instance.';
  constructor(
    private cSIHelperService: CreateServiceInstanceHelperService,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private cfOrgSpaceService: CfOrgSpaceDataService
  ) {
    const { serviceId, cfId } = activatedRoute.snapshot.params;
    if (!!serviceId && !!cfId) {
      const serviceGuid = serviceId;
      this.serviceInstancesUrl = `/service-catalog/${cfId}/${serviceGuid}/instances`;
      this.title$ = this.cSIHelperService.getServiceName().pipe(
        map(label => `Create Instance: ${label}`)
      );
    } else {
      this.servicesWallCreateInstance = true;
      this.title$ = Observable.of(`Create Service Instance`);
    }
  }

  onNext = () => {
    this.store.dispatch(new SetCreateServiceInstanceCFDetails(
      this.cfOrgSpaceService.cf.select.getValue(),
      this.cfOrgSpaceService.org.select.getValue(),
      this.cfOrgSpaceService.space.select.getValue()
    ));
    return Observable.of({ success: true });
  }

}
