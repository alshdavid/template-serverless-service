import { shell } from '../platform/shell.mjs'
import { Directories } from '../platform/directories.mjs'

shell('make build', {
    cwd: Directories.root.packages.httpd.path
})

shell('make build', {
    cwd: Directories.root.packages.web.path
})
