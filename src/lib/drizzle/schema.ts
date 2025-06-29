import { relations, sql } from 'drizzle-orm';
import { pgTable, real, timestamp, varchar, text, boolean } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const trip = pgTable('trip', {
	id: varchar('id', { length: 30 })
		.primaryKey()
		.$defaultFn(() => nanoid(10)),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	tripName: text('trip_name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$onUpdate(
		() => sql`now()`
	)
});

export const flight = pgTable('flight', {
	id: varchar('id', { length: 30 })
		.primaryKey()
		.$defaultFn(() => nanoid(10)),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	tripId: varchar('trip_id')
		.notNull()
		.references(() => trip.id, { onDelete: 'cascade' }),
	airline: text('airline').notNull(),
	flightNumber: text('flight_number').notNull(),
	fromCity: text('from_city').notNull(),
	fromCountry: text('from_country').notNull(),
	toCity: text('to_city').notNull(),
	toCountry: text('to_country').notNull(),
	departureTimestamp: timestamp('departure_timestamp', {
		withTimezone: true,
		mode: 'string'
	}).notNull(),
	arrivalTimestamp: timestamp('arrival_timestamp', {
		withTimezone: true,
		mode: 'string'
	}).notNull(),
	fromAirport: text('from_airport'),
	toAirport: text('to_airport'),
	cost: real('cost'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$onUpdate(
		() => sql`now()`
	)
});

export const stay = pgTable('stay', {
	id: varchar('id', { length: 30 })
		.primaryKey()
		.$defaultFn(() => nanoid(10)),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	tripId: varchar('trip_id')
		.notNull()
		.references(() => trip.id, { onDelete: 'cascade' }),
	type: text('type').default('hotel').notNull(),
	stayName: text('stay_name').notNull(),
	address: text('address'),
	city: text('city').notNull(),
	country: text('country').notNull(),
	checkIn: timestamp('check_in', { withTimezone: true, mode: 'string' }).notNull(),
	checkOut: timestamp('check_out', { withTimezone: true, mode: 'string' }).notNull(),
	cost: real('cost'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$onUpdate(
		() => sql`now()`
	)
});

export const pack = pgTable('pack', {
	id: varchar('id', { length: 30 })
		.primaryKey()
		.$defaultFn(() => nanoid(10)),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	tripId: varchar('trip_id')
		.notNull()
		.references(() => trip.id, { onDelete: 'cascade' }),
	item: text('item').notNull(),
	done: boolean('done').notNull().default(false),
	remark: text('remark'),
	category: text('category').default('others'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$onUpdate(
		() => sql`now()`
	)
});

export const gift = pgTable('gift', {
	id: varchar('id', { length: 30 })
		.primaryKey()
		.$defaultFn(() => nanoid(10)),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	tripId: varchar('trip_id')
		.notNull()
		.references(() => trip.id, { onDelete: 'cascade' }),
	item: text('item').notNull(),
	done: boolean('done').notNull().default(false),
	remark: text('remark'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$onUpdate(
		() => sql`now()`
	)
});

export const activity = pgTable('activity', {
	id: varchar('id', { length: 30 })
		.primaryKey()
		.$defaultFn(() => nanoid(10)),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	tripId: varchar('trip_id')
		.notNull()
		.references(() => trip.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	location: text('location'),
	cost: real('cost'),
	done: boolean('done').notNull().default(false),
	remark: text('remark'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).$onUpdate(
		() => sql`now()`
	)
});

// Better Auth

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at'),
	isAnonymous: boolean('is_anonymous').default(false)
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

/**
 * Drizzle Relations
 */

export const userRelations = relations(user, ({ many }) => ({
	trips: many(trip),
	flights: many(flight),
	stays: many(stay),
	packs: many(pack),
	gifts: many(gift)
}));

export const tripRelations = relations(trip, ({ one, many }) => ({
	user: one(user, {
		fields: [trip.userId],
		references: [user.id]
	}),
	flights: many(flight),
	stays: many(stay),
	packs: many(pack),
	gifts: many(gift)
}));

export const flightRelations = relations(flight, ({ one }) => ({
	user: one(user, {
		fields: [flight.userId],
		references: [user.id]
	}),
	trip: one(trip, {
		fields: [flight.tripId],
		references: [trip.id]
	})
}));

export const stayRelations = relations(stay, ({ one }) => ({
	user: one(user, {
		fields: [stay.userId],
		references: [user.id]
	}),
	trip: one(trip, {
		fields: [stay.tripId],
		references: [trip.id]
	})
}));

export const packRelations = relations(pack, ({ one }) => ({
	user: one(user, {
		fields: [pack.userId],
		references: [user.id]
	}),
	trip: one(trip, {
		fields: [pack.tripId],
		references: [trip.id]
	})
}));

export const giftRelations = relations(gift, ({ one }) => ({
	user: one(user, {
		fields: [gift.userId],
		references: [user.id]
	}),
	trip: one(trip, {
		fields: [gift.tripId],
		references: [trip.id]
	})
}));
