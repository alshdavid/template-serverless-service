import { Directories } from '../platform/directories.mjs'
import { shell } from '../platform/shell.mjs'
import { S3 } from '../platform/s3.mjs'
import crypto from 'node:crypto'
import * as path from 'node:path'
import { Cloudformation } from '../platform/cloudformation.mjs'
import { Config } from '../platform/config.mjs'

const {
  PROJECT_PREFIX,
  PROJECT_NAME,
  AWS_REGION,
} = new Config()

const TEMP_BUCKET_NAME = `0000-temp-${PROJECT_PREFIX}-${PROJECT_NAME}-${crypto.randomUUID().substring(0,8)}`
const STACK_NAME = `${PROJECT_PREFIX}-${PROJECT_NAME}`

await import('./build.mjs')

shell('zip lambda.zip ./main', { 
  cwd: Directories.root.packages.httpd.Dist.path,
})

S3.makeBucket(TEMP_BUCKET_NAME, AWS_REGION)

try {
  S3.copy('lambda.zip', `s3://${TEMP_BUCKET_NAME}`, { cwd: Directories.root.packages.httpd.Dist.path })

  /** @type {import('../platform/cloudformation.mjs').StackOptions} */
  const stackOptions = {
    templateBody: `file://${path.join(Directories.root.github.cloudformation.path, 'resources.yaml')}`,
    stackName: STACK_NAME,
    region: AWS_REGION,
    parameters: {
      ParamLambdaBucketUri: TEMP_BUCKET_NAME,
      ParamProjectPrefix: PROJECT_PREFIX,
      ParamProjectName: PROJECT_NAME,
    }
  }

  if (Cloudformation.exists(STACK_NAME)) {
    Cloudformation.updateStack(stackOptions)
  } else {
    Cloudformation.createStack(stackOptions)
  }

  const stackDetails = Cloudformation.describeStack(STACK_NAME)

  const ASSET_BUCKET_NAME = stackDetails.Outputs
    .find(output => output.OutputKey === 'S3BucketWebAssets')
    ?.OutputValue

  S3.copy('./dist', `s3://${ASSET_BUCKET_NAME}`, {
    recursive: true, 
    cwd: Directories.root.packages.web.path,
  })

  // TODO Set secret as env on lambda
  //`aws cognito-idp describe-user-pool-client --user-pool-id "ap-southeast-2_52tVqeZ58"  --region ap-southeast-2 --client-id "72p539rgaskqh8f4dnnd3okjrk" --query 'UserPoolClient.ClientSecret' --output text`

  S3.removeBucket(TEMP_BUCKET_NAME)
} catch (error) {
  console.log('FAILED')
  console.log(error)
  Cloudformation.waitForRollback(STACK_NAME, AWS_REGION)
  S3.removeBucket(TEMP_BUCKET_NAME)
  process.exit(1)
}
