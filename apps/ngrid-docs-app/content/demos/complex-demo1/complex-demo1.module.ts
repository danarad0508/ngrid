import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';

import { PblNgridRegistryService, PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridDetailRowModule } from '@pebula/ngrid/detail-row';
import { PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';
import { PblNgridContextMenuModule } from '@pebula/ngrid-material/context-menu';
import { PblNgridCellTooltipModule } from '@pebula/ngrid-material/cell-tooltip';
import { PblNgridCheckboxModule } from '@pebula/ngrid-material/selection-column';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { CommonGridTemplatesModule, CommonGridTemplatesComponent } from '../common-grid-templates';
import { ComplexDemo1Example } from './complex-demo1.component';

@NgModule({
  declarations: [ ComplexDemo1Example ],
  imports: [
    CommonModule,
    MatFormFieldModule, MatSelectModule, MatProgressBarModule, MatSlideToggleModule, MatCheckboxModule, MatRadioModule,

    ExampleCommonModule,
    CommonGridTemplatesModule,

    PblNgridModule.withCommon([ { component: CommonGridTemplatesComponent } ]),
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridStickyModule,
    PblNgridStatePluginModule,
    PblNgridTransposeModule,
    PblNgridDetailRowModule,
    PblNgridOverlayPanelModule,
    PblNgridMatSortModule,
    PblNgridPaginatorModule,
    PblNgridContextMenuModule,
    PblNgridCellTooltipModule,
    PblNgridCheckboxModule,
  ],
  exports: [ ComplexDemo1Example ],
  providers: [ PblNgridRegistryService ],
})
@BindNgModule(ComplexDemo1Example)
export class ComplexDemo1ExampleModule { }
