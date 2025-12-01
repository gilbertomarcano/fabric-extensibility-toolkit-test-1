import React, { useState } from "react";
import { Provider } from "react-redux";
import { ClientSDKStore } from "./playground/ClientSDKPlayground/Store/Store";
import { Route, Router, Switch } from "react-router-dom";
import { History } from "history";
import { WorkloadClientAPI } from "@ms-fabric/workload-client";
import { MarkdownDocItemEditorSettingsPage } from "./items/MarkdownDocItem/MarkdownDocItemEditorSettingsPage";
import { MarkdownDocItemEditorAboutPage } from "./items/MarkdownDocItem/MarkdownDocItemEditorAboutPage";
import { SamplePage, ClientSDKPlayground } from "./playground/ClientSDKPlayground/ClientSDKPlayground";
import { DataPlayground } from "./playground/DataPlayground/DataPlayground";
import { MarkdownDocEditor } from "./items/MarkdownDocItem/MarkdownDocEditor";

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
    return <Router history={history}>
        <Switch>
            {/* Routings for the Markdown Document Editor */}
            <Route path="/MarkdownDoc-editor/:itemObjectId">
                <MarkdownDocEditor
                    workloadClient={workloadClient} data-testid="MarkdownDoc-editor" />
            </Route>

            <Route path="/MarkdownDoc-settings-page/:itemObjectId">
                <MarkdownDocItemEditorSettingsPage
                    workloadClient={workloadClient}
                    data-testid="MarkdownDoc-settings-page" />
            </Route>
            <Route path="/MarkdownDoc-about-page/:itemObjectId">
                <MarkdownDocItemEditorAboutPage workloadClient={workloadClient}
                    data-testid="MarkdownDoc-about-page" />
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