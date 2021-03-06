import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { AdminComponent } from './admin.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule, MatSortModule, MatTableModule, MatTooltipModule } from '@angular/material';
import { AuthGuard } from 'app/_guard';
import { TeamProgressManagerComponent } from './team-progress-manager/team-progress-manager.component';

const routes = [
    {
        path     : 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        AdminComponent,
        TeamProgressManagerComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,
        SharedModule,

        FuseSharedModule,
        FuseWidgetModule,

        MatTableModule,
        MatIconModule,
        MatTooltipModule,
        MatSortModule,
    ],
    exports     : [
        AdminComponent,
        TeamProgressManagerComponent,
    ],
    providers: [
        AuthGuard,
    ],
})

export class AdminModule
{
}
