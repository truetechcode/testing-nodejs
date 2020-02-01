import {
  APIError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError
} from "../errors";

describe("Test HTTP Error Classes", () => {
  test("APIError", () => {
    const message = "API ERROR MESSAGE";
    const code = 500;
    const error = new APIError(code, message);

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(code);
    expect(error).toMatchInlineSnapshot(`[Error: API ERROR MESSAGE]`);
  });

  test("UnauthorizedError", () => {
    const message = "UNAUTHORIZED ERROR MESSAGE";
    const error = new UnauthorizedError(message);

    expect(error).toBeInstanceOf(APIError);
    expect(error.status).toBe(401);
    expect(error).toMatchInlineSnapshot(`[Error: UNAUTHORIZED ERROR MESSAGE]`);
  });

  test("BadRequestError", () => {
    const message = "BAD REQUEST ERROR";
    const error = new BadRequestError(message);

    expect(error).toBeInstanceOf(APIError);
    expect(error.status).toBe(400);
    expect(error).toMatchInlineSnapshot(
      `[Error: Bad Request: BAD REQUEST ERROR]`
    );
  });

  test("NotFoundError", () => {
    const message = "BAD REQUEST ERROR";
    const error = new NotFoundError(message);

    expect(error).toBeInstanceOf(APIError);
    expect(error.status).toBe(404);
    expect(error).toMatchInlineSnapshot(`[Error: BAD REQUEST ERROR]`);
  });
});
