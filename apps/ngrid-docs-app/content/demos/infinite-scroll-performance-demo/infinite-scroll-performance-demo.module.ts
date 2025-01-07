import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { PblNgridRegistryService, PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';
import { PblNgridCellTooltipModule } from '@pebula/ngrid-material/cell-tooltip';
import { PblNgridCheckboxModule } from '@pebula/ngrid-material/selection-column';
import { PblNgridInfiniteScrollModule } from '@pebula/ngrid/infinite-scroll';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { CommonGridTemplatesModule, CommonGridTemplatesComponent } from '../common-grid-templates';
import { InfiniteScrollPerformanceDemoExample } from './infinite-scroll-performance-demo.component';

@NgModule({
  declarations: [ InfiniteScrollPerformanceDemoExample ],
  imports: [
    CommonModule,
    MatFormFieldModule, MatSelectModule, MatSliderModule, MatRadioModule, MatCheckboxModule, MatProgressSpinnerModule,

    ExampleCommonModule,
    CommonGridTemplatesModule,

    PblNgridModule.withCommon([ { component: CommonGridTemplatesComponent } ]),
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridStatePluginModule,
    PblNgridMatSortModule,
    PblNgridCellTooltipModule,
    PblNgridCheckboxModule,
    PblNgridInfiniteScrollModule,
  ],
  exports: [ InfiniteScrollPerformanceDemoExample ],
  providers: [ PblNgridRegistryService ],
})
@BindNgModule(InfiniteScrollPerformanceDemoExample)
export class InfiniteScrollPerformanceDemoExampleModule { }
