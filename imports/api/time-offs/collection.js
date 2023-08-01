import { Mongo } from 'meteor/mongo';

/**
 * A collection object representing the 'timeOff' MongoDB collection.
 * @type {Mongo.Collection}
 */
export const TimeOffCollection = new Mongo.Collection('timeOff');
