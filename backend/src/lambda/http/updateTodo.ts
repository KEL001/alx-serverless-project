import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import getUserId from '../utils'
import {updateTodo} from "../../helpers/todos";
import * as createError from "http-errors";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
      if (!updatedTodo.name || !todoId) throw new createError.BadRequest();
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object - Done
      const userId = getUserId(event);
    await updateTodo(userId, todoId, updatedTodo);

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: `TodoId: ${todoId} was Updated`,
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
