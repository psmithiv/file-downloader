import './pollyfills';
import minimist = require("minimist");
import HelpOutput from "./src/const/help.output";
import Config from "./src/const/config";
import Downloader from "./src/downloader/downloader";

class Main {

    /**
     * @constructor
     * Application main entry point
     */
    constructor() {
        this.processArgs();
    }

    /**
     * Process commandline arguments and pass to downloader
     */
    private processArgs() {
        const args = minimist(process.argv.slice(2), {
            boolean: ['version', 'help'],
            alias: { h: 'help', v: 'version', u: 'url', c: 'chunks', o: 'output', s: 'size'}
        });

        switch (true) {
            case args.v:
                console.log(`v${Config.VERSION}`);
                break;

            case args.h:
                console.log(HelpOutput);
                break;

            default:
                const ds = new Downloader();
                ds.download(
                    args.url || Config.URL,
                    args.c ? args.c: Config.CHUNKS,
                    args.o ? args.o : Config.OUTPUT,
                    args.s ? args.s : Config.CHUNK_SIZE
                )
        }
    }
}

export default new Main();
