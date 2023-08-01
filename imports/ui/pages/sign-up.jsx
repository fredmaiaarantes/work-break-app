import React from "react";
import { Alert, Button, Card, Label, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

const SignUpPage = function () {
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if(password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    Accounts.createUser({email, password, profile: {name}}, error => {
      if (error) {
        const reason = error?.reason || 'Unexpected error, please try again.';
        setError(reason);
        return;
      }
      navigate('/');
    });
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <div className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Work Break logo"
          src="/images/work-break.png"
          className="mr-3 h-20"
        />
      </div>
      <Card
        horizontal
        imgSrc="/images/authentication/create-account.jpg"
        imgAlt=""
        className="w-full md:max-w-screen-lg [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Create your account
        </h1>
        {error ? (
          <Alert
            color="failure"
            onDismiss={()=>alert("Alert dismissed!")}
          >
            <span>{error}</span>
          </Alert>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Name</Label>
            <TextInput
              required
              id="name"
              name="name"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Your email</Label>
            <TextInput
              required
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Your password</Label>
            <TextInput
              required
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <TextInput
              required
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mb-7">
            <Button type="submit" className="w-full lg:w-auto">
              Create account
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Already have an account?&nbsp;
            <Link to="/sign-in" className="text-primary-600 dark:text-primary-200">
              Login here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignUpPage;
