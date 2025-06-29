import { db } from '$lib/drizzle/db';
import { trip } from '$lib/drizzle/schema';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod/v4';

const tripFormSchema = z.object({
	tripName: z.string(),
	guided: z.boolean().default(true)
});

export const load = async ({ url }) => {
	const form = await superValidate(zod4(tripFormSchema));
	const step = url.searchParams.get('step');
	return { form, step };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(tripFormSchema));
		if (!locals.user) {
			return fail(403, { form });
		}
		if (!form.valid) {
			return fail(400, { form });
		}

		const inserted = await db
			.insert(trip)
			.values({
				userId: locals.user?.id,
				tripName: form.data.tripName
			})
			.returning();
		console.log(inserted);
		if (inserted.length === 0) {
			return error(500, 'Server error!');
		}

		if (!form.data.guided) {
			return message(form, {
				status: 'success',
				text: 'Form posted successfully!',
				insertedId: inserted[0].id
			});
		}

		redirect(307, `/trip/${inserted[0].id}/flight/add?step=outbound`);
	}
} satisfies Actions;
