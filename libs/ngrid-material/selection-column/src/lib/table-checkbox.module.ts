import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { PblNgridModule, ngridPlugin } from '@pebula/ngrid';
import { PblNgridMatCheckboxSelectionDirective, PLUGIN_KEY } from './checkbox-plugin.directive';
import { PblNgridCheckboxComponent } from './table-checkbox.component';

@NgModule({
    imports: [CommonModule, MatCheckboxModule, PblNgridModule],
    declarations: [PblNgridMatCheckboxSelectionDirective, PblNgridCheckboxComponent],
    exports: [PblNgridMatCheckboxSelectionDirective, PblNgridCheckboxComponent]
})
export class PblNgridCheckboxModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridMatCheckboxSelectionDirective);
}
