import React, { useState, useEffect } from "react";
import {
  Text,
  Spinner,
} from "@fluentui/react-components";
import { WorkloadClientAPI } from "@ms-fabric/workload-client";
import { ItemWithDefinition } from "../../controller/ItemCRUDController";
import { HelloWorldItemDefinition } from "./HelloWorldItemModel";
import "../../styles.scss";

interface MarkdownDocEditorDefaultProps {
  workloadClient: WorkloadClientAPI;
  item?: ItemWithDefinition<HelloWorldItemDefinition>;
}

export function MarkdownDocEditorDefault({
  workloadClient,
  item,
}: MarkdownDocEditorDefaultProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      if (!item) return;

      try {
        setLoading(true);
        console.log(`Fetching content for Workspace: ${item.workspaceId}, Item: ${item.id}`);

        // Call the backend endpoint we created in Phase 3
        const response = await fetch(`http://localhost:8080/GetItemPayload/${item.workspaceId}/${item.id}`);

        if (!response.ok) {
          throw new Error(`Error fetching content: ${response.statusText}`);
        }

        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        console.error("Failed to fetch content:", err);
        setError(err.message);
        setContent("# Error loading document\n\nCould not load content from OneLake.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [item]);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <Spinner label="Loading content from OneLake..." />
      </div>
    );
  }

  return (
    <div className="markdown-editor-container" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '10px' }}>
        <Text size={500} weight="semibold">{item?.displayName}</Text>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

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
        readOnly={true} // Phase 4 is just visualization
      />
    </div>
  );
}