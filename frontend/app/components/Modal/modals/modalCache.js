// import React, { Component } from 'react'
// import cx from 'classnames'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'

import {
  Prompt,
  Confirm,
  Alert,
  SettingsView,
  CommandPalette,
  FilePalette,
  GitCommitView,
  GitStashView,
  GitUnstashView,
  GitResetView,
  GitTagView,
  GitMergeView,
  GitNewBranchView,
  GitRebaseStart,
  GitResolveConflictsView,
  GitMergeFileView,
  GitDiffFileView,
  GitRebasePrepare,
  GitRebaseInput,
  GitCommitDiffView,
  GitCheckoutView,
  GitCheckoutStashView,
  FileSelectorView,
  Form,
} from './index'


const modalCache = observable.map({
  Form,
  GitCommit: GitCommitView,
  GitResolveConflicts: GitResolveConflictsView,
  GitCommitDiff: GitCommitDiffView,
  GitStash: GitStashView,
  GitUnstash: GitUnstashView,
  GitTag: GitTagView,
  GitMerge: GitMergeView,
  GitNewBranch: GitNewBranchView,
  GitResetHead: GitResetView,
  GitRebaseStart,
  GitRebasePrepare,
  GitRebaseInput,
  GitMergeFile: GitMergeFileView,
  GitCheckout: GitCheckoutView,
  GitCheckoutStash: GitCheckoutStashView,
  Prompt,
  Confirm,
  Alert,
  CommandPalette,
  FilePalette,
  Settings: SettingsView,
  FileSelectorView,
  GitDiffFile: GitDiffFileView,
})

window.modalCache = modalCache

export default modalCache
