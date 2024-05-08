import { readdir } from "node:fs/promises";
import { file, gzipSync } from "bun";


const printSize = async (dictionary: string) => {
  const items = await readdir(dictionary, { withFileTypes: true });
  const filesLength = items.length;

  for (let i = 0; i < filesLength; ++i) {
    const item = items[i];
    const path = `${dictionary}/${item.name}`;

    if (item.isFile()) {
      if(item.name.endsWith("js")) {
        const fileHandler = file(path);
        const arrBuffer = await fileHandler.arrayBuffer();
        const gzip = gzipSync(arrBuffer);

        console.log(`${path} - ${gzip.byteLength} B`);
      }
    } else {
      await printSize(path);
    }
  }
};

(async () => {
  await printSize("./dist");
})();
