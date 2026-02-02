import { rename } from "fs/promises";

await rename("dist/main.d.ts", "dist/skotch.d.ts");
