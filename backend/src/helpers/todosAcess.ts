import * as AWS from 'aws-sdk'
import {DeleteItemOutput, DocumentClient, UpdateItemOutput} from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import {PromiseResult} from "aws-sdk/lib/request";
import {AWSError} from "aws-sdk";

const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic - Done


const TABLE = process.env.TODOS_TABLE;
const SECONDARY_INDEX = process.env.INDEX_NAME;
const client: DocumentClient = new XAWS.DynamoDB.DocumentClient();

/**
 *
 * @param userId
 */
export const handleFetchTodo = async (userId: string): Promise<TodoItem[]> => {
    logger.info(`Fetching TODOs for ${userId}...`);
    const query = await client.query({
        TableName: TABLE,
        IndexName: SECONDARY_INDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
        }
    }).promise();
    const result = query.Items;
    logger.info(`Fetched TODOs for ${userId}`);
    return result as TodoItem[];
};

/**
 *
 * @param input
 */
export const handleCreateTodo = async (input: TodoItem): Promise<TodoItem> => {
    logger.info(`Creating TODO for ${input.userId}...`);
    await client.put({
        TableName: TABLE,
        Item: input,
    }).promise();

    logger.info(`Created TODO for ${input.userId}`);

    return input;
};

/**
 *
 * @param userId
 * @param todoId
 */
export const handleDeleteTodo = (userId: string, todoId: string): Promise<PromiseResult<DeleteItemOutput, AWSError>> => {
    logger.info(`Deleting TODO: ${todoId} by ${userId}`);
    return client.delete({
        TableName: TABLE,
        Key: {
            userId,
            todoId,
        }
    }).promise();
};

/**
 *
 * @param userId
 * @param todoId
 * @param input
 */
export const handleUpdateTodo = (userId: string, todoId: string, input: TodoUpdate): Promise<PromiseResult<UpdateItemOutput, AWSError>> => {
    logger.info(`Updating TODO: ${todoId} by ${userId}`);
    const { name, dueDate, done } = input;
    return client.update({
        TableName: TABLE,
        Key: {
            userId,
            todoId,
        },
        UpdateExpression: 'name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':name': name,
            ':dueDate': dueDate,
            ':done': done,
        }
    }).promise();
};

export const handleUpdateTodoWithUrl = (userId: string, todoId: string, url: string) => {
    return client.update({
        TableName: TABLE,
        Key: {
            userId,
            todoId,
        },
        UpdateExpression: 'attachmentUrl = :url',
        ExpressionAttributeValues: {
            ':url': url,
        }
    }).promise();
};
