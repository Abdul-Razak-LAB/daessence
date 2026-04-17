import { NextResponse } from "next/server";

export function ok(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(code, message, details, status = 400) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details: details || [],
      },
    },
    { status }
  );
}

export function withErrorHandling(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      return fail("INTERNAL_ERROR", error instanceof Error ? error.message : "Unknown error", [], 500);
    }
  };
}
