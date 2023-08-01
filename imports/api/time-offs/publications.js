import { Meteor } from 'meteor/meteor';
import { TimeOffCollection } from './collection';

/**
 * Publishes the time off requests that are managed by the current user and have a status of 'Pending'.
 *
 * @function publishTimeOffs
 * @memberof Meteor.server.publish
 * @returns {Mongo.Cursor} - A cursor representing the published time off requests.
 */
Meteor.publish('myManagedTimeOffs', function publishTimeOffs() {
  return TimeOffCollection.find({ managerUserId: Meteor.userId(), status: 'Pending' });
});

/**
 * Publishes the time off requests made by the current user.
 *
 * @function publishMyTimeOffs
 * @memberof Meteor.server.publish
 * @returns {Mongo.Cursor} - A cursor representing the published time off requests.
 */
Meteor.publish('myTimeOffs', function publishMyTimeOffs() {
  return TimeOffCollection.find({ requesterUserId: Meteor.userId });
});
