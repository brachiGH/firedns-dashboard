"use server"; //marks server-side functions that can be called from client-side code

import { z } from "zod";
import { connectToDatabase } from "@/app/lib/connect-to-database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { registerUserInDatabase } from "./register-user";
import argon2 from "argon2";
import crypto from 'crypto'; // Import crypto using ES module syntax

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

const ResetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string(),
  // Add a field for the reset token if you are using one
  // token: z.string().min(1, { message: "Invalid or missing reset token." }), 
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Path of error
});

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
): Promise<string | undefined> { // Ensure return type matches state
  const client = await connectToDatabase();
  const email = formData.get('email');

  // Basic validation
  if (!email || typeof email !== 'string') {
    return 'Please enter a valid email address.';
  }

  try {
    // 1. Check if user exists
    const userResult = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // Don't reveal if email exists for security, return a generic message
      console.log(`Password reset requested for non-existent email: ${email}`);
      return 'If an account with that email exists, a password reset link has been sent.'; 
    }
    const userId = userResult.rows[0].id;

    // 2. Generate a secure, unique, time-limited token
    // Example using crypto (more secure than simple strings)
    // const crypto = require('crypto'); // Remove this line
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token expiry (e.g., 10 minutes)
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); 

    // 3. Store the hashed token and expiry date in the database for the user
    await client.query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
      [passwordResetToken, passwordResetExpires, userId]
    );

    // 4. Send the email with the reset link (containing the non-hashed token)
    // This requires an email sending service (e.g., SendGrid, Nodemailer)
    // const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`; // Adjust URL as needed
    // await sendPasswordResetEmail(email, resetURL); // Implement this function

    console.log(`Password reset token generated for email: ${email}`); // Log for debugging
    // console.log(`Reset URL (for testing): ${resetURL}`); // Log URL for testing ONLY

    return 'If an account with that email exists, a password reset link has been sent.';

  } catch (error) {
    console.error("Password Reset Request Error:", error);
    return 'An error occurred while requesting the password reset. Please try again.';
  } finally {
    client.release();
  }
}

export async function resetPassword(
  prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> { // Ensure return type matches state
  const client = await connectToDatabase();

  // Extract token from formData if passed via hidden input, or handle differently if it's in the URL
  // const token = formData.get('token'); // Assuming you add a hidden input for the token

  // For this example, let's assume the token is handled separately (e.g., read from URL params on the page component)
  // You would need to pass the token to this action, perhaps by adding it to formData in the component
  // or by creating a separate action/mechanism.

  // Validate form data
  const validatedFields = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    // token: token // Include token if validating here
  });

  if (!validatedFields.success) {
    // Combine error messages or return the first one
    const firstError = validatedFields.error.flatten().fieldErrors;
    const errorMessage = Object.values(firstError).flat()[0] || "Invalid input.";
    return errorMessage;
  }

  const { password } = validatedFields.data;

  // --- Placeholder for Token Verification ---
  // You MUST add logic here to:
  // 1. Get the token (from formData or elsewhere).
  // 2. Hash the received token using the same method as when generating it (SHA256).
  // 3. Find the user associated with the *hashed* token in the database.
  // 4. Check if the token exists and has not expired.
  // If verification fails, return an error message like "Invalid or expired password reset token."
  // Example (needs the actual token):
  /*
  if (!token || typeof token !== 'string') {
      return "Invalid or missing reset token.";
  }
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const userResult = await client.query(
      'SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [hashedToken]
  );
  if (userResult.rows.length === 0) {
      return "Invalid or expired password reset token.";
  }
  const userId = userResult.rows[0].id;
  */
  // --- End Placeholder ---

  // For now, let's assume token verification passed and we have a userId
  const userId = 'placeholder-user-id'; // Replace with actual userId after token verification

  try {
    // Hash the new password
    const hashedPassword = await argon2.hash(password);

    // Update the user's password and clear the reset token fields
    await client.query(
      'UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
      [hashedPassword, userId] // Use the actual userId obtained from token verification
    );

    console.log(`Password successfully reset for user ID: ${userId}`); // Replace with actual ID

    // Optionally redirect to login page on success
    // redirect('/login'); // Uncomment and adjust path if needed

    // Return undefined (or null) to indicate success with no error message
    return undefined;

  } catch (error) {
    console.error("Password Reset Error:", error);
    return 'Database Error: Failed to reset password.';
  } finally {
    client.release();
  }
}

