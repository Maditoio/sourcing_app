import { boolean, integer, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const countryEnum = pgEnum("country", ["DRC", "Congo-Brazzaville", "Nigeria", "Other"]);
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "approved",
  "quoted",
  "payment_pending",
  "paid",
  "sourcing",
  "shipped",
  "delivered",
  "cancelled",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "order_approved",
  "quote_received",
  "payment_confirmed",
  "order_shipped",
  "order_delivered",
  "general",
]);
export const attachmentTypeEnum = pgEnum("attachment_type", ["reference_image", "proof_of_payment", "document"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  country: countryEnum("country").notNull(),
  city: text("city"),
  deliveryAddress: text("delivery_address"),
  role: roleEnum("role").notNull().default("user"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull().unique(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  referenceUrl: text("reference_url"),
  quantity: integer("quantity").default(1),
  deliveryCountry: text("delivery_country"),
  deliveryCity: text("delivery_city"),
  deliveryAddress: text("delivery_address").notNull(),
  specialInstructions: text("special_instructions"),
  status: orderStatusEnum("status").notNull().default("pending"),
  quotedPrice: numeric("quoted_price", { precision: 12, scale: 2 }),
  quotedCurrency: text("quoted_currency").default("USD"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const orderAttachments = pgTable("order_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  fileType: attachmentTypeEnum("file_type"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  notifications: many(notifications),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  attachments: many(orderAttachments),
  notifications: many(notifications),
}));

export const attachmentsRelations = relations(orderAttachments, ({ one }) => ({
  order: one(orders, { fields: [orderAttachments.orderId], references: [orders.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  order: one(orders, { fields: [notifications.orderId], references: [orders.id] }),
}));

export type User = typeof users.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderAttachment = typeof orderAttachments.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
