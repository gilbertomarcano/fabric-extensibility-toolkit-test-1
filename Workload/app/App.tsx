import React, { useState } from "react";
import { Provider } from "react-redux";
import { ClientSDKStore } from "./playground/ClientSDKPlayground/Store/Store";
import { Route, Router, Switch } from "react-router-dom";
import { History } from "history";
import { WorkloadClientAPI } from "@ms-fabric/workload-client";
import CustomItemSettings from "./items/HelloWorldItem/HelloWorldItemEditorSettingsPage";
import CustomAbout from "./items/HelloWorldItem/HelloWorldItemEditorAboutPage";
import { SamplePage, ClientSDKPlayground } from "./playground/ClientSDKPlayground/ClientSDKPlayground";
import { DataPlayground } from "./playground/DataPlayground/DataPlayground";
import { HelloWorldItemEditor } from "./items/HelloWorldItem/HelloWorldItemEditor";

/*
    Add your Item Editor in the Route section of the App function below
*/

interface AppProps {
    history: History;
    workloadClient: WorkloadClientAPI;
}

export interface PageProps {
    workloadClient: WorkloadClientAPI;
    history?: History
}

export interface ContextProps {
    itemObjectId?: string;
    workspaceObjectId?: string
    source?: string;
}

export interface SharedState {
    message: string;
}

export function App({ history, workloadClient }: AppProps) {
    const [backendUrl, setBackendUrl] = useState("http://localhost:8080");
    const [backendResponse, setBackendResponse] = useState<string>("");

    const pingBackend = async () => {
        try {
            setBackendResponse("Loading...");
            const response = await fetch(backendUrl);
            const data = await response.json();
            setBackendResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            setBackendResponse(`Error: ${error.message}`);
        }
    };

    console.log('🎯 App component rendering with history:', history);
    console.log('🎯 Current location:', history.location);

    return <Router history={history}>
        {/* Test route for debugging */}
        <Route exact path="/">
            <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
                <h1>🎉 Workload is running!</h1>
                <p>Current URL: {window.location.href}</p>
                <p>Workload Name: {process.env.WORKLOAD_NAME}</p>

                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', backgroundColor: 'white' }}>
                    <h2>Backend Connection Test</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Backend URL:</label>
                        <input
                            type="text"
                            value={backendUrl}
                            onChange={(e) => setBackendUrl(e.target.value)}
                            style={{ width: '100%', padding: '5px' }}
                        />
                    </div>
                    <button onClick={pingBackend} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                        Ping Backend
                    </button>
                    <div style={{ marginTop: '10px' }}>
                        <strong>Response:</strong>
                        <pre style={{ backgroundColor: '#eee', padding: '10px', overflowX: 'auto' }}>
                            {backendResponse}
                        </pre>
                    </div>
                </div>
            </div>
        </Route>
        <Switch>
            {/* Routings for the Hello World Item Editor */}
            <Route path="/HelloWorldItem-editor/:itemObjectId">
                <HelloWorldItemEditor
                    workloadClient={workloadClient} data-testid="HelloWorldItem-editor" />
            </Route>

            <Route path="/HelloWorldItem-settings-page/:itemObjectId">
                <CustomItemSettings
                    workloadClient={workloadClient}
                    data-testid="HelloWorldItem-settings-page" />
            </Route>
            <Route path="/HelloWorldItem-about-page/:itemObjectId">
                <CustomAbout workloadClient={workloadClient}
                    data-testid="HelloWorldItem-about-page" />
            </Route>

            {/* Playground routes  can be deleted if not needed */}
            <Route path="/client-sdk-playground">
                <Provider store={ClientSDKStore}>
                    <ClientSDKPlayground workloadClient={workloadClient} />
                </Provider>
            </Route>
            <Route path="/data-playground">
                <DataPlayground workloadClient={workloadClient} />
            </Route>

            <Route path="/sample-page">
                <SamplePage workloadClient={workloadClient} />
            </Route>
        </Switch>
    </Router>;
}