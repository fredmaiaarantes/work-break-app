import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TimeOffCollection } from './collection';

/**
 * Creates a new time off request.
 *
 * @param {Object} options - The options for the time off request.
 * @param {string} options.type - The type of time off.
 * @param {string} options.duration - The duration of the time off.
 * @param {Date} options.startDate - The start date of the time off.
 * @param {Date} options.endDate - The end date of the time off.
 * @param {string} options.details - Additional details about the time off request.
 * @returns {Promise<string>} A promise that resolves to the ID of the newly created time off request.
 */
export async function create({ type, duration, startDate, endDate, details }) {
  check(type, String);
  check(duration, String);
  check(startDate, Date);
  check(endDate, Date);
  check(details, String);

  const manager = Meteor.users.findOne({ 'profile.isManager': true });
  const requester = Meteor.user();

  const timeOff = {
    type,
    duration,
    startDate,
    endDate,
    details,
    requesterName: requester.profile.name,
    requesterUserId: requester._id,
    managerNam: manager.profile.name,
    managerUserId: manager._id,
    status: 'Pending'
  }
  return TimeOffCollection.insertAsync(timeOff);
}

/**
 * Cancels a time off request.
 *
 * @param {Object} options - The options for canceling the time off request.
 * @param {string} options._id - The ID of the time off request to cancel.
 * @returns {Promise<void>} A promise that resolves when the time off request is successfully canceled.
 * @throws {Meteor.Error} Throws an error if the request is not in a pending state or the user is not the requester.
 */
export async function cancelRequest({ _id }) {
  check(_id, String);

  const timeOff = await TimeOffCollection.findOneAsync(_id);
  if(timeOff.status !== 'Pending') {
    throw new Meteor.Error('not-authorized', 'You can only cancel pending requests');
  }
  const isRequester = timeOff.requesterUserId === Meteor.userId();
  if(!isRequester) {
    throw new Meteor.Error('not-authorized', 'You are not allowed to cancel this request');
  }
  return TimeOffCollection.updateAsync(_id, { $set: { status: 'Canceled' } });
}

/**
 * Approves a time off request.
 *
 * @param {Object} options - The options for approving the time off request.
 * @param {string} options._id - The ID of the time off request to approve.
 * @returns {Promise<void>} A promise that resolves when the time off request is successfully approved.
 * @throws {Meteor.Error} Throws an error if the request is not in a pending state or the user is not the manager.
 */
export async function approveRequest({ _id }) {
  check(_id, String);

  const timeOff = await TimeOffCollection.findOneAsync({ _id });
  if(timeOff.status !== 'Pending') {
    throw new Meteor.Error('not-authorized', 'You can only approve pending requests');
  }
  const isManager = timeOff.managerUserId === Meteor.userId();
  if(!isManager) {
    throw new Meteor.Error('not-authorized', 'You are not allowed to approve this request');
  }
  return TimeOffCollection.updateAsync(_id, { $set: { status: 'Approved' } });
}

/**
 * Declines a time off request.
 *
 * @param {Object} options - The options for declining the time off request.
 * @param {string} options._id - The ID of the time off request to decline.
 * @returns {Promise<void>} A promise that resolves when the time off request is successfully declined.
 * @throws {Meteor.Error} Throws an error if the request is not in a pending state or the user is not the manager.
 */
export async function declineRequest({ _id }) {
  check(_id, String);

  const timeOff = await TimeOffCollection.findOneAsync({ _id });
  if(timeOff.status !== 'Pending') {
    throw new Meteor.Error('not-authorized', 'You can only decline pending requests');
  }
  const isManager = timeOff.managerUserId === Meteor.userId();
  if(!isManager) {
    throw new Meteor.Error('not-authorized', 'You are not allowed to decline this request');
  }
  return TimeOffCollection.updateAsync(_id, { $set: { status: 'Declined' } });
}

/**
 * Finds a time off request by ID.
 *
 * @param {Object} options - The options for finding the time off request.
 * @param {string} options._id - The ID of the time off request to find.
 * @returns {Promise<Object>} A promise that resolves to the time off request object.
 */
export async function findById({ _id }) {
  check(_id, String);
  return TimeOffCollection.findOneAsync(_id);
}

/**
 * Meteor method mappings for the time off requests.
 */
Meteor.methods({
  'TimeOff.create': create,
  'TimeOff.cancel': cancelRequest,
  'TimeOff.approve': approveRequest,
  'TimeOff.decline': declineRequest,
  'TimeOff.find': findById
});
