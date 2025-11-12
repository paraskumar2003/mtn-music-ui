import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import styles from "./tailwind.css?url";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: styles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-4 max-w-2xl mx-auto">
        <h1 className="text-9xl font-bold text-gray-800 mb-4">
          {is404 ? "404" : "Error"}
        </h1>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-3">
            {is404 ? "Page Not Found" : "Something Went Wrong"}
          </h2>
          <p className="text-lg text-gray-600">{details}</p>
        </div>
        <a
          href="/login"
          className="inline-block bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Go Back Home
        </a>
        {stack && (
          <pre className="mt-8 text-left w-full p-4 overflow-x-auto bg-gray-900 text-gray-100 rounded-lg">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
