import { Socket as SocketIOClient } from 'socket.io-client';
import { connect } from 'socket.io-client';

describe('Assessment Integration Tests', () => {
  let socket: SocketIOClient.Socket;

  beforeEach(() => {
    socket = connect('http://localhost:3000', {
      reconnectionDelay: 0,
      forceNew: true
    });
  });

  afterEach(() => {
    socket.close();
  });

  it('connects to assessment server', (done) => {
    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      done();
    });
  });
}); 