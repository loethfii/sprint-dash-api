export enum UserRole {
	ADMIN = "admin",
	MANAGER = "manager",
	STAFF = "staff",
}

export enum ProjectPriority {
	LOW = "low",
	MEDIUM = "medium",
	HIGH = "high",
	CRITICAL = "critical",
}

export enum TaskStatus {
	OPEN = "open",
	WORKING = "working",
	CLOSED = "closed",
	OVERDUE = "overdue",
}

export enum TaskPriority {
	LOW = "low",
	MEDIUM = "medium",
	HIGH = "high",
	CRITICAL = "critical",
}

export enum EmailType {
	TASK_ASSIGNED = "task_assigned",
	OVERDUE_WARNING = "overdue_warning",
}

export enum EmailStatus {
	PENDING = "pending",
	SENT = "sent",
	FAILED = "failed",
}
