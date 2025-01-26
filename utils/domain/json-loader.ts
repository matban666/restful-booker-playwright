// Utility to load json test data from a file for the given name and type
import fs from 'fs';
import path from 'path';
import * as process from 'process';

export function loadJsonTestConfig<T>(fileName: string) {
    const currentDirectory = process.cwd();
    const dataPath = path.resolve(currentDirectory, 'test-data', fileName);
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(jsonData) as T;
}
