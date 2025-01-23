import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ngridPlugin, PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridConfigService } from '@pebula/ngrid/core';
import { PblNgridOverlayPanelComponentExtension, PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';
import { MatHeaderContextMenuExtension } from './header-context/header-context-menu-extension';
import { MatHeaderContextMenuTrigger } from './header-context/header-context-menu-trigger';
import { PblNgridMatHeaderContextMenuPlugin, PLUGIN_KEY } from './header-context/header-context-menu.directive';
import { MatExcelStyleHeaderMenu } from './header-context/styles/excel-style-header-menu';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        PblNgridModule,
        PblNgridOverlayPanelModule,
    ],
    declarations: [
        MatHeaderContextMenuTrigger,
        PblNgridMatHeaderContextMenuPlugin,
        MatExcelStyleHeaderMenu,
    ],
    exports: [
        PblNgridMatHeaderContextMenuPlugin,
    ]
})
export class PblNgridContextMenuModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridMatHeaderContextMenuPlugin);

  constructor(@Optional() @SkipSelf() parentModule: PblNgridContextMenuModule,
              registry: PblNgridRegistryService,
              configService: PblNgridConfigService) {
    if (parentModule) {
      return;
    }
    registry.addMulti('dataHeaderExtensions', new MatHeaderContextMenuExtension());
    registry.addMulti('overlayPanels', new PblNgridOverlayPanelComponentExtension('excelMenu', MatExcelStyleHeaderMenu));
  }
}
