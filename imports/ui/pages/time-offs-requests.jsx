import React from "react";
import NavbarSidebarLayout from '../layouts/navbar-layout';
import { Button, Spinner, Timeline } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';
import { useLoggedUser } from '../components/logged-user';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { TimeOffCollection } from '../../api/time-offs/collection';
import { Loading } from '../components/loading';

const TimeOffsRequestsPage = function () {
  const { user, isLoading } = useLoggedUser();
  const isLoadingTimeOffs = useSubscribe('myManagedTimeOffs');
  const requests = useFind(() =>
    TimeOffCollection.find({}, { sort: { createdAt: -1 }}), []
  );

  async function approveRequest({ _id }) {
    try {
      await Meteor.callAsync('TimeOff.approve', { _id });
    } catch (error) {
      console.log(error);
    }
  }

  async function declineRequest({ _id }) {
    try {
      await Meteor.callAsync('TimeOff.decline', { _id });
    } catch (error) {
      console.log(error);
    }
  }

  if(isLoading || isLoadingTimeOffs()) {
    return <Loading />
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    )
  }

  return (
    <NavbarSidebarLayout>
      <div className="p-4 w-full">
        <div className="sm:flex">
          <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Waiting for your approval
            </h1>
          </div>
        </div>
      </div>
      {requests.length === 0 ? (
        <p className="ml-3 text-gray-500 dark:text-gray-400 sm:ml-4">
          You don't have any pending requests.
        </p>
      ) : null}
      <Timeline>
        {requests.map((request) => (
          <Timeline.Item key={request._id}>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>
                From {request.startDate.toDateString()} to {request.endDate.toDateString()}
              </Timeline.Time>
              <Timeline.Title>
                {request.type} requested by  {request.requesterName}
              </Timeline.Title>
              <Timeline.Body>
                <p>
                  Details: {request.details}
                </p>
              </Timeline.Body>
              <Button.Group>
                <Button color="gray" onClick={() => approveRequest({ _id: request._id })}>
                  <HiCheck className="mr-3 h-4 w-4" />
                  <p>
                    Approve
                  </p>
                </Button>
                <Button color="gray" onClick={() => declineRequest({ _id: request._id })}>
                  <HiX className="mr-3 h-4 w-4" />
                  <p>
                    Decline
                  </p>
                </Button>
              </Button.Group>
            </Timeline.Content>
          </Timeline.Item>
        ))}
      </Timeline>
    </NavbarSidebarLayout>
  )
}

export default TimeOffsRequestsPage;
