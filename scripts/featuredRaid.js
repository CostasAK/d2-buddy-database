import { readFileSync, writeFileSync } from "fs";

import { bungieApi } from "../functions/query.js";

let featuredRaid = JSON.parse(readFileSync("./data/featuredRaid.json", "utf8"));

if (!(featuredRaid?.schedule?.[0]?.end >= Date.now())) {
  bungieApi(
    "/Destiny2/Armory/Search/DestinyObjectiveDefinition/Weekly Raid Challenge/"
  ).then(({ results }) => {
    const raidObjectives = results?.results
      ?.filter(
        (objective) =>
          objective?.displayProperties?.name === "Weekly Raid Challenge"
      )
      ?.map((objective) => objective.hash);

    bungieApi("/Destiny2/Milestones/").then((data) => {
      const milestones = Object.values(data)?.filter((milestone) =>
        raidObjectives?.some((objective) =>
          milestone?.activities?.[0]?.challengeObjectiveHashes?.includes(
            objective
          )
        )
      );
      console.log(milestones);

      if (milestones.length === 1) {
        const milestone = milestones[0];

        const start = new Date(milestone?.startDate).getTime();
        const end = new Date(milestone?.endDate).getTime();
        const period = end - start;

        bungieApi(
          "/Destiny2/Manifest/DestinyActivityDefinition/" +
            milestone?.activities?.[0]?.activityHash
        ).then((data) => {
          const name = data?.displayProperties?.name?.split(": ")?.[0];

          featuredRaid.schedule.unshift({ start, end, period, name });

          console.log(featuredRaid);

          writeFileSync(
            "./data/featuredRaid.json",
            JSON.stringify(featuredRaid)
          );
        });
      }
    });
  });
}
