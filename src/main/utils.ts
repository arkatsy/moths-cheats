import os from 'os'
import fs from 'fs'
import { execFileSync } from 'child_process'
import path from 'path'
import { HeaderJson, InfoJson, PlayerJson } from '../shared/jsons'

export const isDev = process.env['NODE_ENV'] === 'development'
export const isProd = process.env['NODE_ENV'] === 'production'

export const rootPath = path.join(__dirname, '..', '..')
export const vaultcPath = path.join(rootPath, 'vaultc.exe')
export const homePath = os.homedir()
export const appDataPath = path.join(homePath, 'AppData')
export const tempPath = path.join(appDataPath, 'Local', 'Temp')
export const fomSavesPath = path.join(appDataPath, 'Local', 'FieldsOfMistria', 'saves')
export const tempSavesPath = path.join(tempPath, 'moths-cheats')

export const jsonFileNames = [
  'beach',
  'checksums',
  'deep_woods',
  'earth_seal',
  'eastern_road',
  'farm',
  'fire_seal',
  'game_stats',
  'gamedata',
  'haydens_farm',
  'header',
  'info',
  'narrows',
  'npcs',
  'player',
  'player_home',
  'quests',
  'summit',
  'town',
  'water_seal',
  'western_ruins'
] as const

/**
 * @desc Reads and parses a JSON file from a given path synchronously
 * @param filePath The path to the JSON file
 * @returns The parsed JSON object
 */
export function readJsonFile<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
}

/**
 * @desc Serializes and writes data to a JSON file synchronously
 * @param filePath The path to the file
 * @param data The data to be written to the file
 */
export function writeJsonFile(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

/**
 * @desc Parses the `info.json` file from an unpacked save directory
 * @param unpackedPath The path to the unpacked save directory
 * @returns The parsed `info.json` object
 */
export function parseInfoJson(unpackedPath: string) {
  return readJsonFile<InfoJson>(unpackedPath)
}

/**
 * @desc Parses the `header.json` file from an unpacked save directory
 * @param unpackedPath The path to the unpacked save directory
 * @returns The parsed `header.json` object
 */
export function parseHeaderJson(unpackedPath: string) {
  return readJsonFile<HeaderJson>(unpackedPath)
}

/**
 * @desc Parses the `player.json` file from an unpacked save directory
 * @param unpackedPath The path to the unpacked save directory
 * @returns The parsed `player.json` object
 */
export function parsePlayerJson(unpackedPath: string) {
  return readJsonFile<PlayerJson>(unpackedPath)
}

/**
 * @desc Deletes a directory if exists
 * @param dirPath The path to the directory to be deleted
 */
export function deleteDirIfExists(dirPath: string) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true })
  }
}

/**
 * @desc Reads all the save files from the game's save directory (`fomSavesPath`) and returns their absolute paths
 * @returns An array with the absolute paths to all the save files in the game's save directory (`fomSavesPath`)
 */
export function readFomSaves() {
  return fs
    .readdirSync(fomSavesPath)
    .filter((file) => file.endsWith('.sav'))
    .map((file) => path.join(fomSavesPath, file))
}

/**
 * @desc The tool from NPC Studio for packing and unpacking save files
 * @link https://github.com/NPC-Studio/vaultc
 */
export const vaultc = {
  /**
   * @desc Packs a save file (a directory with the unpacked json files) into a single `.sav` file
   * @param savefilePath The path to the `.sav` file to be created
   * @param unpackDirPath The path to the directory containing the unpacked json files
   */
  packSave: (savefilePath: string, unpackDirPath: string) => {
    execFileSync(vaultcPath, ['pack', savefilePath, unpackDirPath])
  },
  /**
   * @desc Unpacks a save file (a `.sav` file) into a directory with the unpacked json files
   * @param savefilePath The path to the `.sav` file to be unpacked
   * @param unpackDirPath The path to the directory where the unpacked json files will be saved
   */
  unpackSave: (savefilePath: string, unpackDirPath: string) => {
    execFileSync(vaultcPath, ['unpack', savefilePath, unpackDirPath])
  }
}

/**
 * @desc Extracts the saveId from a save file path
 * @param savePath The absolute path to a save file
 * @returns The saveId extracted from the save file path
 * @example getSaveIdFromPath('C:/Users/username/AppData/Local/FieldsOfMistria/saves/game-1292331906-835634871.sav')
 * // returns 'game-1292331906-835634871'
 */
