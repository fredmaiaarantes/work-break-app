import React from "react";
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { HiCheck, HiOutlineCalendar } from 'react-icons/hi';

const ExampleNavbar = function ({ user }) {

  return (
    <Navbar
      fluid
      rounded
    >
      <Navbar.Brand
        href="/"
      >
        <img
          alt="Work Break logo"
          src="/images/work-break.png"
          className="mr-3 h-12"
        />
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          inline
          label={<Avatar rounded placeholderInitials={user.initials} />}
        >
          <Dropdown.Header>
            <span className="block text-sm">
              {user?.profile?.name}
            </span>
            <span className="block truncate text-sm font-medium">
              {user?.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => Meteor.logout()}>
            Sign out
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {user?.profile?.isManager ? (
          <>
            <Navbar.Link
              href="/"
            >
              <div className='flex'>
                <HiOutlineCalendar className="mr-2 h-5 w-5" />
                <p>
                  My Time Offs
                </p>
              </div>
            </Navbar.Link>
            <Navbar.Link
              href="/requests"
            >
              <div className='flex'>
                <HiCheck className="mr-2 h-5 w-5" />
                <p>
                  Time Offs Requests
                </p>
              </div>
            </Navbar.Link>
          </>
        ) : null}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ExampleNavbar;
