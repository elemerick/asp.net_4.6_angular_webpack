import { Injectable }                                     from '@angular/core';
import { AuthService }                                    from './auth.service';
import { Observable }                                     from 'rxjs/Observable';
import { Subject }                                        from 'rxjs/Subject';
import { SignalR, IConnectionOptions, ConnectionStatus,
         ISignalRConnection, ConnectionStatuses }         from 'ng2-signalr';

@Injectable()
export class SignalRService {
  private signalrConnection: ISignalRConnection;
  private connectionStatus = ConnectionStatuses.disconnected;
  private trigger = new Subject<boolean>();
  private stopFromCode = false;

  constructor(private authService: AuthService, private _signalR: SignalR) {
    const signalrObs = this.trigger
      .filter(x => x === true)
      .map((): IConnectionOptions => this.getConnectionOptions())
      .switchMap((options: IConnectionOptions) =>
        Observable.defer(() => Observable.fromPromise(this._signalR.connect(options)))
        .retryWhen(err => err.scan<number>((errorCount, error) => {
          if (errorCount >= 2) {
            throw error;
          }
          return errorCount + 1;
        }, 0).delay(3000))
        .catch(err => Observable.empty())
      )
      .share();

    signalrObs.switchMap((x: ISignalRConnection) => x.status)
      .map((x) => this.connectionStatus = x)
      .filter((status) => status.equals(ConnectionStatuses.disconnected))
      .filter(() => !this.stopFromCode)
      .delay(5000)
      .subscribe((status: ConnectionStatus) => {
        this.connectToMessageHub();
    });

    signalrObs.switchMap((x: ISignalRConnection) => x.errors)
      .subscribe((error: any) => {
        console.error('SignalR ERROR: ', error);
      });

    signalrObs.switchMap((x: ISignalRConnection) => x.listenFor('echoMethodResponse'))
      .subscribe((data: any) => {
          console.log(data);
        }, (errmsg: any) => {
          console.error(errmsg);
        });

    signalrObs.subscribe((x: ISignalRConnection) => {
      this.signalrConnection = x;
      this.sendMessageToServer('test message');
    }, (errmsg) => {
      console.error(errmsg);
    });
  }

  public connectToMessageHub() {
    this.trigger.next(true);
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
    if (this.signalrConnection && this.signalrConnection.id && !this.connectionStatus.equals(ConnectionStatuses.disconnected)) {
      this.stopFromCode = true;
      this.signalrConnection.stop();
    }
  }

  public startConnection() {
    if (this.signalrConnection && this.signalrConnection.id && this.connectionStatus.equals(ConnectionStatuses.disconnected)) {
      this.stopFromCode = false;
      this.signalrConnection.start();
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
