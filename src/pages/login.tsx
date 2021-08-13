import { ApolloError, gql, useMutation } from '@apollo/client';
import React from 'react'
import { useForm, useFormState } from 'react-hook-form'
import { FormError } from '../components/form-error';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';
import fuberLogo from '../images/logo.svg';
import { Button } from '../components/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';

const LOGIN_MUTATION = gql`
    mutation loginMutation($loginInput:LoginInput!) {
        login(input: $loginInput) {
            ok
            token
            error
        }
    }
`;

interface ILoginForm {
    email: string
    password: string
}

const Login = () => {

    //useForm
    const { register, watch, formState: { errors, isValid }, handleSubmit, getValues } = useForm<ILoginForm>({
        mode: 'onChange'
    });

    const onCompleted = (data: loginMutation) => {
        const { login: { error, ok, token } } = data;
        if (ok && token) {
            localStorage.setItem(LOCALSTORAGE_TOKEN, token);
            authTokenVar(token)
            isLoggedInVar(true)
        }
    }

    //useMutation
    const [LoginMutation, { data: loginMutationResult, loading }] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION, {
        onCompleted
    });

    const onSubmit = () => {
        if (!loading) {
            const { email, password } = getValues();
            LoginMutation({
                variables: {
                    loginInput: {
                        email,
                        password
                    },
                },
            })
        }
    }

    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>Login | Uber Eats</title>
            </Helmet>
            <div className="w-full max-w-sm flex flex-col px-5 items-center ">
                <img src={fuberLogo} className="w-52 mb-10" alt=" " />
                <h4 className="w-full text-left font-medium text-2xl mb-1">Welcome back</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 mb-5 w-full">
                    <input
                        {...register('email', {
                            required: true,
                            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        })}
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="input" />
                    {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
                    {errors.email?.type === "pattern" && <FormError errorMessage={"Please enter a valid email"} />}

                    <input
                        {...register('password', {
                            required: true,
                        })}
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="input" />
                    {errors.password?.message && (<FormError errorMessage={errors.password?.message} />)}
                    {errors.password?.type === "minLength" && <FormError errorMessage="Password must be 10 characters" />}
                    <Button canClick={isValid} loading={loading} actionText={"Log in"} />
                    {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
                </form>
                <div>
                    New to Uber ? <Link to="/create-account" className="text-lime-600 hover:underline">Create a Account</Link>
                </div>
            </div>
        </div>
    )
}

export default Login
