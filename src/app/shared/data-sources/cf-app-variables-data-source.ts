import { getPaginationKey } from './../../store/actions/app-metadata.actions';
import { CfListDataSource } from './list-data-source-cf';
import { DataSource } from '@angular/cdk/table';
import { Store, Action } from '@ngrx/store';
import { AppState } from '../../store/app-state';
import { MatPaginator, MatSort, Sort, PageEvent, MatSortable } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { EventEmitter, PACKAGE_ROOT_URL } from '@angular/core';
import { LocalListDataSource } from './list-data-source-local';
import { ApplicationService } from '../../features/applications/application.service';
import { EntityInfo } from '../../store/types/api.types';
import { UpdateApplication } from '../../store/actions/application.actions';
import { ListFilter, ListSort, SetListStateAction } from '../../store/actions/list.actions';
import { AppVariablesDelete, AppVariablesAdd, AppVariablesEdit } from '../../store/actions/app-variables.actions';
import { ListActionConfig, ListActions } from './list-data-source-types';
import { AppMetadataProperties, GetAppMetadataAction, EnvVarsSchema } from '../../store/actions/app-metadata.actions';
import { AppMetadataType } from '../../store/types/app-metadata.types';
import { map } from 'rxjs/operators';
import { ApplicationEnvVars } from '../../features/applications/application/build-tab/application-env-vars.service';

export interface AppEnvVar {
  name: string;
  value: string;
}

export class CfAppEvnVarsDataSource extends CfListDataSource<AppEnvVar, ApplicationEnvVars> {

  // Only needed for update purposes
  public rows = new Array<AppEnvVar>();

  public cfGuid: string;
  public appGuid: string;

  filteredRows = new Array<AppEnvVar>();
  isLoadingPage$: Observable<boolean>;
  data$: any;

  constructor(
    protected _cfStore: Store<AppState>,
    private _appService: ApplicationService,
  ) {
    super(
      _cfStore,
      new GetAppMetadataAction(
        _appService.appGuid,
        _appService.cfGuid,
        AppMetadataProperties.ENV_VARS as AppMetadataType,
      ),
      EnvVarsSchema,
      (object: AppEnvVar) => {
        return object.name;
      },
      (): AppEnvVar => {
        return {
          name: '',
          value: '',
        };
      },
      getPaginationKey(
        AppMetadataProperties.ENV_VARS,
        _appService.appGuid,
        _appService.cfGuid
      ),
      map(app => {
        const env = app[0].environment_json;
        const rows = Object.keys(env).map(name => ({ name, value: env[name] }));
        return rows;
      })
    );

    this.cfGuid = _appService.cfGuid;
    this.appGuid = _appService.appGuid;
    const paginationKey = getPaginationKey(
      AppMetadataProperties.ENV_VARS,
      _appService.appGuid,
      _appService.cfGuid
    );
    _cfStore.dispatch(new SetListStateAction(
      paginationKey,
      'table',
      {
        pageIndex: 0,
        pageSize: 5,
        totalResults: 0,
      },
      null,
      {
        filter: ''
      }));
  }

  saveAdd() {
    this._cfStore.dispatch(new AppVariablesAdd(this.cfGuid, this.appGuid, this.rows, this.addItem));
    super.saveAdd();
  }

  startEdit(row: AppEnvVar) {
    super.startEdit({ ...row });
  }

  saveEdit() {
    this._cfStore.dispatch(new AppVariablesEdit(this.cfGuid, this.appGuid, this.rows, this.editRow));
    super.saveEdit();
  }

  listFilter(envVars: AppEnvVar[], filter: ListFilter): AppEnvVar[] {
    this.filteredRows.length = 0;
    this.rows.length = 0;

    for (const envVar of envVars) {
      const { name, value } = envVar;
      this.rows.push(envVar);


      if (filter && filter.filter && filter.filter.length > 0) {
        if (name.indexOf(filter.filter) >= 0 || value.indexOf(filter.filter) >= 0) {
          this.filteredRows.push({ name, value });
        }
      } else {
        this.filteredRows.push({ name, value });
      }
    }

    return this.filteredRows;
  }

  listSort(envVars: Array<AppEnvVar>, sort: ListSort): AppEnvVar[] {
    return envVars.slice().sort((a, b) => {
      const [propertyA, propertyB] = [a[sort.field], b[sort.field]];
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    });
  }
}
