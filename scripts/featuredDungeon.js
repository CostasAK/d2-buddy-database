import { readFileSync, writeFileSync } from "fs";

import { bungieApi } from "../functions/query.js";

let featuredDungeon = JSON.parse(
  readFileSync("./data/featuredDungeon.json", "utf8")
);

if (!(featuredDungeon?.schedule?.[0]?.end >= Date.now())) {
  bungieApi("/Destiny2/Milestones/").then((data) => {
    console.log(data?.["1742973996"]);

    const start = new Date(data?.["1742973996"]?.startDate).getTime();
    const end = new Date(data?.["1742973996"]?.endDate).getTime();
    const period = end - start;

    bungieApi(
      "/Destiny2/Manifest/DestinyActivityDefinition/" +
        data?.["1742973996"]?.activities?.[0]?.activityHash
    ).then((data) => {
      const name = data?.displayProperties?.name;
      console.log(name);

      featuredDungeon.schedule.unshift({ start, end, period, name });

      writeFileSync(
        "./data/featuredDungeon.json",
        JSON.stringify(featuredDungeon)
      );
    });
  });
}
