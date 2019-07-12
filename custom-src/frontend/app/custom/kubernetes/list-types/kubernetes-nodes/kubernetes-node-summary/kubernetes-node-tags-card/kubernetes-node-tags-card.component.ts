import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { AppChip } from '../../../../../../shared/components/chips/chips.component';
import { AppState } from '../../../../../../../../store/src/app-state';
import { RouterNav } from '../../../../../../../../store/src/actions/router.actions';
import { KubernetesNodeService } from '../../../../services/kubernetes-node.service';
import { map } from 'rxjs/operators';
//import { MatDialog } from '@angular/material';
//import { KubernetesNodeAddLabelComponent } from './kubernetes-node-add-label/kubernetes-node-add-label.component';

@Component({
  selector: 'app-kubernetes-node-tags-card',
  templateUrl: './kubernetes-node-tags-card.component.html',
  styleUrls: ['./kubernetes-node-tags-card.component.scss']
})

export class KubernetesNodeTagsCardComponent implements OnInit {


  @Input()
  mode: string;

  @Input()
  title: string;

  chipTags$: Observable<AppChip[]>;

  constructor(
    public store: Store<AppState>,
    public kubeNodeService: KubernetesNodeService 
    // private  dialog:  MatDialog
  ) { }

  ngOnInit() {
    this.chipTags$ = this.kubeNodeService.nodeEntity$.pipe(
      map(node => this.getTags(node.metadata[this.mode])),
    );
  }

  // public addDialog():void {
  //   const dialogRef = this.dialog.open(KubernetesNodeAddLabelComponent, {
  //     height: '400px',
  //     width: '600px',
  //     data: {labels$ : this.kubeNodeService.nodeEntity$.pipe(
  //       map(node => this.getTags(node.metadata[this.mode])),
  //     ), key: 'test', value: 'test'}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed ' + result);
  //   });
  // }

  public addLabelPage() : void {
    // Add label page path will be like 
    // kubernetes/gUvUTVOTxhd1mYGtl1L8UDOe7TE/nodes/minikube/summary/addlabels
    this.store.dispatch(
      new RouterNav({
        path: [
          'kubernetes',  this.kubeNodeService.kubeGuid, 'nodes', 
          this.kubeNodeService.nodeName, 'summary','newlabels']
    }));
  }

  private getTags(tags: {}) {
    const labelEntries = Object.entries(tags);
    return labelEntries.map(t => ({
      value: `${t[0]}:${t[1]}`
    }));
  }
}
