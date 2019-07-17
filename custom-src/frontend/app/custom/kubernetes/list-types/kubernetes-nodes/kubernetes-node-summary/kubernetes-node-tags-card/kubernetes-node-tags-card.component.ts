import { Component, OnInit, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppChip } from '../../../../../../shared/components/chips/chips.component';
import { AppState } from '../../../../../../../../store/src/app-state';
import { RouterNav } from '../../../../../../../../store/src/actions/router.actions';
import { KubernetesNodeService } from '../../../../services/kubernetes-node.service';

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
  ) { }

  ngOnInit() {
    this.chipTags$ = this.kubeNodeService.nodeEntity$.pipe(
      map(node => {
        //console.log(JSON.stringify(node))
        return this.getTags(node.metadata[this.mode])}),
    );
  }
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
    //console.log(JSON.stringify(tags))
    const labelEntries = Object.entries(tags);
    return labelEntries.map(t => ({
      value: `${t[0]}:${t[1]}`
    }));
  }
}
