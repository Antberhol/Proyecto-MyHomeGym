import { readFile } from 'node:fs/promises'
import path from 'node:path'

type JsonValue = null | boolean | number | string | JsonObject | JsonValue[]
interface JsonObject {
    [key: string]: JsonValue
}

function isPlainObject(value: JsonValue): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function flattenKeys(value: JsonValue, prefix = ''): string[] {
    if (!isPlainObject(value)) {
        return prefix ? [prefix] : []
    }

    const keys: string[] = []
    for (const [key, child] of Object.entries(value)) {
        const next = prefix ? `${prefix}.${key}` : key
        if (isPlainObject(child)) {
            keys.push(...flattenKeys(child, next))
        } else {
            keys.push(next)
        }
    }

    return keys
}

function diffKeys(source: Set<string>, target: Set<string>): string[] {
    const missing: string[] = []
    for (const key of source) {
        if (!target.has(key)) missing.push(key)
    }
    return missing.sort()
}

async function readJson(filePath: string): Promise<JsonObject> {
    const raw = await readFile(filePath, 'utf8')
    return JSON.parse(raw) as JsonObject
}

async function main() {
    const root = process.cwd()
    const esPath = path.join(root, 'src', 'locales', 'es.json')
    const enPath = path.join(root, 'src', 'locales', 'en.json')

    const [es, en] = await Promise.all([readJson(esPath), readJson(enPath)])

    const esKeys = new Set(flattenKeys(es))
    const enKeys = new Set(flattenKeys(en))

    const missingInEn = diffKeys(esKeys, enKeys)
    const missingInEs = diffKeys(enKeys, esKeys)

    if (missingInEn.length === 0 && missingInEs.length === 0) {
        // eslint-disable-next-line no-console
        console.log(`i18n OK: ${esKeys.size} keys match between es.json and en.json`)
        return
    }

    // eslint-disable-next-line no-console
    console.error('i18n key mismatch detected.')

    if (missingInEn.length > 0) {
        // eslint-disable-next-line no-console
        console.error(`\nMissing in en.json (${missingInEn.length}):`)
        for (const key of missingInEn) {
            // eslint-disable-next-line no-console
            console.error(`- ${key}`)
        }
    }

    if (missingInEs.length > 0) {
        // eslint-disable-next-line no-console
        console.error(`\nMissing in es.json (${missingInEs.length}):`)
        for (const key of missingInEs) {
            // eslint-disable-next-line no-console
            console.error(`- ${key}`)
        }
    }

    process.exitCode = 1
}

void main()
