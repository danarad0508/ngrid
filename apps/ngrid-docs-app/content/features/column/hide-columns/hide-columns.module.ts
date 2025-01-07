import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { HideColumnFeatureExample } from './hide-columns.component';
import { HideColumnWithGroupHeadersFeatureExample } from './hide-columns-with-group-headers.component';

@NgModule({
  declarations: [ HideColumnFeatureExample, HideColumnWithGroupHeadersFeatureExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    MatIconModule,
    MatSelectModule,
    PblNgridModule,
  ],
  exports: [ HideColumnFeatureExample, HideColumnWithGroupHeadersFeatureExample ],
})
@BindNgModule(HideColumnFeatureExample, HideColumnWithGroupHeadersFeatureExample)
export class HideColumnFeatureExampleModule { }
