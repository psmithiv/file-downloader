import ChunkDownloader from "./chunk.downloader";
import chalk from "chalk";
import * as Q from 'q';
import Config from "../const/config";
import * as fs from "fs";
const concat = require('concat-files');

export default class Downloader {

    /**
     * Number of chunks to download
     */
    private chunks: number = 0;

    /**
     * Output file name
     */
    private output: string = '';

    /**
     * Initialize chunk downloader(s). Once all chunks are downloaded, merge
     * @param {string} url
     * @param {number} chunks
     * @param {string} output
     * @param {number} chunkSize
     */
    download(url: string, chunks: number, output: string, chunkSize: number) {
        console.log('Downloading file chunks...');

        this.chunks = chunks;
        this.output = output;

        let promises = [];

        for (let i: number = 0; i < chunks; i++) {
            const cd: ChunkDownloader = new ChunkDownloader();
            promises.push(cd.downloadChunk(url, output, chunkSize, i));
        }

        Q.all(promises)
            .then(() => {
                    console.log(chalk.green(`Download complete.`));
                    this.concatFiles();
                },
                (err) => {
                    console.log(chalk.red(`Download error: ${err}`));
                })
    }

    /**
     * Build file list, merge files, and delete parts
     */
    private concatFiles() {
        console.log('Concatenating chunks...');

        let files: string[] = [];

        for (let i: number = 0; i < this.chunks; i++) {
            files.push(`${this.output}.${Config.CHUNK_SUFFIX}${i+1}`)
        }

        concat(files, this.output, () => {
            console.log(chalk.green('Chunks Merged.'));
            this.cleanUpChunks(files);
        })
    }

    /**
     * Delete chunks now that files have been merged
     * @param {string[]} files
     */
    private cleanUpChunks(files: string[]) {
        console.log('Cleaning up chunks...');

        for (let i: number = 0; i < files.length; i++) {
            fs.unlinkSync(files[i]);
        }

        console.log(chalk.green('Chunks Deleted.'))
    }
}