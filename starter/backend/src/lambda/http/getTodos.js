
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import {getByUserId} from '../../bussinessLogic/todos.mjs'
import {S3Client} from '@aws-sdk/client-s3'
import {getUserId} from '../utils.mjs'
import {createLogger} from '../../utils/logger.mjs'


const logger = createLogger('http')

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    logger.info(`Getting all Todos ${JSON.stringify(event, null, 2)}`)

    const userId = getUserId(event)

    const items = (await getByUserId(userId))

    return {
      statusCode: 200, body: JSON.stringify({
        items
      })
    }
  })
