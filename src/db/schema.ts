import { sql, relations } from "drizzle-orm";

import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    user_id: serial("user_id").primaryKey(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    name: varchar("name"),
    profile_picture: varchar("profile_picture"),
    resume_file: varchar("resume_file"),
    points: integer("points").default(0),
    hearts: integer("hearts").default(0),
    upvotes: integer("upvotes").default(0),
    downvotes: integer("downvotes").default(0),
    favorites: integer("favorites").default(0),
    checkmarks: integer("checkmarks").default(0)
  }
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
}));


export const postsTable = pgTable(
  "posts",
  {
    post_id: serial("post_id").primaryKey(),
    title: varchar("title").notNull(),
    context: text("context").notNull(),
    poster_id: integer("poster_id").notNull().references(() => usersTable.user_id),
    total_upvotes: integer("total_upvotes").default(0),
    total_downvotes: integer("total_downvotes").default(0),
    total_comments: integer("total_comments").default(0),
    total_favorites: integer("total_favorites").default(0)
  }
);

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [postsTable.poster_id],
    references: [usersTable.user_id],
  }),
  comments: many(commentsTable),
  tags: many(postTagsTable)
}));


export const questionsTable = pgTable(
  "questions",
  {
    question_id: serial("question_id").primaryKey(),
    title: varchar("title").notNull(),
    context: text("context").notNull(),
    poster_id: integer("poster_id").notNull().references(() => usersTable.user_id),
    total_hearts: integer("total_hearts").default(0),
    total_comments: integer("total_comments").default(0),
    is_solved: boolean("is_solved").default(false),
    helpful_comment_id: integer("helpful_comment_id").references(() => commentsTable.comment_id)
  }
);

export const questionsRelations = relations(questionsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [questionsTable.poster_id],
    references: [usersTable.user_id],
  }),
  comments: many(commentsTable),
  tags: many(questionTagsTable)
}));

export const commentsTable: any = pgTable(
  "comments",
  {
    comment_id: serial("comment_id").primaryKey(),
    text: text("text").notNull(),
    commenter_id: integer("commenter_id").notNull().references(() => usersTable.user_id),
    post_id: integer("post_id").references(() => postsTable.post_id),
    question_id: integer("question_id").references(() => questionsTable.question_id),
    parent_comment_id: integer("parent_comment_id").references(() => commentsTable.comment_id),
    is_helpful: boolean("is_helpful").default(false)
  }
);

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [commentsTable.commenter_id],
    references: [usersTable.user_id],
  }),
  post: one(postsTable, {
    fields: [commentsTable.post_id],
    references: [postsTable.post_id],
  }),
  question: one(questionsTable, {
    fields: [commentsTable.question_id],
    references: [questionsTable.question_id],
  }),
  parentComment: one(commentsTable, {
    fields: [commentsTable.parent_comment_id],
    references: [commentsTable.comment_id],
  })
}));


export const tagsTable = pgTable(
  "tags",
  {
    tag_id: serial("tag_id").primaryKey(),
    name: varchar("name").notNull(),
    category: varchar("category")
  }
);

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  posts: many(postTagsTable),
  questions: many(questionTagsTable)
}));


export const postTagsTable = pgTable(
  "post_tags",
  {
    post_id: integer("post_id").notNull().references(() => postsTable.post_id),
    tag_id: integer("tag_id").notNull().references(() => tagsTable.tag_id)
  },
  (table) => ({
    uniqCombination: unique().on(table.post_id, table.tag_id)
  })
);

export const postTagsRelations = relations(postTagsTable, ({ one }) => ({
  tag: one(tagsTable, {
    fields: [postTagsTable.tag_id],
    references: [tagsTable.tag_id],
  }),
}));


export const questionTagsTable = pgTable(
  "question_tags",
  {
    question_id: integer("question_id").notNull().references(() => questionsTable.question_id),
    tag_id: integer("tag_id").notNull().references(() => tagsTable.tag_id)
  },
  (table) => ({
    uniqCombination: unique().on(table.question_id, table.tag_id)
  })
);

export const questionTagsRelations = relations(questionTagsTable, ({ one }) => ({
  tag: one(tagsTable, {
    fields: [questionTagsTable.tag_id],
    references: [tagsTable.tag_id],
  }),
}));


export const interactionsTable = pgTable(
  "interactions",
  {
    interaction_id: serial("interaction_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.user_id),
    target_id: integer("target_id").notNull(),
    type: varchar("type").notNull(),
    target_type: varchar("target_type").notNull(),
    is_active: boolean("is_active").default(true)
  }
);




