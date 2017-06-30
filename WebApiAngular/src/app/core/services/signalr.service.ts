import { Injectable }                                     from '@angular/core';
import { AuthService }                                    from './auth.service';
import { Observable }                                     from 'rxjs/Observable';
import { SignalR, IConnectionOptions, ConnectionStatus,
         ISignalRConnection, ConnectionStatuses }         from 'ng2-signalr';
import { BehaviorSubject }                                from 'rxjs/BehaviorSubject';

@Injectable()
export class SignalRService {
  private signalrConnection: ISignalRConnection;
  private connectionStatus = ConnectionStatuses.disconnected;
  private stopFromCode = false;
  private connectionSubject = new BehaviorSubject<ISignalRConnection>(null);

  constructor(private authsrv: AuthService, private _signalR: SignalR) {

    this.authsrv.isLoggedInObs().filter(x => x === false).subscribe(x => this.stopConnection());

    const signalrObs = this.authsrv.isLoggedInObs()
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
        this.startConnection();
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
      this.connectionSubject.next(x);
      this.signalrConnection = x;
      this.sendMessageToServer('test message');
    }, (errmsg) => {
      console.error(errmsg);
    });
  }

  public sendMessageToServer(msg: string) {
    this.signalrConnection.invoke('echoMethod', msg)
    .then((data: string[]) => {
      console.log(data);
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

  public getSignalRConnection(): Observable<ISignalRConnection> {
    return this.connectionSubject.asObservable().filter(x => x !== null).share();
  }

  public callServerMethod(methodName: string, ...args: any[]): Observable<string> {
    return this.getSignalRConnection().mergeMap((x) => x.invoke(methodName, ...args));
  }

  public addEventListener(methodName: string): Observable<any> {
    return this.getSignalRConnection()
      .switchMap((x: ISignalRConnection) => x.listenFor(methodName))
      .map((x: string) => JSON.parse(x));
  }

  private getConnectionOptions() {
    return {
      hubName: 'messageHub',
      qs: {
        authorization: this.authsrv.getToken()
      }
    };
  }

}
