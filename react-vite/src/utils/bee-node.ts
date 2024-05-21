import { Bee, BeeDebug } from "@ethersphere/bee-js";
import { API_DEBUG_URL, API_URL } from "../constant";

const bee = new Bee(API_URL);
const beeDebug = new BeeDebug(API_DEBUG_URL);

export { bee, beeDebug };
