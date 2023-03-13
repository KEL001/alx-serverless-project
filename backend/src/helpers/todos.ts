import {
    handleCreateTodo,
    handleDeleteTodo,
    handleFetchTodo,
    handleUpdateTodo,
    getSingleTodo,
    updateAttachment
} from './todosAcess'
import { getAttachmentUploadURL } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors';

const logger = createLogger('BusinessLogic');

// TODO: Implement businessLogic - Done

/**
 *
 * @param userId
 */
export async function getTodos(userId: string): Promise<TodoItem[] | Error> {
    logger.info('Running getTodos');
    return handleFetchTodo(userId).catch((e) => {
        return createError(400, `Error Occurred: ${e}`)
    })
}

/**
 *
 * @param userId
 * @param input
 */
export const createTodo = (userId: string, input: CreateTodoRequest): Promise<TodoItem | Error> => {
    const todo: TodoItem = {
        userId,
        todoId: uuid.v4(),
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
        ...input,
    }
    return handleCreateTodo(todo).then((data) => {
        logger.info(`TODO: ${todo.todoId} created successfully`);
        return data;
    }).catch((e) => {
        return createError(400, `Error Occurred: ${e}`)
    })
};

/**
 *
 * @param userId
 * @param todoId
 * @param input
 */
export const updateTodo = (userId: string, todoId: string, input: UpdateTodoRequest): Promise<void | Error> => {
    return handleUpdateTodo(userId, todoId, input).then(() => {
        logger.info(`TODO: ${todoId} updated successfully`);
        return;
    }).catch((e) => {
        logger.error(e);
        return createError(400, `Error Occurred: ${e}`)
    })
};

/**
 *
 * @param userId
 * @param todoId
 */
export const deleteTodo = async (userId: string, todoId: string): Promise<void | Error> => {
    return handleDeleteTodo(userId, todoId).then(() => {
        logger.info(`TODO: ${todoId} Delete Successfully`);
        return;
    }).catch((e) => {
        logger.error(e);
        return createError(400, `Error Occurred: ${e}`);
    })
};

/**
 *
 * @param userId
 * @param todoId
 * @param attachmentId
 */

export const createAttachmentPresignedUrl = async (todoId: string, userId: string): Promise<string> => {
    logger.info(`Updating TODO: ${todoId} with URL by ${userId}`);
    const existingTodo = await getSingleTodo(todoId, userId);

    if (!existingTodo) throw new createError.NotFound('Todo does not exist');

    const uploadUrl = getAttachmentUploadURL(todoId);
    logger.info(`uploadUrl is ${uploadUrl}`);
    await updateAttachment(userId, todoId);

    return uploadUrl;
}
