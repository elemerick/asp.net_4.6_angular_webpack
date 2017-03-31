import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SignalR, IConnectionOptions, ISignalRConnection, ConnectionStatus }  from 'ng2-signalr';

@Injectable()
export class SignalRService {
  private signalrConnection: ISignalRConnection;
  private connectionStatus = 'disconnected';
  constructor(private authService: AuthService, private _signalR: SignalR) { }

  public connectToMessageHub() {
    if (this.connectionStatus !== 'disconnected') {
      return;
    }

    const token = this.authService.getToken();
    let options: IConnectionOptions = { hubName: 'messageHub', qs: {authorization: token} };
    this._signalR.connect(options)
      .then((signalrConnection) => {
        this.signalrConnection = signalrConnection;
        this.subToSatus();
        this.subToErrors();
        this.registerListeners();
      })
      .then(() => {
        this.sendMessageToServer('test message');
      })
      .catch((errmsg) => {
        console.error(errmsg);
      });
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

  private registerListeners() {
    this.signalrConnection
      .listenFor('echoMethodResponse')
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (errmsg: any) => {
          console.error(errmsg);
        }
      );
  }

  public stopConnection() {
    if (this.signalrConnection && this.signalrConnection.id && this.connectionStatus !== 'disconnected') {
      this.signalrConnection.stop();
    }
  }

  public startConnection() {
    if (this.signalrConnection && this.signalrConnection.id && this.connectionStatus === 'disconnected') {
      this.signalrConnection.start();
    }
  }

  private subToSatus() {
    this.signalrConnection.status.subscribe((status: ConnectionStatus) => {
      this.connectionStatus = status.name;
      if (status.name === 'disconnected') {
        setTimeout(() => {
          this.connectToMessageHub();
        }, 5000);
      }
   //   console.log(status);
    });
  }

  private subToErrors() {
    this.signalrConnection.errors.subscribe((error: any) => {
      console.error('SignalR ERROR: ', error);
    });
  }

}
