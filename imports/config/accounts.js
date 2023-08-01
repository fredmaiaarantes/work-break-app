import { Accounts } from 'meteor/accounts-base';

/**
 * Configure the default field selector for the published user object.
 */
Accounts.config({
  defaultFieldSelector: {
    username: 1,
    emails: 1,
    createdAt: 1,
    profile: 1,
    services: 1,
    email: 1,
    initials: 1,
  }
});

/**
 * Hook that runs when a new user is created.
 *
 * @param {Object} options - The options provided when creating the user.
 * @param {Object} user - The initial user object.
 * @returns {Object} The modified user object.
 */
Accounts.onCreateUser((options, user) => {
  const customUser = Object.assign({
    initials: `${options.profile.name[0]}${options.profile.name[1]}`.toUpperCase()
  }, user);

  // We still want the default hook's 'profile' behavior.
  if (options.profile) {
    customUser.email = user.emails[0].address;
    customUser.profile = options.profile;
  }
  return customUser;
});
