import { execSync } from 'node:child_process'

/**
 * @param {string|string[]} command 
 * @param {import('node:child_process').ExecSyncOptions} options 
 * @returns 
 */
export function shell(
  command,
  options = {},
) {
  if (Array.isArray(command)) {
    return execSync(command[0], { stdio: 'inherit', ...options })
  }
  return execSync(command, { stdio: 'inherit', ...options })
}
