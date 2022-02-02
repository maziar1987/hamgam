import {BaseService} from 'src/app/app-shared/base/base.service';

export class WebsocketService extends BaseService {

  getWebsocketUri(name: string): string {
    const location = window.location;

    name = 'message';

    let uri: string = location.protocol === 'https:' ? 'wss:' : 'ws:';
    uri += '//' + location.hostname + ':9999';

    const username = 'admin';
    return uri + '/channel/' + name + '?username=' + username;
  }

}
