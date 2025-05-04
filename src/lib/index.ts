export const getProjectId = () => {
  const url = new URL(window.location.href);
  return url.pathname.split('/')[2];
}
export const getUserId = () => {
  const username = document.querySelector(
    "#navigation > div > ul > li.link.right.account-nav > div > a > span",
  )?.textContent;
  if (!username) {
    throw new Error("User not found");
  }
  return username;
}

export interface HandshakeMessage {
  method: "handshake";
  user: string;
  project_id: string;
}
export interface SetMessage {
  method: "set";
  project_id: string;
  name: string;
  value: number;
  user: string;
}
export type SendFunction = (e: SetMessage | HandshakeMessage) => void
export const connectedWebSocketWatcher = (onSend: (e: SetMessage | HandshakeMessage) => void, onReceive: (e: SetMessage) => void): SendFunction => {
  const _send = WebSocket.prototype.send
  const wses = new Set<WebSocket>()
  WebSocket.prototype.send = function (data) {
    _send.call(this, data)
    if (this.url.startsWith("wss://clouddata.scratch.mit.edu")) {
      onSend(JSON.parse(data as string))
      if (!wses.has(this)) {
        wses.add(this)
        this.addEventListener("close", () => {
          wses.delete(this)
        })
        this.addEventListener('message', (e) => {
          const data = JSON.parse(e.data)
          onReceive(data)
        })
      }
    }
  }
  return (data) => {
    for (const ws of wses) {
      ws.send(JSON.stringify(data))
    }
  }
}
