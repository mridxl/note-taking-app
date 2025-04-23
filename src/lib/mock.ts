export const mockNotes = [
  {
    id: "1",
    title: "Getting Started with React",
    content:
      "React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and efficiently update the DOM when data changes. React uses a virtual DOM to optimize rendering performance. To get started with React, you need to understand components, props, and state.\n\nComponents are the building blocks of React applications. They can be functional or class-based. Props are how data is passed between components, while state is data that can change over time within a component.",
    summary:
      "An introduction to React, covering components, props, and state management basics.",
    created_at: "2025-04-20T10:30:00Z",
    updated_at: "2025-04-21T15:45:00Z",
    user_id: "user123",
  },
  {
    id: "2",
    title: "NextJS 14 Features",
    content:
      "Next.js 14 introduces several exciting features including improved server components, nested layouts, and enhanced data fetching. Server components allow rendering React components on the server, reducing the JavaScript sent to the client. Nested layouts make it easier to share UI across routes while maintaining state. The new data fetching mechanisms simplify working with async data.\n\nAnother notable improvement is the built-in optimization for images and fonts, which helps improve Core Web Vitals scores without additional configuration.",
    summary:
      "Overview of Next.js 14's key features including server components and nested layouts.",
    created_at: "2025-04-18T09:15:00Z",
    updated_at: "2025-04-23T11:20:00Z",
    user_id: "user123",
  },
  {
    id: "3",
    title: "TypeScript Best Practices",
    content:
      "TypeScript improves code quality by adding static types to JavaScript. Some best practices include: proper interface definitions, using union types for flexibility, avoiding the 'any' type when possible, and leveraging type inference.\n\nIt's also recommended to use const assertions, discriminated unions for complex state management, and generic types for reusable components. TypeScript configuration should be adjusted based on project requirements, with stricter settings for larger codebases.",
    summary:
      "Essential TypeScript practices for writing maintainable and type-safe code.",
    created_at: "2025-04-15T14:25:00Z",
    updated_at: "2025-04-22T16:30:00Z",
    user_id: "user123",
  },
];

export const findNoteById = (id: string) => {
  return mockNotes.find((note) => note.id === id) || null;
};

export const updateNote = (
  id: string,
  updatedNote: Partial<(typeof mockNotes)[0]>,
) => {
  const index = mockNotes.findIndex((note) => note.id === id);
  if (index !== -1) {
    mockNotes[index] = {
      ...mockNotes[index],
      ...updatedNote,
      updated_at: new Date().toISOString(),
    };
    return mockNotes[index];
  }
  return null;
};

export const deleteNote = (id: string) => {
  const index = mockNotes.findIndex((note) => note.id === id);
  if (index !== -1) {
    mockNotes.splice(index, 1);
    return true;
  }
  return false;
};

export const addNote = (
  note: Omit<(typeof mockNotes)[0], "id" | "created_at" | "updated_at">,
) => {
  const newNote = {
    ...note,
    id: `${mockNotes.length + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  mockNotes.push(newNote);
  return newNote;
};
