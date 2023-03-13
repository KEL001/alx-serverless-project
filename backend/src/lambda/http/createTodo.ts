import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import getUserId from '../utils';
import {createTodo} from "../../helpers/todos";
import * as createError from 'http-errors';
// import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const newTodo: CreateTodoRequest = JSON.parse(event.body);
      if (!newTodo.name) throw new createError.BadRequest();
      // TODO: Implement creating a new TODO item - Done
      const userId: string = getUserId(event);
      const result = await createTodo(userId, newTodo);

      return {
          statusCode: 201,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
              item: result,
          })
      }
  })

handler.use(
  cors({
    credentials: true
  })
)
