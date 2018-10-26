import * as Q from 'q';
import request = require("request");
import * as fs from "fs";
import Config from "../const/config";

const progress = require('request-progress');

export default class ChunkDownloader {

    /**
     * Download individual chunk of file
     * @param {string} url
     * @param {string} output
     * @param {number} chunkSize
     * @param {number} index
     * @returns {Q.Promise<any>}
     */
    downloadChunk(url: string, output: string, chunkSize: number, index: number) {
        const deferred = Q.defer();

        const start = ((chunkSize - 1) * index) + index;
        const end = start + (chunkSize - 1);

        const req = request({
            url: url,
            headers: {
                'Range': `bytes=${start}-${end}`
            }
        });

        progress(req, {})
            .on('error', (err: any) => {
                // console.log('err: ', err);
                deferred.reject(err);
            })
            .on('end', () => {
                // console.log('end');
                deferred.resolve();
            })
            .pipe(fs.createWriteStream(`${output}.${Config.CHUNK_SUFFIX}${index+1}`));

        return deferred.promise;
    }
}