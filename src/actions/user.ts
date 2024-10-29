'use server';

import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { redirect } from 'next/navigation';
import { hash } from 'bcryptjs';
import { signIn } from '@/auth';
import {CredentialsSignin} from "next-auth";

const login = async (formData: FormData) => {
   const email = formData.get('email') as string;
   const password = formData.get('password') as string;

   try {
      await signIn("credentials", {
         redirect: false,
         callbackUrl: "/",
         email,
         password,
      });
   } catch (error) {
      const someError = error as CredentialsSignin;
      return someError.cause;
   }
   redirect("/");
};

const register = async (formData: FormData) => {
   const firstName = formData.get('firstname') as string;
   const lastName = formData.get('lastname') as string;
   const email = formData.get('email') as string;
   const password = formData.get('password') as string;

   if (!firstName || !lastName || !email || !password) {
      throw new Error('All fields are required');
   }

   await connectDB();

   /**
    * existing user
    * 1. check if user exists
    * 2. hash password
    * 3. create new user
    */

   const existingUser = await User.findOne({ email });
   if (existingUser) {
      throw new Error('User already exists');
   }

   const hashedPassword = await hash(password, 10);

   const user = new User({
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword,
   });

   await user.save();

   redirect('/login');
};

const fetchAllUsers = async () => {
   await connectDB();
   const users = await User.find({});
   return users;
};

export { register, login, fetchAllUsers };
