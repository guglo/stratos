import { Component, OnDestroy, OnInit } from '@angular/core';
import { StepOnNextFunction } from '../../../../../../../../shared/components/stepper/step/step.component';
@Component({
    selector: 'kubernetes-node-add-label-step',
    templateUrl: './kubernetes-node-add-label-step.component.html',
    styleUrls: ['./kubernetes-node-add-label-step.component.scss']
  })
  export class KubernetesNodeAddLabelStepComponent implements OnInit, OnDestroy {
    
    addLabelMode: string; //selected either exsitingLabels or newLabels
    ngOnInit() {
      this.addLabelMode = "exsitingLabels";
    }
    ngOnDestroy() {}
    validate = () => { return true }
    submit = () => {
        console.log('add....')
    }
  }