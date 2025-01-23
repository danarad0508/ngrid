import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { ngridPlugin, PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { MatSortExtension } from './mat-sort-component-extension';
import { PblNgridMatSortDirective, PLUGIN_KEY } from './mat-sort.directive';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatSortModule, PblNgridModule],
    declarations: [PblNgridMatSortDirective],
    exports: [PblNgridMatSortDirective, MatSortModule]
})
export class PblNgridMatSortModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridMatSortDirective);

  constructor(private registry: PblNgridRegistryService) {
    registry.addMulti('dataHeaderExtensions', new MatSortExtension());
  }
}
