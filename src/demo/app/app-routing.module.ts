import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SentioDemoComponent } from './sentio-demo/sentio-demo.component';

@NgModule({
	imports: [
		RouterModule.forRoot([
			{
				path: '',
				component: SentioDemoComponent
			}
		], { useHash: true })
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
