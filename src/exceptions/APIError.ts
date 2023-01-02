class APIError extends Error {
    public status = 500;
    public error = "";
    constructor(message: string, statusCode: number) {
        super(message);
        Object.setPrototypeOf(this, APIError.prototype);
        this.name = "APIError";
        this.status = statusCode;
    }
}

export default APIError;
