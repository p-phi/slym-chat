import { promises as fs } from "node:fs";
import { join } from "node:path";
import { BUNDLES_DIR } from "./config.js";

export type Bundle = { name: string; path: string };

export async function listBundles(): Promise<Bundle[]> {
    const names = await fs.readdir(BUNDLES_DIR).catch(() => []);
    const bundles: Bundle[] = [];
    for (const name of names) {
        const path = join(BUNDLES_DIR, name);
        const st = await fs.stat(path).catch(() => null);
        if (st?.isDirectory()) bundles.push({ name, path });
    }
    return bundles;
}
