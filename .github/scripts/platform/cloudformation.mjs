import { shell } from  './shell.mjs'

/**
 * @typedef {Object} StackOptions
 * @property {string} templateBody
 * @property {string} stackName
 * @property {string} region
 * @property {Record<string, string>} parameters
 */

export class Cloudformation {
  static exists(
    /**@type {string}*/ stackName,
  ) {
    try {
      shell(`aws cloudformation describe-stack-events --stack-name ${stackName}`, { stdio: 'ignore' })
      return true
    } catch (error) {
      return false      
    }
  }

  /** @returns {{Outputs: {OutputKey:string, OutputValue: string}[]}} */
  static describeStack(
    /**@type {string}*/ stackName,
  ) {
    const resultStr = shell(`aws cloudformation describe-stacks --stack-name ${stackName}`, { stdio: 'pipe' })
    const result = JSON.parse(resultStr.toString())
    if (result.Stacks.length === 0) {
      throw new Error('Stack not found')
    }
    return result.Stacks[0]
  }

  static updateStack(
    /**@type {StackOptions}*/ options,
  ) {
    try {
      const command = [
        `aws cloudformation update-stack`,
        `--template-body ${options.templateBody}`,
        `--stack-name ${options.stackName}`,
        `--capabilities CAPABILITY_NAMED_IAM`,
        `--region ${options.region}`,
      ]

      if (options.parameters) {
        command.push('--parameters')
        for (const [ParameterKey, ParameterValue] of Object.entries(options.parameters)) {
          command.push(`ParameterKey=${ParameterKey},ParameterValue=${ParameterValue}`)
        }
      }

      shell(command.join(' '))
      shell(`aws cloudformation wait stack-update-complete --region ${options.region} --stack-name ${options.stackName}`)
      return true
    } catch (error) {
      return false      
    }
  }

  static createStack(
    /**@type {StackOptions}*/ options,
  ) {
    try {
      const command = [
        `aws cloudformation create-stack`,
        `--template-body ${options.templateBody}`,
        `--stack-name ${options.stackName}`,
        `--capabilities CAPABILITY_NAMED_IAM`,
        `--region ${options.region}`,
      ]

      if (options.parameters) {
        command.push('--parameters')
        for (const [ParameterKey, ParameterValue] of Object.entries(options.parameters)) {
          command.push(`ParameterKey=${ParameterKey},ParameterValue=${ParameterValue}`)
        }
      }

      shell(command.join(' '))
      shell(`aws cloudformation wait stack-create-complete --region ${options.region} --stack-name ${options.stackName}`)
      return true
    } catch (error) {
      return false      
    }
  }
}