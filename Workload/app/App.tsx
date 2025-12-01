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