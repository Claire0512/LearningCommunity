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
    userId: serial("user_id").primaryKey(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    name: varchar("name"),
    profilePicture: varchar("profile_picture"),
    resumeFile: varchar("resume_file"),
    points: integer("points").default(0),
  }
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  questions: many(questionsTable),
}));


export const postsTable = pgTable(
  "posts",
  {
    postId: serial("post_id").primaryKey(),
    title: varchar("title").notNull(),
    context: text("context").notNull(),
    posterId: integer("poster_id").notNull().references(() => usersTable.userId),
    createdTime: timestamp("created_time").default(new Date()),
  }
);

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [postsTable.posterId],
    references: [usersTable.userId],
  }),
  comments: many(commentsTable),
  tags: many(postTagsTable),
  upvotes: many(upvotesTable),
  downvotes: many(downvotesTable)
}));


export const questionsTable = pgTable(
  "questions",
  {
    questionId: serial("question_id").primaryKey(),
    title: varchar("title").notNull(),
    context: text("context").notNull(),
    posterId: integer("poster_id").notNull().references(() => usersTable.userId),
    isSolved: boolean("is_solved").default(false),
    helpfulCommentId: integer("helpful_comment_id").references(() => commentsTable.commentId)
  }
);

export const questionsRelations = relations(questionsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [questionsTable.posterId],
    references: [usersTable.userId],
  }),
  comments: many(commentsTable),
  tags: many(questionTagsTable),
  upvotes: many(upvotesTable),
}));

export const commentsTable: any = pgTable(
  "comments",
  {
    commentId: serial("comment_id").primaryKey(),
    text: text("text").notNull(),
    commenterId: integer("commenter_id").notNull().references(() => usersTable.userId),
    postId: integer("post_id").references(() => postsTable.postId),
    questionId: integer("question_id").references(() => questionsTable.questionId),
    parentCommentId: integer("parent_comment_id").references(() => commentsTable.commentId),
    isHelpful: boolean("is_helpful").default(false)
  }
);

export const commentsRelations = relations(commentsTable, ({ one, many }) => ({
  upvotes: many(upvotesTable),
  downvotes: many(downvotesTable),
  replies: many(commentsTable),
  user: one(usersTable, {
    fields: [commentsTable.commenterId],
    references: [usersTable.userId],
  }),
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.postId],
  }),
  question: one(questionsTable, {
    fields: [commentsTable.questionId],
    references: [questionsTable.questionId],
  }),
  parentComment: one(commentsTable, {
    fields: [commentsTable.parentCommentId],
    references: [commentsTable.commentId],
  }),
}));


export const tagsTable = pgTable(
  "tags",
  {
    tagId: serial("tag_id").primaryKey(),
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
    postId: integer("post_id").notNull().references(() => postsTable.postId),
    tagId: integer("tag_id").notNull().references(() => tagsTable.tagId)
  },
  (table) => ({
    uniqCombination: unique().on(table.postId, table.tagId)
  })
);

export const postTagsRelations = relations(postTagsTable, ({ one }) => ({
  tag: one(tagsTable, {
    fields: [postTagsTable.tagId],
    references: [tagsTable.tagId],
  }),
  post: one(postsTable, {
    fields: [postTagsTable.postId],
    references: [postsTable.postId],
  })
}));


export const questionTagsTable = pgTable(
  "question_tags",
  {
    questionId: integer("question_id").notNull().references(() => questionsTable.questionId),
    tagId: integer("tag_id").notNull().references(() => tagsTable.tagId)
  },
  (table) => ({
    uniqCombination: unique().on(table.questionId, table.tagId)
  })
);

export const questionTagsRelations = relations(questionTagsTable, ({ one }) => ({
  tag: one(tagsTable, {
    fields: [questionTagsTable.tagId],
    references: [tagsTable.tagId],
  }),
  question: one(questionsTable, {
    fields: [questionTagsTable.questionId],
    references: [questionsTable.questionId],
  })
}));


export const upvotesTable = pgTable(
  "upvotes",
  {
    upvoteId: serial("upvote_id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.userId),
    commentId: integer("comment_id").references(() => commentsTable.commentId),
    postId: integer("post_id").references(() => postsTable.postId),
    questionId: integer("question_id").references(() => questionsTable.questionId)
  }
);

export const upvoteRelations = relations(upvotesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [upvotesTable.userId],
    references: [usersTable.userId],
  }),
  comment: one(commentsTable, {
    fields: [upvotesTable.commentId],
    references: [commentsTable.commentId],
  }),
  post: one(postsTable, {
    fields: [upvotesTable.postId],
    references: [postsTable.postId],
  }),
  question: one(questionsTable, {
    fields: [upvotesTable.questionId],
    references: [questionsTable.questionId],
  }),
}));


export const downvotesTable = pgTable(
  "downvotes",
  {
    downvoteId: serial("upvote_id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.userId),
    commentId: integer("comment_id").references(() => commentsTable.commentId),
    postId: integer("post_id").references(() => postsTable.postId),
  }
);

export const downvoteRelations = relations(downvotesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [downvotesTable.userId],
    references: [usersTable.userId],
  }),
  comment: one(commentsTable, {
    fields: [downvotesTable.commentId],
    references: [commentsTable.commentId],
  }),
  post: one(postsTable, {
    fields: [downvotesTable.postId],
    references: [postsTable.postId],
  }),
}));


export const favoritesTable = pgTable(
  "favorites",
  {
    favoriteId: serial("favorite_id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.userId),
    postId: integer("post_id").references(() => postsTable.postId),
    questionId: integer("question_id").references(() => questionsTable.questionId)
  }
);

export const favoriteRelations = relations(favoritesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [favoritesTable.userId],
    references: [usersTable.userId],
  }),
  question: one(questionsTable, {
    fields: [favoritesTable.questionId],
    references: [questionsTable.questionId],
  }),
  post: one(postsTable, {
    fields: [favoritesTable.postId],
    references: [postsTable.postId],
  }),
}));




