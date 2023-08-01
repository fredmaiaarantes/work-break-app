import React from 'react';
import {
  Button,
  Label,
  Modal,
  Select,
  Table,
  Textarea,
  TextInput
} from 'flowbite-react';
import { useState } from "react";
import {
  HiOutlineExclamationCircle,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../layouts/navbar-layout";
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { Loading } from '../components/loading';
import { TimeOffCollection } from '../../api/time-offs/collection';

const TimeOffsPage = function () {
  return (
    <NavbarSidebarLayout>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                My Time Offs
              </h1>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddTimeOffModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllTimeOffsTable />
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const AddTimeOffModal = function () {
  const [isOpen, setOpen] = useState(false);

  const [type, setType] = useState("Vacation");
  const [duration, setDuration] = useState("Full day or several days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [details, setDetails] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const timeOff = {
        type,
        duration,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        details
      }
      await Meteor.callAsync('TimeOff.create', timeOff);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Button color="gray" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Time Off
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>New time off request</strong>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="types">I'm tacking</Label>
                <div className="mt-1">
                  <Select
                    id="types"
                    required
                    onSelect={(e) => setType(e.target.value)}
                  >
                    <option>
                      Vacation
                    </option>
                    <option>
                      Sick Leave
                    </option>
                    <option>
                      Personal Leave
                    </option>
                    <option>
                      Public Holiday
                    </option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="department">Duration</Label>
                <div className="mt-1">
                  <Select
                    id="types"
                    required
                    onSelect={(e) => setDuration(e.target.value)}
                  >
                    <option>
                      Full day or several days
                    </option>
                    <option>
                      Part of a day
                    </option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <div className="mt-1">
                  <TextInput
                    id="startDate"
                    name="startDate"
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <div className="mt-1">
                  <TextInput
                    id="endDate"
                    name="endDate"
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="details">Details</Label>
                <div className="mt-1">
                  <Textarea
                    id="details"
                    name="details"
                    placeholder="Share some details about your request..."
                    required
                    rows={3}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>
            Send request
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const AllTimeOffsTable = function () {
  const isLoading = useSubscribe('myTimeOffs');
  const requests = useFind(() =>
    TimeOffCollection.find({}, { sort: { createdAt: -1 }}), []
  );

  if(isLoading()) {
    return <Loading />
  }

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Type</Table.HeadCell>
        <Table.HeadCell>Duration</Table.HeadCell>
        <Table.HeadCell>Start Date</Table.HeadCell>
        <Table.HeadCell>End Date</Table.HeadCell>
        <Table.HeadCell>Details</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {requests.length === 0 ? (
          <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              No time off requests yet
            </Table.Cell>
          </Table.Row>
          ) : null }

        {requests.map((request) => (
          <Table.Row key={request._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {request.type}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {request.duration}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              {request.startDate.toDateString()}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              {request.endDate.toDateString()}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              {request.details}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              <div className="flex items-center">
                {request.status}
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-x-3 whitespace-nowrap">
                <CancelTimeOffModal request={request}/>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const CancelTimeOffModal = function({ request }) {
  const [isOpen, setOpen] = useState(false);

  async function cancelRequest() {
    try {
      await Meteor.callAsync('TimeOff.cancel', { _id: request._id });
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Button color="failure" onClick={() => setOpen(true)} disabled={request.status !== 'Pending'}>
        <div className="flex items-center gap-x-2">
          <HiTrash className="text-lg" />
          Cancel request
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-6 pt-6 pb-0">
          <span className="sr-only">Cancel request</span>
        </Modal.Header>
        <Modal.Body className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to cancel this Time Off request?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={cancelRequest}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, never mind
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TimeOffsPage;
