import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import * as BrowserFS from 'browserfs';
import Branch from 'src/models/git/Branch';
import FileStatus from 'src/models/git/FileStatus';
import { saveProject } from 'src/composables/Project';

const fs = BrowserFS.BFSRequire('fs');

/**
 * Initialize a new repository.
 * @param {string} projectId - Id of project.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitInit(projectId) {
  return git.init({ fs, dir: `/${projectId}` });
}

/**
 * Clone and save project from git in local storage.
 * @param {Project} project - Project to save.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function importProject(project) {
  return git.clone({
    fs,
    http,
    url: project.git.repository,
    dir: `/${project.id}`,
    onAuth: () => ({
      username: project.git.username,
      password: project.git.token,
    }),
    corsProxy: '/cors-proxy',
    singleBranch: true,
    depth: 1,
  }).then(() => saveProject(project));
}

/**
 * Fetch project on git.
 * Warning: It seems that `git.fetch` can throw unexpected error.
 * @param {Project} project - Project to update.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitFetch(project) {
  if (project.git?.repository) {
    return git.fetch({
      fs,
      http,
      url: project.git.repository,
      dir: `/${project.id}`,
      onAuth: () => ({
        username: project.git.username,
        password: project.git.token,
      }),
      corsProxy: '/cors-proxy',
    });
  }
  return Promise.resolve();
}

/**
 * Get current branch of git project.
 * @param {string} projectId - Id of project.
 * @returns {Promise<string>} Promise with current branch name on success otherwise error.
 */
export async function getCurrentBranch(projectId) {
  return git.currentBranch({
    fs,
    dir: `/${projectId}`,
    fullname: false,
  });
}

/**
 * Get all branches of project.
 * @param {string} projectId - Id of project.
 * @returns {Promise<Branch[]>} Promise with array of branches on success otherwise error.
 */
export async function getBranches(projectId) {
  const dir = `/${projectId}`;

  const [local, remote] = await Promise.all([
    git.listBranches({
      fs,
      dir,
    }),
    git.listBranches({
      fs,
      dir,
      remote: 'origin',
    }),
  ]);

  const branches = local.map((localBranch) => (new Branch({
    name: localBranch,
    onLocal: true,
    onRemote: remote.includes(localBranch),
    remote: 'origin',
  })));

  // TODO: remove this when https://github.com/isomorphic-git/isomorphic-git/issues/1650 is resolve.
  if (branches.length === 0) {
    const currentBranch = await getCurrentBranch(projectId);
    branches.push(new Branch({
      name: currentBranch,
      onLocal: true,
      onRemote: false,
      remote: 'origin',
    }));
  }

  return branches.concat(
    remote
      .filter((remoteBranch) => !local.includes(remoteBranch))
      .map((remoteBranch) => (new Branch({
        name: remoteBranch,
        onLocal: false,
        onRemote: true,
        remote: 'origin',
      }))),
  ).filter(({ name }) => name !== 'HEAD');
}

/**
 * Get list of all the files in the current staging area.
 * @param {string} projectId - Id of the project.
 * @returns {Promise<string[]>} Promise with array of filepaths on success otherwise an error.
 */
export async function gitListFiles(projectId) {
  return git.listFiles({
    fs,
    dir: `/${projectId}`,
  });
}

/**
 * Update remote origin, fetch and checkout the default branch.
 * @param {Project} project - Project to update.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitAddRemote(project) {
  await git.addRemote({
    fs,
    dir: `/${project.id}`,
    url: project.git.repository,
    remote: 'origin',
    force: true,
  });
}

/**
 * Checkout branch.
 * @param {string} projectId - Id of project.
 * @param {string} branch - Branch name to checkout.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitCheckout(projectId, branch) {
  await git.checkout({
    fs,
    dir: `/${projectId}`,
    ref: branch,
  }).catch(({ name }) => Promise.reject({ name }));
}

/**
 * Create branch from another branch.
 * @param {string} projectId - Id of project.
 * @param {string} newBranchName - New branch name.
 * @param {string} branchName - Branch name.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function createBranchFrom(projectId, newBranchName, branchName) {
  await git.branch({
    fs,
    dir: `/${projectId}`,
    ref: newBranchName,
    object: branchName,
  }).catch(({ name, message }) => {
    if (message.indexOf('ENOTDIR: File is not a directory.') >= 0) {
      return Promise.reject({ name: 'cannotLockRef', message });
    }
    return Promise.reject({ name, message });
  });
}

/**
 * Add untracked, unstaged or modified files.
 * @param {string} projectId - Id of project.
 * @param {string} filepath - Path of the file to add.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitAdd(projectId, filepath) {
  return git.add({
    fs,
    dir: `/${projectId}`,
    filepath,
  });
}

/**
 * Add (stage) deleted files.
 * @param {string} projectId - Id of project.
 * @param {string} filepath - Path of the file to add.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitRemove(projectId, filepath) {
  return git.remove({
    fs,
    dir: `/${projectId}`,
    filepath,
  });
}

/**
 * Update selected branch with git pull.
 * @param {Project} project - Project to update.
 * @param {string} branchName - Branch name.
 * @param {boolean} fastForward - State of fast forward option.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitUpdate(project, branchName, fastForward) {
  await git.pull({
    fs,
    http,
    dir: `/${project.id}`,
    ref: branchName,
    fastForward,
    singleBranch: true,
    onAuth: () => ({
      username: project.git.username,
      password: project.git.token,
    }),
    // TODO: Change when we have user information.
    author: {
      name: 'LetoModelizer',
      email: 'LetoModelizer@no-reply.com',
    },
    corsProxy: '/cors-proxy',
  });
}

/**
 * Get the status of all files. If filePaths is defined, get the status of the files
 * that strictly or partially match the given filePaths.
 * @param {string} projectId - Id of project.
 * @param {string[]} filepaths - Limit the query to the given files and directories.
 * @param {Function} filter - Filter to only return results whose filepath matches a given function.
 * @returns {Promise<FileStatus[]>} All files status.
 */
