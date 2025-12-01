import React from "react";
import {
  Text,
} from "@fluentui/react-components";
import { WorkloadClientAPI } from "@ms-fabric/workload-client";
import { ItemWithDefinition } from "../../controller/ItemCRUDController";
import { MarkdownDocItemDefinition } from "./MarkdownDocItemModel";
import "../../styles.scss";

interface MarkdownDocEditorDefaultProps {
  workloadClient: WorkloadClientAPI;
  item?: ItemWithDefinition<MarkdownDocItemDefinition>;
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
          height: 'calc(100vh - 100px)', // Occupy most of the screen
          fontFamily: 'Consolas, "Courier New", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          padding: '15px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          resize: 'none', // Disable resize as it fills the container
          outline: 'none',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
        }}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe tu documento Markdown aquí..."
        spellCheck={false}
      />
    </div>
  );
}