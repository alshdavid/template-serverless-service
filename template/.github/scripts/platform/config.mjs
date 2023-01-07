import { Directories } from '../platform/directories.mjs'
import * as path from 'node:path'
import * as fs from 'node:fs'

export class Config {
    PROJECT_PREFIX
    PROJECT_NAME
    AWS_REGION

    constructor() {
        let config = ''
        try {
            config = fs.readFileSync(path.join(Directories.root.github.scripts.path, 'config.json'), { encoding: 'utf8' })
        } catch (error) {
            throw new Error('Config not found')
        }
        
        const {
            PROJECT_PREFIX,
            PROJECT_NAME,
            AWS_REGION,
        } = JSON.parse(config)

        if (PROJECT_NAME.includes('%')) {
            throw new Error('Config not setup')
        }

        this.PROJECT_PREFIX = PROJECT_PREFIX
        this.PROJECT_NAME = PROJECT_NAME
        this.AWS_REGION = AWS_REGION
    }
}
