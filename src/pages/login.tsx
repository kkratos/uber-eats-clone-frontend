import { ApolloError, gql, useMutation } from '@apollo/client';
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '../components/form-error';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';


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
    const { register, watch, formState: { errors }, handleSubmit, getValues } = useForm<ILoginForm>();

    const onCompleted = (data: loginMutation) => {
        const { login: { error, ok, token } } = data;
        if (ok) {
            console.log(token);
        }
    }

    const [LoginMutation, { data: loginMutationResult }] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION, {
        onCompleted
    });

    const onSubmit = () => {
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

    return (
        <div className="h-screen flex items-center justify-center bg-gray-800">
            <div className="bg-white w-full max-w-lg py-10 pb-7 rounded-lg text-center">
                <h3 className="text-2xl text-gray-800">Log In</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
                    <input
                        {...register('email', {
                            required: true
                        })}
                        name="email"
                        type="email"
                        placeholder="Email"
                        className=" input mb-3" />
                    {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
                    <input
                        {...register('password', {
                            required: true,
                        })}
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="input" />
                    {errors.password?.message &&
                        (<FormError errorMessage={errors.password?.message} />)}
                    {errors.password?.type === "minLength" && <FormError errorMessage="Password must be 10 characters" />}
                    <button className="btn">Log In</button>
                    {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
                </form>
            </div>
        </div >
    )
}

export default Login
