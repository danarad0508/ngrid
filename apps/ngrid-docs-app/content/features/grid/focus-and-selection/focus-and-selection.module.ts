import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { FocusAndSelectionExample } from './focus-and-selection.component';

const COMPONENTS = [ FocusAndSelectionExample ];

@NgModule({
    declarations: COMPONENTS,
    imports: [
        CommonModule,
        MatButtonModule, MatFormFieldModule, MatSelectModule,
        ExampleCommonModule,
        PblNgridModule, PblNgridBlockUiModule,
    ],
    exports: COMPONENTS
})
@BindNgModule(FocusAndSelectionExample)
export class FocusAndSelectionExampleModule { }
