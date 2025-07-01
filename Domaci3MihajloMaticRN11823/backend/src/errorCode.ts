export type APIErrorCommon = {
    failed: true;
    code: string;
    extra: string;
};

export type ErrorCode =
    | "DUPLICATE_USERNAME" //diid
    | "BAD_PICTURE_DATA" // diid
    | "LOGGED_IN" // diid
    | "INCORRECT_CREDENTIALS" // diid
    | "INVALID_DATA" // diid
    | "NO_SUCH_ENTITY" // nee
    | "NOT_YOURS" // nee
    | "NOT_AUTHENTICATED" // diid
    | "INTERNAL_ERROR"; // diid