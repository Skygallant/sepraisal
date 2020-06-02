import { DB_NAME, DB_URL, IBlueprint } from '@sepraisal/common'
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import { MongoClient, RootQuerySelector } from 'mongodb'

import { flattenProjection, track } from './common'


export const hello: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {

    // tslint:disable-next-line: no-floating-promises
    track(event)

    try {
        const params = event.queryStringParameters ? event.queryStringParameters : {}

        const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true })

        // tslint:disable:no-unsafe-any
        const find: RootQuerySelector<IBlueprint> = 'find' in params ? JSON.parse(params.find) : {}
        const skip: number = 'skip' in params ? JSON.parse(params.skip) : 0
        const sort: object = 'sort' in params ? JSON.parse(params.sort) : {}
        const projectionRaw: object = 'projection' in params ? JSON.parse(params.projection) : {}
        const limitRaw: number = 'limit' in params ? JSON.parse(params.limit) : 100
        // tslint:enable:no-unsafe-any

        // MongoDB wants Date objects instead of strings, so replace some known ones.
        for(const criterion of find.$and!) {
            const key = Object.keys(criterion).pop()
            if(key === 'steam.postedDate' || key === 'steam.updatedDate') {
                const subkeys = Object.keys(criterion[key])  // $gte, $lte, $eq, and the like.
                for(const subkey of subkeys) {
                    criterion[key][subkey] = new Date(criterion[key][subkey])
                }
            }
        }

        const projection = {}
        for(const key of flattenProjection(projectionRaw)) projection[key] = true

        const limit = Math.max(0, Math.min(100, limitRaw))

        const cursor = client
            .db(DB_NAME)
            .collection<IBlueprint>('blueprints')
            .find(find)
            .sort(sort)
            .project(projection)
            .skip(skip)
            .limit(limit)

        const result = {
            count: await cursor.count(),
            docs: await cursor.toArray(),
            find,
            limit,
            projection,
            skip,
            sort,
        }

        await client.close()

        return {
            body: JSON.stringify(result),
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 200,
        }
    } catch(err) {
        const error = err instanceof Error ? err : new Error(err as string)
        console.error(error.stack)

        return {
            body: error.message,
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 503,
        }
    }
}