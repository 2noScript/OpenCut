import { EventEmitter } from 'events';

declare global {
  var mcpEmitter: EventEmitter | undefined;
}

export const mcpEventEmitter = global.mcpEmitter || new EventEmitter();
if (process.env.NODE_ENV !== 'production') global.mcpEmitter = mcpEventEmitter;

export const getActionKey = (userId: string, projectId: string) => `action:${userId}_${projectId}`;