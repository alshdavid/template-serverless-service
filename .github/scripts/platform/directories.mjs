import * as path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(__dirname, "..", "..", "..");

export const Directories = {
  root: {
    path: rootDirectory,
    github: {
      cloudformation: {
        path: path.join(rootDirectory, ".github", "cloudformation"),
      },
      scripts: {
        path: path.join(rootDirectory, ".github", "scripts"),
      }
    },
    packages: {
      httpd: {
        path: path.join(rootDirectory, "packages", "httpd"),
        Dist: {
          path: path.join(rootDirectory, "packages", "httpd", 'dist'),
        }
      },
      web: {
        path: path.join(rootDirectory, "packages", "web"),
        dist: {
          path: path.join(rootDirectory, "packages", "web", 'dist'),
        }
      }
    },
  }
};
