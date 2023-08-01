import React from "react";
import Navbar from "../components/navbar";
import { useUser, useUserId } from 'meteor/react-meteor-accounts';
import { Navigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { useLoggedUser } from '../components/logged-user';
import { Loading } from '../components/loading';

const NavbarSidebarLayout = function ({ children }) {
  const { user, isLogged, isLoading } = useLoggedUser();

  if(!isLogged) {
    return <Navigate to={'/sign-in'} />
  }

  if(isLoading) {
    return <Loading />
  }

  return (
    <>
      <Navbar user={user} />
      <div className="flex items-start p-8">
        <main className="relative h-full w-full bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </>
  );
};

export default NavbarSidebarLayout;
