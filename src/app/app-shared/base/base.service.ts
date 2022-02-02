import { environment } from 'src/environments/environment';

export abstract class BaseService {

    apiUrl: string = environment.apis.default.url;
    appName: string = environment.apis.default.appName;

    constructor() { }

    // replaceArabicChar(value: string): string {
    //     return value.replace("ي", "ی").replace("ك", "ک");
    // }

}
