import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { BlockUiExample } from './block-ui.component';
import { ManualExample } from './manual.component';

@NgModule({
  declarations: [ BlockUiExample, ManualExample ],
  imports: [
    CommonModule,
    MatButtonModule, MatProgressSpinnerModule, MatProgressBarModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ BlockUiExample, ManualExample ],
})
@BindNgModule(BlockUiExample, ManualExample)
export class BlockUiExampleModule { }
