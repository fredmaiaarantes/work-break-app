import React from "react";
import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import { Link, useNavigate } from 'react-router-dom';

const SignInPage = function () {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    Meteor.loginWithPassword(email, password, function (error) {
      if (error) {
        setError(error.reason || 'Unexpected error, please try again.');
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
        imgSrc="/images/authentication/take-a-break.png"
        imgAlt=""
        className="w-full md:max-w-screen-lg [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Sign in to platform
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
          <div className="mb-6 flex justify-end">
            <a
              href="#"
              className="w-1/2 text-right text-sm text-primary-600 dark:text-primary-300"
            >
              Lost Password?
            </a>
          </div>
          <div className="mb-6">
            <Button type="submit" className="w-full lg:w-auto">
              Login to your account
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Not registered?&nbsp;
            <Link to="/sign-up" className="text-primary-600 dark:text-primary-300">
              Create account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
