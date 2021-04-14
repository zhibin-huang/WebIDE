import * as ws from "ws";
import * as http from "http";
import * as url from "url";
import * as net from "net";
import * as express from "express";
import * as rpc from "@codingame/monaco-jsonrpc";
import * as server from "@codingame/monaco-jsonrpc/lib/server";
import * as glob from 'glob';
import * as lsp from 'vscode-languageserver';


process.on('uncaughtException', function (err: any) {
    console.error('Uncaught Exception: ', err.toString());
    if (err.stack) {
        console.error(err.stack);
    }
});

const CONFIG_DIR = process.platform === 'darwin' ? 'config_mac' : process.platform === 'linux' ? 'config_linux' : 'config_win';
const BASE_URI = 'workspace';
type IJavaExecutable = {
  options: any;
  command: string;
  args: Array<string>;
}

//const PORT = 9988;
const SERVER_HOME = 'lsp-java-server';
const launchersFound: Array<string> = glob.sync('**/plugins/org.eclipse.equinox.launcher_*.jar', { cwd: `./${SERVER_HOME}` });

if (launchersFound.length === 0 || !launchersFound) {
  throw new Error('**/plugins/org.eclipse.equinox.launcher_*.jar Not Found!');
}

const params: Array<string> = [
  '-Xmx512m',
  '-Xms512m',
  '-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=,quiet=y',
  '-Declipse.application=org.eclipse.jdt.ls.core.id1',
  '-Dosgi.bundles.defaultStartLevel=4',
  '-noverify',
  '-Declipse.product=org.eclipse.jdt.ls.core.product',
  '-jar',
  `./${SERVER_HOME}/${launchersFound[0]}`,
  '-configuration',
  `./${SERVER_HOME}/${CONFIG_DIR}`,
  '-data',
  `./${BASE_URI}/`
];

export function prepareExecutable(): IJavaExecutable {
  let executable = Object.create(null);
  let options = Object.create(null);
  options.env = process.env;
  options.stdio = 'pipe';
  executable.options = options;
  executable.command = 'java';
  executable.args = params;
  return executable;
}


const executable = prepareExecutable();

// create the express application
const app = express();
// server the static content, i.e. index.html
//app.use(express.static(__dirname));
// start the server
const appserver =app.listen(4000);
// create the web socket
const wss = new ws.Server({
    noServer: true,
    perMessageDeflate: false
});
appserver.on('upgrade', (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
    const pathname = request.url ? url.parse(request.url).pathname : undefined;
    if (pathname === '/java-lsp') {
        wss.handleUpgrade(request, socket, head, webSocket => {
            const socket: rpc.IWebSocket = {
                send: content => webSocket.send(content, error => {
                    if (error) {
                        throw error;
                    }
                }),
                onMessage: cb => webSocket.on('message', cb),
                onError: cb => webSocket.on('error', cb),
                onClose: cb => webSocket.on('close', cb),
                dispose: () => webSocket.close()
            };
            // launch the server when the web socket is opened
            if (webSocket.readyState === webSocket.OPEN) {
                launch(socket);
            } else {
                webSocket.on('open', () => launch(socket));
            }
        });
    }
});

function launch(socket : rpc.IWebSocket) {
    const reader = new rpc.WebSocketMessageReader(socket);
    const writer = new rpc.WebSocketMessageWriter(socket);
    const socketConnection = server.createConnection(reader, writer, ()=> socket.dispose());
    const serverConnection = server.createServerProcess('java-lsp', executable.command, executable.args);
    server.forward(socketConnection, serverConnection, message=>{
        if (rpc.isRequestMessage(message)) {
            if (message.method === lsp.InitializeRequest.type.method) {
                const initializeParams = message.params as lsp.InitializeParams;
                initializeParams.processId = process.pid;
            }
        }
        else{
            console.log(message);
        }
        return message;
    });
  }