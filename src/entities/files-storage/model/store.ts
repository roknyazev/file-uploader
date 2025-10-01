import { makeAutoObservable, runInAction } from 'mobx'
import type { FileEntry } from './types.ts'
import { autoBind } from '@/shared/lib/autoBind.ts'

const STORAGE_KEY = 'files'

export class FilesStore {
  private filesInner: FileEntry[] = []

  constructor() {
    autoBind(this)
    makeAutoObservable(this)

    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        this.filesInner = JSON.parse(raw)
      } catch {
        this.filesInner = []
      }
    }

    window.addEventListener('storage', e => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const parsed = JSON.parse(e.newValue)
        runInAction(() => {
          this.filesInner = parsed
        })
      }
    })
  }

  get files() {
    return this.filesInner.toSorted()
  }

  addFile(fileEntry: FileEntry) {
    if (this.filesInner.filter(entry => entry.name === fileEntry.name).length > 0) return
    this.filesInner.push(fileEntry)
    this.commit()
  }

  clear() {
    this.filesInner = []
    this.commit()
  }

  private commit() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.filesInner))
    } catch (e) {
      console.error(e)
    }
  }
}

export const filesStore = new FilesStore()
