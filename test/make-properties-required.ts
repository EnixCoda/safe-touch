import safeTouch from '../lib'

type Person = {
  friend?: Person
}

const jack: Person = {}

function createUser(): Person {
  return Math.random() > 0.5 ? {} : { friend: jack }
}

safeTouch(createUser()).friend() // user0 or undefined

// Although friend is optional in User, but we don't need to use ! here to chain them
safeTouch(createUser()).friend.friend() // undefined
