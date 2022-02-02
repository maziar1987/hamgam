import { WorkflowButtonEvent } from "./workflow-button-event";

export interface WorkflowSendButton {
    showCreateActivity: boolean;
    onClick: (event: WorkflowButtonEvent) => void;
}
