import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as uuid from 'uuid';

// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import getUserId from '../utils'
import {createAttachmentPresignedUrl} from "../../helpers/todos";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id - Done
    const attachmentId: string = uuid.v4();
    const userId: string = getUserId(event);
    const uploadUrl = await createAttachmentPresignedUrl(userId, todoId, attachmentId);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            uploadUrl,
        })
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
