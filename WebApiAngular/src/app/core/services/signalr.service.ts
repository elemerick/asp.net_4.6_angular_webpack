import { Injectable }                                       from '@angular/core';
import { AuthService }                                      from './auth.service';
import { Observable }                                       from 'rxjs/Observable';
import { Subject }                                          from 'rxjs/Subject';
import { SignalR, IConnectionOptions, ISignalRConnection }  from 'ng2-signalr';

@Injectable()
export class SignalRService {
  private signalrConnection: ISignalRConnection;
  private connectionStatus = 'disconnected';
  private mainObs = new Subject<boolean>();
  private stopFromCode = false;

  constructor(private authService: AuthService, private _signalR: SignalR) {
    const signalrObs = this.mainObs
      .filter(x => x === true)
      .filter(() => this.connectionStatus === 'disconnected')
      .map((): IConnectionOptions => this.getConnectionOptions)
      .switchMap((options: IConnectionOptions) =>
        Observable.fromPromise(this._signalR.connect(options))
          .retry(3)
          .catch(err => Observable.empty())
      )
      .share();

    signalrObs.subscribe((x: ISignalRConnection) => {
      this.signalrConnection = x;
      this.sendMessageToServer('test message');
    }, (errmsg) => {
      console.error(errmsg);
    });

    signalrObs.mergeMap((x: ISignalRConnection) => x.listenFor('echoMethodResponse'))
      .subscribe((data: any) => {
          console.log(data);
        }, (errmsg: any) => {
          console.error(errmsg);
        });

    signalrObs.mergeMap((x: ISignalRConnection) => x.status)
      .map((x) => this.connectionStatus = x.name)
      .filter((statusName) => statusName === 'disconnected')
      .filter(() => !this.stopFromCode)
      .delay(5000)
      .subscribe((statusName: string) => {
        this.connectToMessageHub();
    });

    signalrObs.mergeMap((x: ISignalRConnection) => x.errors)
      .subscribe((error: any) => {
        console.error('SignalR ERROR: ', error);
      });
  }

  public connectToMessageHub() {
    this.mainObs.next(true);
  }

  public sendMessageToServer(msg: string) {
    this.signalrConnection.invoke('echoMethod', msg)
    .then((data: string[]) => {
      // console.log(data);
    })
    .catch((errmsg) => {
      console.error(errmsg);
    });
  }

  public stopConnection() {
    if (this.signalrConnection && this.signalrConnection.id && this.connectionStatus !== 'disconnected') {
      this.signalrConnection.stop();
      this.stopFromCode = true;
    }
  }

  public startConnection() {
    if (this.signalrConnection && this.signalrConnection.id && this.connectionStatus === 'disconnected') {
      this.signalrConnection.start();
      this.stopFromCode = false;
    }
  }

  private getConnectionOptions() {
    return {
      hubName: 'messageHub',
      qs: {
        authorization: this.authService.getToken()
      }
    };
  }

}
