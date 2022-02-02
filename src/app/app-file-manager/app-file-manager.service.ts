import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { BaseService } from '../app-shared/base/base.service';
import { AppFile } from './app-file.model';

@Injectable({
    providedIn: 'root',
})
export class AppFileManagerService extends BaseService {

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer) {
        super();
    }

    public async openFile(file: string | File, appFile?: AppFile) {
        if (typeof file === 'string') {
            const base64Response = await fetch(file);
            const blob = await base64Response.blob();
            var fileTemp = new File([blob], appFile.fileName, { type: appFile.dataContentType });
            window.open(window.URL.createObjectURL(fileTemp), '_blank');
        } else if (file instanceof File) {
            window.open(window.URL.createObjectURL(file), '_blank');
        }
    }

    getObjectURL(data: string | File, appFile?: AppFile): SafeResourceUrl {
        if (typeof data === 'string') {
            const blob = new Blob([data], { type: appFile.dataContentType });
            return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
        } else if (data instanceof File) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(data));
        }
    }

    public async convertToFile(file: string, appFile?: AppFile): Promise<File> {
        const base64Response = await fetch(file);
        const blob = await base64Response.blob();
        var fileTemp = new File([blob], appFile.fileName, { type: appFile.dataContentType });
        return fileTemp;
    }

    public base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
        b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    getFile(id: number): Observable<AppFile> {
        var url = this.apiUrl + "/services/nrmsdomain/api/attachments/" + id;
        return this.http.get<AppFile>(url);
    }
}
