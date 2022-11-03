/**
 * Represent a file with its git status.
 */
import { FileInformation } from 'leto-modelizer-plugin-core';

class FileStatus extends FileInformation {
  /**
   * Default constructor.
   * @param {Number} props.headStatus - The HEAD status is either absent (0) or present (1).
   * @param {Number} props.workdirStatus - The WORKDIR status is either absent (0), identical to
   * HEAD (1), or different from HEAD (2).
   * @param {Number} props.stageStatus - The STAGE status is either absent (0), identical to
   * HEAD (1), identical to WORKDIR (2), or different from WORKDIR (3).
   */
  constructor(props = {
    headStatus: -1,
    workdirStatus: -1,
    stageStatus: -1,
  }) {
    super(props);
    const head = props.headStatus === undefined ? -1 : props.headStatus;
    const workdir = props.workdirStatus === undefined ? -1 : props.workdirStatus;
    const stage = props.stageStatus === undefined ? -1 : props.stageStatus;
    this.matrix = `${head}${workdir}${stage}`;
    this.isUntracked = ['000', '003', '020'].includes(this.matrix);
    this.isNew = ['020'].includes(this.matrix);
    this.isAdded = ['022', '023'].includes(this.matrix);
    this.isStaged = ['022', '023', '100', '122', '123'].includes(this.matrix);
    this.hasUnstagedChanged = ['023', '103', '113', '121', '122', '123'].includes(this.matrix);
    this.isDeleted = ['100', '101'].includes(this.matrix);
    this.isUnstaged = ['101', '110', '120', '121'].includes(this.matrix);
    this.isUnmodified = ['111'].includes(this.matrix);
    this.isIgnored = ['-1-1-1'].includes(this.matrix);
  }

  /**
   * Get status of file.
   * @return {String} Name of status class.
   */
  get status() {
    if (this.isStaged && !this.hasUnstagedChanged) {
      return 'file-status-staged';
    }
    if (this.hasUnstagedChanged) {
      return 'file-status-modified';
    }
    if (this.isUnstaged) {
      return 'file-status-unstaged';
    }
    if (this.isUntracked) {
      return 'file-status-untracked';
    }
    return 'file-status-unmodified';
  }
}
export default FileStatus;
