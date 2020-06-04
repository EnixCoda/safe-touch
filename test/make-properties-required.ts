import safeTouch from "..";

type Person = {
  friend?: Person;
  name?: string;
};

const jack: Person = {};

function createUser(): Person {
  return Math.random() > 0.5 ? {} : { friend: jack };
}

const u = safeTouch(createUser()).friend(); // user0 or undefined

// Although friend is optional in User, but we don't need to use ! here to chain them
const uu = safeTouch(createUser()).friend.friend({}); // undefined
const uuu = safeTouch(createUser()).friend.friend(); // undefined
