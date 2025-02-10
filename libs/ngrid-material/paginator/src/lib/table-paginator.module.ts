import { CommonModule } from '@angular/common';
import { createComponent, EnvironmentInjector, Injector, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PblNgridModule } from '@pebula/ngrid';
import { PblPaginatorComponent } from './table-paginator.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
