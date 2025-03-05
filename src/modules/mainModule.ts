import chalk from 'chalk';
import { CliModule } from './cliModule';
import { GitModule } from './gitModule';
import { VersionFileModule } from './versionFileModule';

export class MainModule {
  cliModule = new CliModule();
  versionFileModule = new VersionFileModule(this.cliModule);
  gitModule = new GitModule(this.cliModule);

  stateToMessageTitle = {
    isVersionFileChanged: 'New version is:',
    isCommitCreated: 'Change committed:',
    isTagCreated: 'New tag is:',
    isCommitPushed: 'Commit pushed to:',
    isTagPushed: 'Tag pushed:',
  };

  state: Record<string, string> = {
    isVersionFileChanged: 'No',
    isCommitCreated: 'No',
    isTagCreated: 'No',
    isCommitPushed: 'No',
    isTagPushed: 'No',
  };

  reportState() {
    const { getSuccessPrefix, getWarningPrefix, showMessage } = this.cliModule;
    const successPrefix = getSuccessPrefix();
    const warningPrefix = getWarningPrefix();
    const state = Object.entries(this.state);

    showMessage('\nRecap:', 'info');

    for (const [key, value] of state) {
      const messageTitle = this.stateToMessageTitle[key];
      const isSuccessfulValue = value !== 'No';
      if (isSuccessfulValue) {
        const message = `${successPrefix} ${messageTitle} ${chalk.bold(value)}`;
        showMessage(message, 'info');
      } else {
        const message = `${warningPrefix} ${messageTitle} ${chalk.bold(value)}`;
        showMessage(message, 'info');
      }
    }
  }

  async run() {
    const {
      getIsQuick,
      getIsVerbose,
      showMessage,
      getSuccessPrefix,
      promptForConfirmation,
      promptForInput,
    } = this.cliModule;

    const {
      getBranch,
      createCommit,
      createTag,
      createTagName,
      add,
      createCommitMessage,
      pushCommit,
      pushTag,
    } = this.gitModule;

    const {
      findVersionFilePath,
      getVersionFileData,
      parseVersion,
      isVersionFileExist,
      updateVersionFile,
      updateVersionFileData,
      versionFileName,
    } = this.versionFileModule;

    try {
      const isVerbose = getIsVerbose();
      const isQuick = getIsQuick();

      if (isVerbose) {
        showMessage(`${getSuccessPrefix()} Verbose mode is enabled`, 'info');
      }

      if (isQuick) {
        showMessage(`${getSuccessPrefix()} Quick mode is enabled`, 'info');
      }

      const versionFilePath = findVersionFilePath();

      showMessage(`Expected version file path: ${versionFilePath}`, 'verbose');

      const isVersionFileExists = isVersionFileExist(versionFilePath);

      if (isVersionFileExists) {
        showMessage(`Version file is found at: ${versionFilePath}`, 'verbose');
        const versionFileData = getVersionFileData(versionFilePath);
        const currentVersion = parseVersion(versionFileData);

        showMessage(`Current version is: ${currentVersion}`, 'verbose');

        const newVersion = await promptForInput(
          'Press tab to change version:',
          currentVersion
        );

        showMessage(`Selected version: ${newVersion}`, 'verbose');

        const isUpdateVersionFile = await promptForConfirmation(
          `Update version file with ${newVersion}?`,
          true,
          isQuick
        );

        showMessage(
          `User selected to update version file: ${isUpdateVersionFile}`,
          'verbose'
        );

        if (!isUpdateVersionFile) {
          return;
        }

        const newVersionFileData = updateVersionFileData(
          versionFileData,
          newVersion
        );

        updateVersionFile(versionFilePath, newVersionFileData);

        showMessage(
          `Version file is updated with version: ${newVersion}`,
          'verbose'
        );

        this.state.isVersionFileChanged = newVersion;

        const currentBranch = await getBranch();

        showMessage(`Current branch is: ${currentBranch}`, 'verbose');

        const isCreateCommit = await promptForConfirmation(
          `Commit changed version file to ${currentBranch} branch?`,
          true,
          isQuick
        );

        showMessage(
          `User selected to create commit: ${isCreateCommit}`,
          'verbose'
        );

        if (isCreateCommit) {
          const commitMessage = createCommitMessage(newVersion);
          showMessage(`Commit message is: ${commitMessage}`, 'verbose');

          await add(versionFileName);
          showMessage('Version file is added to stage', 'verbose');
          await createCommit(commitMessage);
          showMessage('Version file is committed', 'verbose');
          this.state.isCommitCreated = 'Yes';

          const isPushCommit = await promptForConfirmation(
            `Push ${currentBranch} branch to origin?`,
            true,
            isQuick
          );

          showMessage(
            `User selected to push commit: ${isPushCommit}`,
            'verbose'
          );

          if (isPushCommit) {
            await pushCommit(currentBranch);
            showMessage(`Commit is pushed to ${currentBranch}`, 'verbose');
            this.state.isCommitPushed = currentBranch;
          }
        }

        const tagName = createTagName(newVersion);
        const isCreateTag = await promptForConfirmation(
          `Create ${tagName} tag?`,
          true,
          isQuick
        );

        showMessage(`User selected to create tag ${tagName}`, 'verbose');

        if (isCreateTag) {
          await createTag(tagName);
          showMessage(`Tag ${tagName} is created`, 'verbose');
          this.state.isTagCreated = tagName;

          const isPushTag = await promptForConfirmation(
            'Push tag to origin?',
            true,
            isQuick
          );

          showMessage(`User selected to push tag: ${isPushTag}`, 'verbose');

          if (isPushTag) {
            await pushTag(tagName);
            showMessage('Tag is pushed', 'verbose');
            this.state.isTagPushed = 'Yes';
          }
        }
      }
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      this.reportState();
    }
  }
}
