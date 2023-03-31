import { writeFileSync } from "fs";
import { bungieApi } from "../functions/query.js";

export const stringVariables = () => {
  bungieApi("/Destiny2/3/Profile/4611686018508263319/?components=1200")
    .then(
      ({
        profileStringVariables: {
          data: { integerValuesByHash: stringVariables },
        },
      }) => {
        writeFileSync(
          "./data/stringVariables.json",
          JSON.stringify(stringVariables)
        );
        console.log("success");
      }
    )
    .catch((error) => {
      error?.response?.status === 503
        ? console.warn("Bungie API Down.")
        : console.error(error);
    });
};
