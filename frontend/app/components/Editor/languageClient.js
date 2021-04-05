import { listen } from '@codingame/monaco-jsonrpc';
import {
    MonacoLanguageClient, MessageConnection, CloseAction, ErrorAction,
    MonacoServices, createConnection
} from 'monaco-languageclient';
import config from 'config.js';
import * as monaco from 'monaco-editor-core'
const ReconnectingWebSocket = require('reconnecting-websocket');

const BASR_DIR = '/Users/huangzhibin/Desktop/webide_home/workspace';

export function connectLanguageServer() {
    // install Monaco language client services
    
    MonacoServices.install(monaco);
    // create the web socket
    const url = 'ws://localhost:3000/java-lsp'
    const webSocket = createWebSocket(url);

    // listen when the web socket is opened
    listen({
        webSocket,
        onConnection: connection => {
            // create and start the language client
            const languageClient = createLanguageClient(connection);
            const disposable = languageClient.start();
            console.log("languageclient started!");
            connection.onClose(() => disposable.dispose());
        }
    });

    function createLanguageClient(connection) {
        return new MonacoLanguageClient({
            name: "Sample Language Client",
            clientOptions: {
                // use a language id as a document selector
                documentSelector: ['java'],
                // disable the default error handler
                errorHandler: {
                    error: () => ErrorAction.Continue,
                    closed: () => CloseAction.DoNotRestart
                }
            },
            // create a language client connection from the JSON RPC connection on demand
            connectionProvider: {
                get: (errorHandler, closeHandler) => {
                    return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
                }
            }
        });
    }

    function createWebSocket(url) {
        const socketOptions = {
            maxReconnectionDelay: 10000,
            minReconnectionDelay: 1000,
            reconnectionDelayGrowFactor: 1.3,
            connectionTimeout: 10000,
            maxRetries: Infinity,
            debug: false
        };
        return new ReconnectingWebSocket(url, [], socketOptions);
    }
}