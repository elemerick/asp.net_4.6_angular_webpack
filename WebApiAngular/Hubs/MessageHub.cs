using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace WebApiAngular.Hubs
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly static List<ConnectionsKeeper> _keeper = new List<ConnectionsKeeper>();

        public override Task OnConnected()
        {
            if (!_keeper.Any(x => x.ConnectionId == Context.ConnectionId))
            {
                ConnectionsKeeper newkeeper = new ConnectionsKeeper()
                {
                    messageIDs = new List<Guid>(),
                    ConnectionId = Context.ConnectionId
                };
                _keeper.Add(newkeeper);
            }

            return base.OnConnected();
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            _keeper.RemoveAll(x => x.ConnectionId == Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }
        public override Task OnReconnected()
        {
            if (!_keeper.Any(x => x.ConnectionId == Context.ConnectionId))
            {
                ConnectionsKeeper newkeeper = new ConnectionsKeeper()
                {
                    messageIDs = new List<Guid>(),
                    ConnectionId = Context.ConnectionId
                };
                _keeper.Add(newkeeper);
            }
            return base.OnReconnected();
        }

        public async Task EchoMethod(string input)
        {
            var user = Context.User;
            await Task.Delay(5000);
            Clients.Caller.echoMethodResponse(user.Identity.Name + ": " + input.ToUpper());
        }
    }


    public class ConnectionsKeeper
    {
        public string ConnectionId { get; set; }
        public List<Guid> messageIDs { get; set; }
    }
}
