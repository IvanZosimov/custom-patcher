import path from 'path';
import fs from 'fs';
import { CliModule } from './cliModule';

export class VersionFileModule {
  readonly versionFileName: string = 'package.json';
  versionRegexp: RegExp = /"version"\s*:\s*"(?<version>[^"]+)"/;
  cliModule: CliModule;

  constructor(cliModule: CliModule) {
    this.cliModule = cliModule;
  }

  findVersionFilePath = () => {
    try {
      const directory = process.cwd();
      const pathToFile = path.join(directory, this.versionFileName);
      return pathToFile;
    } catch (err) {
      throw new Error(`Failed to find version file path: ${err}`);
    }
  };

  isVersionFileExist = (path: string) => {
    try {
      return fs.existsSync(path);
    } catch (err) {
      throw new Error(`Failed to find version file on the path: ${path}. ${err}`);
    }
  };

  getVersionFileData = (path: string) => {
    try {
      const data = fs.readFileSync(path, 'utf-8');
      return data;
    } catch (err) {
      throw new Error(`Failed to read version file data: ${err}`);
    }
  };

  parseVersion = (data: string) => {
    try {
      const match = data.match(this.versionRegexp);
      if (match && match.groups) {
        const { version } = match.groups;
        if (version) {
          return version;
        }
      }
      throw new Error('Version not matched');
    } catch (err) {
      throw new Error(`Failed to parse current version: ${err}`);
    }
  };

  updateVersionFileData = (data: string, version: string) => {
    try {
      const updatedFileData = data.replace(this.versionRegexp, (match, p1) => {
        const updatedMatch = match.replace(p1, version);
        return updatedMatch;
      });

      return updatedFileData;
    } catch (err) {
      throw new Error(`Failed to update version file data: ${err}`);
    }
  };

  updateVersionFile = (path: string, data: string) => {
    try {
      fs.writeFileSync(path, data, 'utf-8');
    } catch (err) {
      throw new Error(`Failed to update version file: ${err}`);
    }
  };
}
