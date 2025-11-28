import "server-only";

import { StackServerApp } from "@stackframe/stack";
import { stackClientApp } from "./client";

export const stackServerApp = new StackServerApp({
    inheritsFrom: stackClientApp,
    apiKey: process.env.STACK_SECRET_SERVER_KEY,
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
});
