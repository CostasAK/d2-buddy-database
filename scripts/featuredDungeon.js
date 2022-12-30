import { readFileSync, writeFileSync } from "fs";

import { bungieApi } from "../functions/query.js";

export const featuredDungeon = () => {
  let featuredDungeonJson = JSON.parse(
    readFileSync("./data/featuredDungeon.json", "utf8")
  );

  if (!(featuredDungeonJson?.schedule?.[0]?.end >= Date.now())) {
    bungieApi(
      "/Destiny2/Armory/Search/DestinyMilestoneDefinition/Weekly Dungeon Challenge/"
    )
      .then(({ results }) => {
        console.log(results);
        const dungeonMilestones = results?.results
          ?.filter(
            (objective) =>
              objective?.displayProperties?.name === "Weekly Dungeon Challenge"
          )
          ?.map((objective) => objective.hash);

        bungieApi("/Destiny2/Milestones/").then((data) => {
          const milestones = dungeonMilestones
            .map((milestone) => data?.[milestone])
            ?.filter(
              (milestone) =>
                milestone?.activities?.[0]?.challengeObjectiveHashes?.length > 0
            );

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

              featuredDungeonJson.schedule.unshift({
                start,
                end,
                period,
                name,
              });

              writeFileSync(
                "./data/featuredDungeon.json",
                JSON.stringify(featuredDungeonJson)
              );
            });
          }
        });
      })
      .catch((error) => {
        error.response.status === 503
          ? console.warn("Bungie API Down.")
          : console.error(error);
      });
  }
};
