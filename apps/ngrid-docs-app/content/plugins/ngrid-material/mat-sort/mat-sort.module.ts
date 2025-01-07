import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { MatSortExample } from './mat-sort.component';
import { ActiveColumnAndDirectionExample } from './active-column-and-direction.component';
import { ProgrammaticExample } from './programmatic.component';

@NgModule({
  declarations: [ MatSortExample, ActiveColumnAndDirectionExample, ProgrammaticExample ],
  imports: [
    CommonModule,
    MatButtonModule, MatProgressSpinnerModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridPaginatorModule, PblNgridMatSortModule,
  ],
  exports: [ MatSortExample, ActiveColumnAndDirectionExample, ProgrammaticExample ],
})
@BindNgModule(MatSortExample, ActiveColumnAndDirectionExample, ProgrammaticExample)
export class MatSortExampleModule { }
