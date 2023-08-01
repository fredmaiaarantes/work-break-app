import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

export const useLoggedUser = () =>
  useTracker(() => {
    const loggedUser = Meteor.user();

    return { user: loggedUser, isLoading: Meteor.userId() && !loggedUser, isLogged: Meteor.userId() };
  });
