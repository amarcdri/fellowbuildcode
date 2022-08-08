class CustomError extends Error {
    private date;
    constructor(...params: any) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params)
  
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError)
        }
  
        this.name = 'CustomError'
        // Custom debugging information
        // this.code = code
        this.date = new Date()
    }
}
export = CustomError;