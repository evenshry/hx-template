import pubEnv from "./pub.env";
import prodEnv from "./prod.env";
import localEnv from "./local.env";

let env: ENV.Config = {};

const MODE = import.meta.env.MODE;
if (MODE) {
  if (MODE === "development") {
    env = { ...pubEnv, ...localEnv };
  } else if (MODE === "testing") {
    env = { ...pubEnv };
  } else if (MODE === "production") {
    env = { ...prodEnv };
  } else {
    env = {};
  }
} else {
  env = {};
}

console.log(env);

export default env;
