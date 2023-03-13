import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import { cors } from 'middy/middlewares'

// import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import getUserId from '../utils';
import { getTodos as getTodos } from "../../helpers/todos";

// TODO: Get all TODO items for a current user - Done
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId: string = getUserId(event);
    const todos = await getTodos(userId);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            items: todos,
        })
    }
};

// handler.use(
//   cors({
//     credentials: true
//   })
// )
