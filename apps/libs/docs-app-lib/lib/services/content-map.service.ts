import { tap, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { DynamicExportedObject } from '@pebula-internal/webpack-dynamic-dictionary';
// import { firstValueFrom } from 'rxjs';
import { NGRID_CONTENT_MAPPING_FILE } from '../../../../ngrid-docs-app/build/webpack.config';

// declare const NGRID_CONTENT_MAPPING_FILE: string;

@Injectable({ providedIn: 'root' })
export class ContentMapService {

  getMapping1() {
    return NGRID_CONTENT_MAPPING_FILE;
  }

  get getMapping(): Promise<DynamicExportedObject> {
    if (!this.mapping) {
      if (!this.fetching) {
        this.fetching = this.httpClient.get<DynamicExportedObject>(NGRID_CONTENT_MAPPING_FILE + `?dt=${Date.now()}`)
          .pipe(
            tap(mapping => {
              this.mapping = mapping;
            },
            finalize(() => {
              this.fetching = undefined;
            }),
          )
          ).toPromise();
        // this.fetching = firstValueFrom(
        //   this.httpClient.get<DynamicExportedObject>(NGRID_CONTENT_MAPPING_FILE + `?dt=${Date.now()}`)
        //     .pipe(
        //       tap({
        //         next: mapping => {
        //           this.mapping = mapping;
        //         },
        //         finalize: () => {
        //           this.fetching = undefined;
        //         }
        //       })
        //     )
        // );
      }
      return this.fetching;
    } else {
      return Promise.resolve(this.mapping);
    }
  }

  private fetching: Promise<DynamicExportedObject>;
  private mapping: DynamicExportedObject;

  constructor(private httpClient: HttpClient) { }

}
