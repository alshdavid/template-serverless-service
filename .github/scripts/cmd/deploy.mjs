import YAML from 'yaml'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const contents = fs.readFileSync(path.join(__dirname, '../../cloudformation/resources.yaml'), { encoding: 'utf8' })
console.log(YAML.parse(contents))

// import { Directories } from '../platform/directories.mjs'
// import { shell } from '../platform/shell.mjs'
// import { S3 } from '../platform/s3.mjs'
// import crypto from 'node:crypto'
// import * as path from 'node:path'
// import { Cloudformation } from '../platform/cloudformation.mjs'

// const PROJECT_PREFIX = 'alshdavid'
// const PROJECT_NAME = 'template-api'
// const AWS_REGION = 'ap-southeast-2'
// const TEMP_BUCKET_NAME = `0000-temp-${PROJECT_PREFIX}-${PROJECT_NAME}-${crypto.randomUUID().substring(0,8)}`
// const STACK_NAME = `${PROJECT_PREFIX}-${PROJECT_NAME}`

// shell('make build', { 
//   cwd: Directories.root.packages.web.path,
// })

// shell('make build', { 
//   cwd: Directories.root.packages.httpd.path,
//   env: { ...process.env, GOOS: 'linux', GOARCH: 'amd64' },
// })

// shell('zip lambda.zip ./main', { 
//   cwd: Directories.root.packages.httpd.Dist.path,
// })

// S3.makeBucket(TEMP_BUCKET_NAME, AWS_REGION)

// try {
//   S3.copy('lambda.zip', `s3://${TEMP_BUCKET_NAME}`, { cwd: Directories.root.packages.httpd.Dist.path })

//   /** @type {import('../platform/cloudformation.mjs').StackOptions} */
//   const stackOptions = {
//     templateBody: `file://${path.join(Directories.root.github.cloudformation.path, 'resources.yaml')}`,
//     stackName: STACK_NAME,
//     region: AWS_REGION,
//     parameters: {
//       ParamLambdaBucketUri: TEMP_BUCKET_NAME,
//       ParamProjectPrefix: PROJECT_PREFIX,
//       ParamProjectName: PROJECT_NAME,
//     }
//   }

//   if (Cloudformation.exists(STACK_NAME)) {
//     Cloudformation.updateStack(stackOptions)
//   } else {
//     Cloudformation.createStack(stackOptions)
//   }

//   const stackDetails = Cloudformation.describeStack(STACK_NAME)


//   const ASSET_BUCKET_NAME = stackDetails.Outputs
//     .find(output => output.OutputKey === 'S3BucketWebAssets')
//     ?.OutputValue

//   S3.copy('./dist', `s3://${ASSET_BUCKET_NAME}`, {
//     recursive: true, 
//     cwd: Directories.root.packages.web.path,
//   })

//   S3.removeBucket(TEMP_BUCKET_NAME)
// } catch (error) {
//   console.log('FAILED')
//   console.log(error)
//   S3.removeBucket(TEMP_BUCKET_NAME)
//   process.exit(1)
// }
