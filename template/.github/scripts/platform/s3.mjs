import { shell } from  './shell.mjs'

export class S3 {
  static makeBucket(
    /**@type {string}*/ bucketName, 
    /**@type {string}*/ region,
  ) {
    shell(`aws s3 mb s3://${bucketName} --region ${region}`)
  }

  static removeBucket(
    /**@type {string}*/ bucketName, 
  ) {
    shell(`aws s3 rb s3://${bucketName} --force`)
  }

  static copy(
    /**@type {string}*/ from, 
    /**@type {string}*/ to, 
    /** @type {{cwd?: string, recursive?: boolean}} */ options = {},
  ) {
    let command = `aws s3 cp ${from} ${to}`
    if (options.recursive) {
      command += ' --recursive'
    }
    shell(command, { cwd: options.cwd })
  }
}