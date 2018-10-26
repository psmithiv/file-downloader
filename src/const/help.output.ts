import Config from "./config";

export const HelpOutput = `
File Downloader Tool

Usage: cli [options]
    
Options:
    -h --help            Show help screen
    -v --version         Show version
    -u --url             Url of file to download [default: ${Config.URL}] 
    -c --chunks          Number of chunks to download [default: ${Config.CHUNKS}]
    -o --output          Output file name
    -s --size            Size of chunks to download (in bytes) [default: ${Config.CHUNK_SIZE}]
`;

export default HelpOutput;