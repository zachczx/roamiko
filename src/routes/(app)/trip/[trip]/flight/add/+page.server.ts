import { db } from '$lib/drizzle/db';
import { flight, trip } from '$lib/drizzle/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod/v4';
import { message } from 'sveltekit-superforms';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const flightFormSchema = z
	.object({
		tripId: z.string().min(1, 'Trip ID is required'),
		airline: z.string().min(1, 'Airline is required'),
		flightNumber: z.string().min(1, 'Flight is required'),
		fromCity: z.string().min(1, 'From city is required'),
		fromCountry: z.string().min(1, 'From country is required'),
		toCity: z.string().min(1, 'To city is required'),
		toCountry: z.string().min(1, 'To country is required'),
		departureTimestamp: z.iso.datetime({ local: true }),
		arrivalTimestamp: z.iso.datetime({ local: true }),
		fromAirport: z.string().optional(),
		toAirport: z.string().optional(),
		cost: z.number().positive().optional(),
		step: z.string().optional()
	})
	.refine((data) => new Date(data.departureTimestamp) <= new Date(data.arrivalTimestamp), {
		path: ['arrivalTimestamp'],
		error: 'Arrival date-time must be after departure!'
	});

export const load = async ({ params, locals, url }) => {
	if (!locals.user) {
		error(403, { message: 'Not authenticated!' });
	}
	const tripId = params.trip;
	const step = url.searchParams.get('step');
	const tripRows = await db
		.select()
		.from(trip)
		.where(and(eq(trip.id, tripId), eq(trip.userId, locals.user.id)));
	const tripRecord: TripProps = {
		createdAtSemantic: dayjs(tripRows[0].createdAt).fromNow(),
		createdAtFormatted: dayjs(tripRows[0].createdAt).format('DD MMM, YYYY'),
		...tripRows[0]
	};
	const form = await superValidate(zod4(flightFormSchema));

	return { form, tripId, trip: tripRecord, step };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(flightFormSchema));
		if (!locals.user) {
			return fail(403, { form });
		}
		if (!form.valid) {
			return fail(400, { form });
		}

		const insert = await db.insert(flight).values({
			userId: locals.user?.id,
			tripId: form.data.tripId,
			airline: form.data.airline,
			flightNumber: form.data.flightNumber,
			fromCity: form.data.fromCity,
			fromCountry: form.data.fromCountry,
			toCity: form.data.toCity,
			toCountry: form.data.toCountry,
			departureTimestamp: form.data.departureTimestamp,
			arrivalTimestamp: form.data.arrivalTimestamp,
			fromAirport: form.data.fromAirport,
			toAirport: form.data.toAirport,
			cost: form.data.cost
		});
		console.log(insert);

		// For form wizard functionality
		if (form.data.step === 'outbound') {
			redirect(307, `/trip/${form.data.tripId}/flight/add/step?=return`);
		}
		if (form.data.step === 'return') {
			redirect(307, `/trip/${form.data.tripId}/stay/add/step?=stay`);
		}

		return message(form, {
			status: 'success',
			text: 'Form posted successfully!'
		});
	}
} satisfies Actions;
