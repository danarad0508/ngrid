import { NgModule, Injector, createComponent, EnvironmentInjector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyPaginator as MatPaginator, MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { PblNgridModule } from '@pebula/ngrid';
import { PblPaginatorComponent } from './table-paginator.component';
// TODO: Remove MatPaginatorModule and the initial code in the constructor
// set the styles in the SCSS.

@NgModule({
    imports: [CommonModule, MatPaginatorModule, MatSelectModule, MatTooltipModule, MatButtonModule, PblNgridModule],
    declarations: [PblPaginatorComponent],
    exports: [PblPaginatorComponent]
})
export class PblNgridPaginatorModule {
  constructor(injector: Injector) {
    // this is a workaround to ensure CSS from mat slider is loaded, otherwise it is omitted.
    createComponent(MatPaginator, { environmentInjector: injector.get(EnvironmentInjector) });
  }
}