export async function getStatus(projectId, filepaths, filter) {
  return git.statusMatrix({
    fs,
    dir: `/${projectId}`,
    filepaths,
    filter,
  }).then((files) => files
    .map((file) => new FileStatus({
      path: file[0],
      headStatus: file[1],
      workdirStatus: file[2],
      stageStatus: file[3],
    })));
}

/**
 * Push selected branch on server.
 * @param {Project} project - Project.
 * @param {string} branchName - Branch name.
 * @param {boolean} force - State of force option.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitPush(project, branchName, force) {
  await git.push({
    fs,
    http,
    dir: `/${project.id}`,
    remote: 'origin',
    ref: branchName,
    force,
    onAuth: () => ({
      username: project.git.username,
      password: project.git.token,
    }),
    corsProxy: '/cors-proxy',
  });
}

/**
 * Commit all staged files.
 * @param {string} projectId - Id of project.
 * @param {string} message - Commit message.
 * @param {boolean} noUpdateBranchValue - If true, does not update the branch pointer
 * after creating the commit.
 * @returns {Promise<void>} Promise with the SHA-1 object id of the newly created commit on success
 * otherwise an error.
 */
export async function gitCommit(projectId, message, noUpdateBranchValue = false) {
  return git.commit({
    fs,
    dir: `/${projectId}`,
    noUpdateBranch: noUpdateBranchValue,
    // TODO: Change when we have user information.
    author: {
      name: 'LetoModelizer',
      email: 'LetoModelizer@no-reply.com',
    },
    message,
  });
}

/**
 * Add and commit all modifications on the new branch and push it.
 * @param {object} project - Object containing all information about the project.
 */
export async function gitGlobalUpload(project) {
  const nowDate = new Date();
  const newBranch = `leto-modelizer_${nowDate.getTime()}`;
  const files = (await getStatus(project.id));
  const modifiedFiles = files
    .filter((file) => file.hasUnstagedChanged
      || file.isUntracked
      || file.isUnstaged
      || file.isStaged)
    .map((file) => file.path);

  await gitAdd(project.id, modifiedFiles);

  /* Special case for deleted files.
  Unlike usual git, we CAN NOT add (git add) a deleted file,
  so here, the idea is to use the remove method of isomorphic-git to stage the
  deleted files.
  cf: https://github.com/isomorphic-git/isomorphic-git/issues/1099
  */
  const deletedfiles = files.filter((file) => file.isDeleted).map((file) => file.path);

  await gitRemove(project.id, deletedfiles);

  /*
  Commiting BEFORE creating a new branch.
  Again, due to some specific behavior in isomorphic-git, the modifications are not
  transfered (unlike usual git) while creating a new branch or doing a checkout.

  Creating the (orphan) commit before, give the possibility to create a new branch from that commit.
  Which will contains all modifications AND will be attached to the newly created branch.
  */
  const sha1 = await gitCommit(
    project.id,
    `leto-modelizer ${nowDate.toDateString()}`,
    true,
  );

  await createBranchFrom(
    project.id,
    newBranch,
    sha1,
  );
  await gitCheckout(project.id, newBranch);
  await gitPush(
    project,
    newBranch,
    true,
  );
}

/**
 * Get all logs from git log.
 * @param {string} projectId - Id of project.
 * @param {string} ref - The commit to begin walking backwards through the history from.
 * @param {number} [depth] - Number of log to retrieve.
 * @returns {Promise<ReadCommitResult[]>} Promise with logs on success otherwise an error.
 * @see https://isomorphic-git.org/docs/en/log
 */
export async function gitLog(projectId, ref, depth = 25) {
  return git.log({
    fs,
    dir: `/${projectId}`,
    depth,
    ref,
  });
}
