import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { CommonGridTemplatesComponent } from './common-grid-templates.component';

@NgModule({
  declarations: [ CommonGridTemplatesComponent ],
  imports: [
    CommonModule,
    MatIconModule, MatProgressSpinnerModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridDragModule.withDefaultTemplates(), PblNgridBlockUiModule,
  ],
  exports: [ CommonGridTemplatesComponent ],
})
export class CommonGridTemplatesModule { }
