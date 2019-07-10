import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AppChip } from '../../../../../../shared/components/chips/chips.component';
import { KubernetesNodeService } from '../../../../services/kubernetes-node.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { KubernetesNodeAddLabelComponent } from './kubernetes-node-add-label/kubernetes-node-add-label.component';

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
    public kubeNodeService: KubernetesNodeService,
    private  dialog:  MatDialog
  ) { }

  ngOnInit() {
    this.chipTags$ = this.kubeNodeService.nodeEntity$.pipe(
      map(node => this.getTags(node.metadata[this.mode])),
    );
  }

  public addDialog():void {
    const dialogRef = this.dialog.open(KubernetesNodeAddLabelComponent, {
      height: '400px',
      width: '600px',
      data: {labels$ : this.kubeNodeService.nodeEntity$.pipe(
        map(node => this.getTags(node.metadata[this.mode])),
      ), key: 'test', value: 'test'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed ' + result);
    });
  }

  private getTags(tags: {}) {
    const labelEntries = Object.entries(tags);
    return labelEntries.map(t => ({
      value: `${t[0]}:${t[1]}`
    }));
  }
}
