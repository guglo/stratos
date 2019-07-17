import { Component, OnDestroy, OnInit, Input } from '@angular/core';
//import { MatSelectionListChange } from  '@angular/material/list';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material';
import { DialogConfirmComponent } from '../../../../../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { KubernetesNodeService } from '../../../../../../services/kubernetes-node.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
    selector: 'kubernetes-node-add-label-step',
    templateUrl: './kubernetes-node-add-label-step.component.html',
    styleUrls: ['./kubernetes-node-add-label-step.component.scss']
  })
  export class KubernetesNodeAddLabelStepComponent implements OnInit, OnDestroy {
    
    EXISTING_LABEL_TAB = 0;
    NEW_LABEL_TAB = 1;

    @Input()
    nodeName: string;

    addLabelMode = this.EXISTING_LABEL_TAB; //selected either EXISTING_LABEL or NEW_LABEL
    labelKey: string;
    labelValue: string;
    existingLabels: string[] = ['key1:value1', 'key2:value2', 'key3:value3'];
    selectedLabels: string[];
    disableAddButton = true;

    constructor(
      public kubeNodeService: KubernetesNodeService,
      private  confirmDialog:  MatDialog) {
    }
    ngOnInit() {}
    ngOnDestroy() {}

    onLabelKeyChange = () => {
      //Check if need to disable Add button
      this.disableAddButton = this.disableAdd();
    }

    onLabelValueChange = () => {
      //Check if need to disable Add button
      this.disableAddButton = this.disableAdd();
    }

    onTabChange = (event) => {
      this.addLabelMode = event;
      //Check if need to disable Add button
      this.disableAddButton = this.disableAdd();
    }

    onLabelSelectionChange = (event) => {
      console.log(JSON.stringify(this.selectedLabels))
      //Check if need to disable Add button
      this.disableAddButton = this.disableAdd();
    }

    disableAdd = () => {
      if(this.addLabelMode === this.EXISTING_LABEL_TAB) {
        return !this.selectedLabels || this.selectedLabels.length < 1
      }
      else {
        return this.labelValueControl.hasError('required') ||
          this.labelKeyControl.hasError('required');
      }
    }

    addLabelAction = () => {
      if(this.addLabelMode === this.EXISTING_LABEL_TAB) {
        console.log(JSON.stringify(this.selectedLabels))
      }
      else {
        let labelToAdd = {};
        labelToAdd[this.labelKey] = this.labelValue;
        this.kubeNodeService.addLabel(labelToAdd);
      }
    }

    addConfirmDialog():void {
      let lbls = "";
      if(this.addLabelMode === this.EXISTING_LABEL_TAB) {
        lbls = this.selectedLabels.join(',');
      }
      else {
        lbls = this.labelKey + ":" + this.labelValue;
      }
      let msgs = 
        `Are you sure to add labels "${lbls}" to node "${this.nodeName}"? \n\n click Yes to continue...\n\n`
      const dialogRef = this.confirmDialog.open(DialogConfirmComponent, {
        height: '300px',
        width: '600px',
        data: {
          title: "Add Label Confirm", message: msgs, 
          confirmLabel: "Yes", action: this.addLabelAction}
      });

      dialogRef.afterClosed().subscribe(result => {
        //console.log('The confirm was closed ');
      });
    }

    labelKeyControl = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    labelValueControl = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
  
    matcher = new MyErrorStateMatcher();
  }