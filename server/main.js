import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import "../imports/config/accounts";
import '/imports/api/time-offs/methods';
import '/imports/api/time-offs/publications';

Meteor.startup(() => {
  const user = Accounts.findUserByEmail('fred@meteor.com');

  if(!user) {
    console.log('Registering initial user');
    Accounts.createUser({
      email: 'fred@meteor.com',
      password: 'abc123',
      profile: {name: "Fred Maia", isManager: true }
    });
  }
});
