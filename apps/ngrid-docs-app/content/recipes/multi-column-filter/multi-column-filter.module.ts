import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule  } from '@angular/material/legacy-form-field';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { MultiColumnFilterExample } from './multi-column-filter.component';

@NgModule({
  declarations: [ MultiColumnFilterExample ],
  imports: [
    CommonModule,
    MatIconModule, MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ MultiColumnFilterExample ],
})
@BindNgModule(MultiColumnFilterExample)
export class MultiColumnFilterExampleModule { }
