'use client';
import { lusitana } from '@/app/ui/fonts';
import {
	KeyIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { resetPassword } from '@/app/lib/actions';

export default function EnterNewPasswordForm() {
	const [errorMessage, formAction, isPending] = useActionState(
		resetPassword,
		undefined,
	);
	return (
		<form className="space-y-3 min-h-screen flex items-center justify-center bg-blackbg-500 p-4" action={formAction}>
			<div className="w-full max-w-md bg-blackbg-400 rounded-2xl shadow-2xl border border-blackbg-600 px-8 py-10">
				<h1 className={`${lusitana.className} mb-6 text-3xl font-bold text-white text-center`}>
					Create New Password
				</h1>
				<p className="text-gray-300 text-center mb-6 text-sm">
					Your new password must be different from previously used passwords.
				</p>
				<div className="w-full">
					<div>
						<label
							className="mb-2 block text-sm font-medium text-gray-300"
							htmlFor="password"
						>
							New Password
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-lg border border-blackbg-600 bg-blackbg-500 py-3 pl-12 text-sm text-white placeholder-gray-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
								id="password"
								type="password"
								name="password"
								placeholder="Enter new password"
								required
								minLength={8}
							/>
							<KeyIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-orange-400" />
						</div>
					</div>
					<div className="mt-4">
						<label
							className="mb-2 block text-sm font-medium text-gray-300"
							htmlFor="confirmPassword"
						>
							Confirm New Password
						</label>
						<div className="relative">
							<input
								className="peer block w-full rounded-lg border border-blackbg-600 bg-blackbg-500 py-3 pl-12 text-sm text-white placeholder-gray-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
								id="confirmPassword"
								type="password"
								name="confirmPassword"
								placeholder="Confirm new password"
								required
								minLength={8}
							/>
							<KeyIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-orange-400" />
						</div>
					</div>
				</div>
				<Button 
					className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors duration-300 ease-in-out flex items-center justify-center" 
					aria-disabled={isPending}
				>
					Reset Password <ArrowRightIcon className="ml-2 h-5 w-5" />
				</Button>
				<div
					className="flex h-8 items-end space-x-2 mt-4 justify-center"
					aria-live="polite"
					aria-atomic="true"
				>
					{errorMessage && (
						<div className="flex items-center">
							<ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
							<p className="text-sm text-red-400">{errorMessage}</p>
						</div>
					)}
				</div>
			</div>
		</form>
	);
}