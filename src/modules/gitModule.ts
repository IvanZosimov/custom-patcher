import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import { CliModule } from './cliModule';

export class GitModule {
  git: SimpleGit;
  cliModule: CliModule;

  constructor(cliModule: CliModule) {
    this.git = simpleGit().clean(CleanOptions.FORCE);
    this.cliModule = cliModule;
  }

  createCommitMessage = (version: string) => {
    return version;
  };

  createTagName = (version: string) => {
    return `v${version}`;
  };

  getBranch = async () => {
    try {
      const branch = await this.git.branch();
      return branch.current;
    } catch (error) {
      throw new Error(`Failed to get branch: ${error}`);
    }
  };

  add = async (fileName: string) => {
    try {
      await this.git.add(fileName);
    } catch (err) {
      throw new Error(`Failed to stage ${fileName}: ${err}`);
    }
  };
  createCommit = async (message: string) => {
    try {
      await this.git.commit(message);
    } catch (error) {
      throw new Error(`Failed to create commit: ${error}`);
    }
  };

  createTag = async (tag: string) => {
    try {
      await this.git.tag([tag]);
    } catch (error) {
      throw new Error(`Failed to create tag: ${error}`);
    }
  };

  pushCommit = async (branch: string) => {
    try {
      await this.git.push(['origin', branch]);
    } catch (error) {
      throw new Error(`Failed to push commit: ${error}`);
    }
  };

  pushTag = async (tag: string) => {
    try {
      await this.git.push(['origin', tag]);
    } catch (error) {
      throw new Error(`Failed to push tag: ${error}`);
    }
  };
}
