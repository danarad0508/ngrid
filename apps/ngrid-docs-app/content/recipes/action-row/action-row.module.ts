import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule  } from '@angular/material/legacy-form-field';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { ActionRowExample, MyGridActionRowComponent } from './action-row.component';

@NgModule({
  declarations: [ ActionRowExample, MyGridActionRowComponent ],
  imports: [
    CommonModule,
    MatIconModule, MatInputModule, MatButtonModule, MatFormFieldModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridPaginatorModule, PblNgridMatSortModule,
  ],
  exports: [ ActionRowExample ],
})
@BindNgModule(ActionRowExample)
export class ActionRowExampleModule { }
