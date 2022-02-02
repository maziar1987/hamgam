export class WorkflowActivitySendVisibility {
    subject?: boolean;
    text?: boolean;
    priority?: boolean;
    classification?: boolean;
    deadline?: boolean;

    constructor(
        options: {
            subject?: boolean,
            text?: boolean,
            priorityId?: boolean,
            classificationId?: boolean,
            deadline?: boolean
        }) {
        this.subject = options.subject == undefined || null ? true : options.subject;
        this.text = options.text == undefined || null ? true : options.text;
        this.priority = options.priorityId == undefined || null ? true : options.priorityId;
        this.classification = options.classificationId == undefined || null ? true : options.classificationId;
        this.deadline = options.deadline == undefined || null ? true : options.deadline;
    }
}
