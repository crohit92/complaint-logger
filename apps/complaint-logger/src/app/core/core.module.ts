import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/http/interceptor.service';


@NgModule({
    imports: [BrowserAnimationsModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: InterceptorService
        }
    ],
    exports: [BrowserAnimationsModule]
})
export class CoreModule { }