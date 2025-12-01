import React from "react";
import { useTranslation } from "react-i18next";
import { Stack } from "@fluentui/react";
import { Button, Text } from "@fluentui/react-components";

import { WorkloadClientAPI } from "@ms-fabric/workload-client";
import { ItemWithDefinition } from "../../controller/ItemCRUDController";
import { MarkdownDocItemDefinition } from "./MarkdownDocItemModel";
import "../../styles.scss";

interface MarkdownDocItemEditorEmptyProps {
  workloadClient: WorkloadClientAPI;
  item?: ItemWithDefinition<MarkdownDocItemDefinition>;
  onNavigateToGettingStarted: () => void;
}

/**
 * Empty state component - the first screen users see
 * This is a static page that can be easily removed or replaced by developers
 * 
 *  To skip this page, modify MarkdownDocItemEditor.tsx line 25,55
 * to always set currentView to 'getting-started'
 */
export function MarkdownDocItemEditorEmpty({
  workloadClient,
  item,
  onNavigateToGettingStarted
}: MarkdownDocItemEditorEmptyProps) {
  const { t } = useTranslation();





  return (
    <Stack className="empty-state-container" horizontalAlign="center" verticalAlign="center">
      <Stack className="empty-state-content" tokens={{ childrenGap: 24 }} horizontalAlign="center">
        <Stack.Item>
          <img
            src="/assets/items/MarkdownDocItem/EditorEmpty.svg"
            alt="Empty state illustration"
            className="empty-state-image"
          />
        </Stack.Item>
        <Stack className="empty-state-text-container" tokens={{ childrenGap: 8 }} horizontalAlign="center">
          <div className="empty-state-header">
            <h2>{t('MarkdownDocItemEditorEmpty_Title', 'Welcome to MarkdownDoc!')}</h2>
            <Text className="empty-state-description">
              {t('MarkdownDocItemEditorEmpty_Description', 'This is the first screen people will see after an item is created. Include some basic information to help them continue.')}
            </Text>
          </div>
        </Stack>
        <Stack.Item>
          <Button appearance="primary" onClick={onNavigateToGettingStarted}>
            {t('MarkdownDocItemEditorEmpty_StartButton', 'Getting Started')}
          </Button>
        </Stack.Item>
      </Stack>
    </Stack>

  );
}
