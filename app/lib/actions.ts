"use server"; //marks server-side functions that can be called from client-side code

import { z } from "zod";
import { connectToDatabase } from "@/app/lib/connect-to-database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { registerUserInDatabase } from "./register-user";
import { log } from "console";


const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true }); //id and date are always verifed
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};



export async function createInvoice(prevState: State, formData: FormData) {
  const client = await connectToDatabase();
  /*
    safeParse() will return an object containing either a success or error field. This will help handle validation
    more gracefully without having put this logic inside the try/catch block.
  */
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      ...prevState, // Preserve previous state
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await client.query(
      `INSERT INTO invoices (customer_id, amount, status, date)
     VALUES ($1, $2, $3, $4)`,
      [customerId, amountInCents, status, date]
    );
  } catch (error) {
    console.log(error);

    return {
      ...prevState, // Preserve previous state
      message: "Database Error: Failed to Create Invoice.",
    };
  } finally {
    client.release();
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");

  /**
   * Note how redirect is being called outside of the try/catch block.
   * This is because redirect works by throwing an error, which would be caught by the catch block.
   * To avoid this, you can call redirect after try/catch.
   * redirect would only be reachable if try is successful.
   *  **/
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const client = await connectToDatabase();
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      ...prevState, // Preserve previous state
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Failed to Update Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  try {
    await client.query(
      `UPDATE invoices
    SET customer_id = $1, amount = $2, status = $3
    WHERE id = $4`,
      [customerId, amountInCents, status, id]
    );
  } catch (error) {
    console.log(error);
    
    return {
      ...prevState, // Preserve previous state
      message: "Database Error: Failed to Update Invoice.",
    };
  } finally {
    client.release();
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  const client = await connectToDatabase();
  //   throw new Error('Failed to Delete Invoice'); // testing the error page

  try {
    await client.query(`DELETE FROM invoices WHERE id = $1`, [id]);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }

  revalidatePath("/dashboard/invoices");
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function registerUser(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
		await registerUserInDatabase(formData)
    await signIn('credentials', formData);
  } catch (error) {
    const err = error as Error;
    switch (err.message) {
      case 'InvalidData':
        return 'Invalid form data: missing required fields';
      case 'PasswordsDoNotMatch':
        return 'Passwords do not match.';
      case 'duplicate key value violates unique constraint "users_email_key"':
        return 'Email already in use.';
    }
    throw err;
  }
}

export async function requestPasswordReset(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
		// await registerUserInDatabase(formData)
    // await signIn('credentials', formData);
  } catch (error) {
    const err = error as Error;
    switch (err.message) {
      case 'InvalidData':
        return 'Invalid form data: missing required fields';
      case 'PasswordsDoNotMatch':
        return 'Passwords do not match.';
      case 'duplicate key value violates unique constraint "users_email_key"':
        return 'Email already in use.';
    }
    throw err;
  }
}

export async function resetPassword(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
		// await registerUserInDatabase(formData)
    // await signIn('credentials', formData);
  } catch (error) {
    const err = error as Error;
    switch (err.message) {
      case 'InvalidData':
        return 'Invalid form data: missing required fields';
      case 'PasswordsDoNotMatch':
        return 'Passwords do not match.';
      case 'duplicate key value violates unique constraint "users_email_key"':
        return 'Email already in use.';
    }
    throw err;
  }
}