export function getSaveIdFromPath(savePath: string) {
  return path.basename(savePath).replace('.sav', '')
}

/**
 * @desc Gets the path to the directory where a save file should be unpacked
 * @param saveId The saveId extracted from the save file path (see the `getSaveIdFromPath` function)
 * @returns The path to the directory where the save file should be unpacked
 */
export function getUnpackPathFromSaveId(saveId: string) {
  return path.join(tempSavesPath, saveId)
}

/**
 * @summary A cache with path info about the unpacked saves.
 * @desc It's a Map where:
 * - the key is the saveId (see the `getSaveIdFromPath` function)
 * - the value is an object with the unpacked save info (see the `UnpackedSavePathInfo` type)
 * It doesn't contain any parsed data, just paths to the unpacked files.
 */
export const unpackedSavesPathsCache = new Map<string, UnpackedSavePathInfo>()
export type UnpackedSavePathInfo = {
  unpackPath: string
  saveId: string
  fomSavePath: string
  jsonPaths: {
    [Name in (typeof jsonFileNames)[number]]: string
  }
}

/**
 * @desc Unpacks all the save files from the game's save directory (`fomSavesPath`) to a temporary directory (`tempSavesPath`)
 * It also updates the `unpackedSavesPathsCache` with the new unpacked save info.
 */
export function unpackSavesToTemp() {
  deleteDirIfExists(tempSavesPath)

  const fomSaves = readFomSaves()

  for (const fomSavePath of fomSaves) {
    const saveId = getSaveIdFromPath(fomSavePath)
    const unpackDirPath = getUnpackPathFromSaveId(saveId)

    deleteDirIfExists(unpackDirPath)

    vaultc.unpackSave(fomSavePath, unpackDirPath)

    const unpackedSaveInfo: UnpackedSavePathInfo = {
      unpackPath: unpackDirPath,
      fomSavePath: fomSavePath,
      saveId,
      jsonPaths: {
        beach: path.join(unpackDirPath, 'beach.json'),
        checksums: path.join(unpackDirPath, 'checksums.json'),
        deep_woods: path.join(unpackDirPath, 'deep_woods.json'),
        earth_seal: path.join(unpackDirPath, 'earth_seal.json'),
        eastern_road: path.join(unpackDirPath, 'eastern_road.json'),
        farm: path.join(unpackDirPath, 'farm.json'),
        fire_seal: path.join(unpackDirPath, 'fire_seal.json'),
        game_stats: path.join(unpackDirPath, 'game_stats.json'),
        gamedata: path.join(unpackDirPath, 'gamedata.json'),
        haydens_farm: path.join(unpackDirPath, 'haydens_farm.json'),
        header: path.join(unpackDirPath, 'header.json'),
        info: path.join(unpackDirPath, 'info.json'),
        narrows: path.join(unpackDirPath, 'narrows.json'),
        npcs: path.join(unpackDirPath, 'npcs.json'),
        player: path.join(unpackDirPath, 'player.json'),
        player_home: path.join(unpackDirPath, 'player_home.json'),
        quests: path.join(unpackDirPath, 'quests.json'),
        summit: path.join(unpackDirPath, 'summit.json'),
        town: path.join(unpackDirPath, 'town.json'),
        water_seal: path.join(unpackDirPath, 'water_seal.json'),
        western_ruins: path.join(unpackDirPath, 'western_ruins.json')
      }
    }

    unpackedSavesPathsCache.set(saveId, unpackedSaveInfo)
  }
}

/**
 * @desc Updates a value in a JSON file (Needs to be tested for arrays. It should work I think?!)
 * @param filePath The path to the JSON file
 * @param key The key to be updated in the JSON file. It can also be a nested key separated by dots (e.g. 't2_world_facts.ari_name')
 * @param value The new value to be set
 */
export function updateJsonValue(filePath: string, key: string, value: string | number) {
  const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const keys = key.split('.')

  let current = file

  for (let i = 0; i < keys.length - 1; i++) {
    let key = keys[i]

    if (!current[key]) {
      current[key] = {}
    }

    current = current[key]
  }

  current[keys[keys.length - 1]] = value

  writeJsonFile(filePath, file)
}
