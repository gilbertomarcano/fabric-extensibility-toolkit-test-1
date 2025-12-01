import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Stack } from "@fluentui/react";
import { useTranslation } from "react-i18next";
import { PageProps, ContextProps } from "../../App";
import { ItemWithDefinition, getWorkloadItem, callGetItem, saveItemDefinition } from "../../controller/ItemCRUDController";
import { callOpenSettings } from "../../controller/SettingsController";
import { callNotificationOpen } from "../../controller/NotificationController";
import { ItemEditorLoadingProgressBar } from "../../controls/ItemEditorLoadingProgressBar";
import { HelloWorldItemDefinition, VIEW_TYPES, CurrentView } from "./HelloWorldItemModel";
import { HelloWorldItemEditorEmpty } from "./HelloWorldItemEditorEmpty";
import { MarkdownDocEditorDefault } from "./MarkdownDocEditorDefault";
import "../../styles.scss";
import { HelloWorldItemRibbon } from "./HelloWorldItemRibbon";


export function MarkdownDocEditor(props: PageProps) {
  const { workloadClient } = props;
  const pageContext = useParams<ContextProps>();
  const { t } = useTranslation();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<ItemWithDefinition<HelloWorldItemDefinition>>();
  const [currentView, setCurrentView] = useState<CurrentView>(VIEW_TYPES.EMPTY);
  const [hasBeenSaved, setHasBeenSaved] = useState<boolean>(false);

  // New state for content
  const [content, setContent] = useState<string>("");

  const { pathname } = useLocation();

  async function loadDataFromUrl(pageContext: ContextProps, pathname: string): Promise<void> {
    setIsLoading(true);
    var LoadedItem: ItemWithDefinition<HelloWorldItemDefinition> = undefined;
    if (pageContext.itemObjectId) {
      try {
        LoadedItem = await getWorkloadItem<HelloWorldItemDefinition>(
          workloadClient,
          pageContext.itemObjectId,
        );

        if (!LoadedItem.definition) {
          LoadedItem = {
            ...LoadedItem,
            definition: { state: undefined }
          };
        }

        setItem(LoadedItem);
        setCurrentView(!LoadedItem?.definition?.state ? VIEW_TYPES.EMPTY : VIEW_TYPES.GETTING_STARTED);

        // Fetch content if we have an item
        if (LoadedItem && LoadedItem.definition?.state) {
          try {
            const response = await fetch(`http://localhost:8080/GetItemPayload/${LoadedItem.workspaceId}/${LoadedItem.id}`);
            if (response.ok) {
              const data = await response.json();
              setContent(data.content);
            } else {
              console.error("Failed to fetch content: HTTP status", response.status);
              setContent("# Error loading content");
            }
          } catch (error) {
            console.error("Failed to fetch content:", error);
            setContent("# Error loading content");
          }
        }

      } catch (error) {
        setItem(undefined);
      }
    } else {
      console.log(`non-editor context. Current Path: ${pathname}`);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    setHasBeenSaved(false);
  }, [currentView, item?.id]);

  useEffect(() => {
    loadDataFromUrl(pageContext, pathname);
  }, [pageContext, pathname]);


  const navigateToGettingStarted = () => {
    setCurrentView(VIEW_TYPES.GETTING_STARTED);
  };

  const handleOpenSettings = async () => {
    if (item) {
      try {
        const item_res = await callGetItem(workloadClient, item.id);
        await callOpenSettings(workloadClient, item_res.item, 'About');
      } catch (error) {
        console.error('Failed to open settings:', error);
      }
    }
  };

  async function SaveItem() {
    // 1. Save Item Definition (Metadata)
    var successResult = await saveItemDefinition<HelloWorldItemDefinition>(
      workloadClient,
      item.id,
      {
        state: VIEW_TYPES.GETTING_STARTED
      });

    // 2. Save Content to Backend (OneLake)
    try {
      const response = await fetch("http://localhost:8080/UpdateItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceId: item.workspaceId,
          itemId: item.id,
          content: content
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content to backend");
      }
      console.log("Content saved successfully to OneLake");
    } catch (error) {
      console.error("Error saving content:", error);
      callNotificationOpen(
        props.workloadClient,
        "Error Saving Content",
        "Could not save content to OneLake. Please try again.",
        undefined,
        undefined
      );
      return; // Don't show success notification if content save failed
    }

    const wasSaved = Boolean(successResult);
    setHasBeenSaved(wasSaved);
    callNotificationOpen(
      props.workloadClient,
      t("ItemEditor_Saved_Notification_Title"),
      t("ItemEditor_Saved_Notification_Text", { itemName: item.displayName }),
      undefined,
      undefined
    );
  }

  const isSaveEnabled = () => {
    // Always enable save if we are in the editor view
    if (currentView === VIEW_TYPES.GETTING_STARTED) {
      return true;
    }
    return false;
  };


  // Show loading state
  if (isLoading) {
    return (
      <ItemEditorLoadingProgressBar
        message={t("HelloWorldItemEditor_Loading", "Loading item...")}
      />
    );
  }

  // Render appropriate view based on state
  return (
    <Stack className="editor" data-testid="item-editor-inner">
      <HelloWorldItemRibbon
        {...props}
        isSaveButtonEnabled={isSaveEnabled()}
        currentView={currentView}
        saveItemCallback={SaveItem}
        openSettingsCallback={handleOpenSettings}
        navigateToGettingStartedCallback={navigateToGettingStarted}
      />
      {currentView === VIEW_TYPES.EMPTY ? (
        <HelloWorldItemEditorEmpty
          workloadClient={workloadClient}
          item={item}
          onNavigateToGettingStarted={navigateToGettingStarted}
        />
      ) : (
        <MarkdownDocEditorDefault
          workloadClient={workloadClient}
          item={item}
          content={content}
          onChange={setContent}
        />
      )}
    </Stack>
  );
}