import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalModule } from '@angular/cdk/portal';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';

import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';

import { PblNgridModule } from '@pebula/ngrid';
import { PblTocModule } from '@pebula/apps/docs-app-lib/toc.module';

import {
  MarkdownPageContainerComponent,
  MarkdownPageViewerComponent,
  ExampleViewComponent,
  ContentChunkViewComponent,
  ExampleAssetFileViewComponent,
  NgCustomLogoComponent,
  DemoActionRowComponent,
  AppSearchInput,
  AppSearchResults,
 } from './components';

import { NgEventsDirective } from './directives/ng-hooks';
import { ContentChunkViewGhostDirective, ExampleViewGhostDirective } from './directives/ghosts';
import { PblNegatePipe } from './pipes';

const PIPES_EXPORT = [
  PblNegatePipe
];

const DECLARATION_EXPORT = [
  MarkdownPageContainerComponent,
  MarkdownPageViewerComponent,
  ExampleViewComponent,
  ContentChunkViewComponent,
  ExampleAssetFileViewComponent,
  NgCustomLogoComponent,
  NgEventsDirective,
  DemoActionRowComponent,
  AppSearchInput,
  AppSearchResults,
  ContentChunkViewGhostDirective, ExampleViewGhostDirective,
]

const MATERIAL_IMPORTS = [
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatCheckboxModule,
  MatListModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatSidenavModule,
];

@NgModule({
  declarations: [
    DECLARATION_EXPORT,
    PIPES_EXPORT,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PortalModule,
    MATERIAL_IMPORTS,
    FlexModule, ExtendedModule,
    PblTocModule,
    PblNgridModule,
  ],
  exports: [
    DECLARATION_EXPORT,
    PIPES_EXPORT,

    PblNgridModule
  ],
  providers: [ ],
})
export class PblDocsAppSharedModule {

}
