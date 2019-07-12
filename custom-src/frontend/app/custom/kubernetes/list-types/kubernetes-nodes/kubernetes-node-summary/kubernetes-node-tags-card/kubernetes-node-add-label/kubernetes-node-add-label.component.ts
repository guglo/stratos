//import { Component, Input, OnInit, Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { map } from 'rxjs/operators';
//import { MAT_DIALOG_DATA, MatDialogRef } from  '@angular/material/dialog';
//import { Observable } from 'rxjs';
//import { AppChip } from '../../../../../../../shared/components/chips/chips.component';
import { KubernetesNodeService } from '../../../../../services/kubernetes-node.service';

// export interface LabelData {
//   key: string;
//   value: string;
//   labels$: Observable<AppChip[]>;
// }

@Component({
  selector: 'app-kubernetes-node-add-label',
  templateUrl: './kubernetes-node-add-label.component.html',
  styleUrls: ['./kubernetes-node-add-label.component.scss']
})

// export class KubernetesNodeAddLabelComponent implements OnInit {

//   constructor(
//     public kubeNodeService: KubernetesNodeService,
//     private  dialogRef:  MatDialogRef<KubernetesNodeAddLabelComponent>, 
//     @Inject(MAT_DIALOG_DATA) public  data: LabelData) {
//      }

//   ngOnInit() {
//   }

//   public add() {
//     console.log('added label key = ' + this.data.key);
//     console.log('added label value = ' + this.data.value);
//     this.data.key = '';
//     this.data.value = '';
//     this.kubeNodeService.add('labels');
//   }

//   public close() {
//     console.log('closed label');
//     this.dialogRef.close();
//   }
// }

//routing page to have steps
export class KubernetesNodeAddLabelComponent implements OnInit{
  summaryUrl: string;
  constructor(
    public kubeNodeService: KubernetesNodeService, 
    private activatedRoute: ActivatedRoute,) {}

  ngOnInit() {
    this.getSummaryUrl();
  }

  nodeName: string;

  getSummaryUrl = () => {
    const kGuid = this.activatedRoute.snapshot.params.endpointId;
    //this.kubeNodeService.kubeGuid;
    this.nodeName = this.activatedRoute.snapshot.params.nodeName; 
    //this.kubeNodeService.nodeName;
    this.summaryUrl =`/kubernetes/${kGuid}/nodes/${this.nodeName}/summary`;
  }
}