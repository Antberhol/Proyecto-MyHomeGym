import { db } from '../lib/db'
import type { RoutineFolder } from '../types/models'

export const routineFolderRepository = {
    async listFolders(): Promise<RoutineFolder[]> {
        return db.getAllRoutineFolders()
    },

    async createFolder(folder: RoutineFolder): Promise<string> {
        const now = new Date().toISOString()
        return db.addRoutineFolder({
            ...folder,
            updatedAt: folder.updatedAt ?? now,
            isSynced: false,
        })
    },

    async updateFolder(folderId: string, changes: Partial<RoutineFolder>): Promise<number> {
        const now = new Date().toISOString()
        return db.updateRoutineFolder(folderId, {
            ...changes,
            updatedAt: changes.updatedAt ?? now,
        })
    },

    async deleteFolder(folderId: string): Promise<void> {
        await db.deleteRoutineFolder(folderId)
    },
}
