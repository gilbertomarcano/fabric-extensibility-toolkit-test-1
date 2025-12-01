import React from "react";
import {
  Text,
} from "@fluentui/react-components";
import { WorkloadClientAPI } from "@ms-fabric/workload-client";
import { ItemWithDefinition } from "../../controller/ItemCRUDController";
import { HelloWorldItemDefinition } from "./HelloWorldItemModel";
import "../../styles.scss";

interface MarkdownDocEditorDefaultProps {
  workloadClient: WorkloadClientAPI;
  item?: ItemWithDefinition<HelloWorldItemDefinition>;
  content: string;
  onChange: (newContent: string) => void;
}

export function MarkdownDocEditorDefault({
  workloadClient,
  item,
  content,
  onChange
}: MarkdownDocEditorDefaultProps) {

  return (
    <div className="markdown-editor-container" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '10px' }}>
        <Text size={500} weight="semibold">{item?.displayName}</Text>
      </div>

      <textarea
        style={{
          width: '100%',
          height: '500px',
          fontFamily: 'monospace',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          resize: 'vertical'
        }}
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}