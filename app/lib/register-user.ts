import argon2 from "argon2"; 
import { connectToDatabase } from "../lib/connect-to-database";

const client = await connectToDatabase();

export async function registerUserInDatabase(formData: FormData) {
    if (!formData.has('name') || !formData.has('email') || !formData.has('password')) {
      throw new Error('InvalidData');
    }

    if (formData.get('password') != formData.get('confirmPassword')) {
      throw new Error('PasswordsDoNotMatch');
    }

    const user = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const hashedPassword = await argon2.hash(user.password); 
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3);
    `;
    const values = [user.name, user.email, hashedPassword];
    return client.query(query, values);

}