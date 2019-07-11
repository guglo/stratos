import { Component, OnDestroy, OnInit } from '@angular/core';
import { StepOnNextFunction } from '../../../../../../../../shared/components/stepper/step/step.component';
@Component({
    selector: 'kubernetes-node-add-label-step',
    templateUrl: './kubernetes-node-add-label-step.component.html',
    styleUrls: ['./kubernetes-node-add-label-step.component.scss']
  })
  export class KubernetesNodeAddLabelStepComponent implements OnInit, OnDestroy {
    ngOnInit() {}
    ngOnDestroy() {}
    validate = () => { return true }
    submit: StepOnNextFunction = () => {
        console.log('add....')
    }
  }