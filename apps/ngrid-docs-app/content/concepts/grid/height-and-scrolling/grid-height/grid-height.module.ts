import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { GridHeightGridExample } from './grid-height.component';

@NgModule({
  declarations: [ GridHeightGridExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    MatCheckboxModule, MatButtonModule, MatSelectModule,
    PblNgridModule,
  ],
  exports: [ GridHeightGridExample ],
})
@BindNgModule(GridHeightGridExample)
export class GridHeightGridExampleModule { }
