import fs from 'fs';
import path from 'path';
import * as process from 'process';

export function loadJsonTestConfig<T>(fileName: string) {
    const currentDirectory = process.cwd();
    // const dataPath = path.resolve(__dirname, '../../test-data/', fileName);
    const dataPath = path.resolve(currentDirectory, 'test-data', fileName);
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(jsonData) as T;
}
