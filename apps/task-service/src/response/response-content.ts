export class Response<T> {
    success: boolean;
    content: T;
    error: string;

    constructor(success: boolean, content: T, error: string) {
        this.success = success;
        this.content = content;
        this.error = error;
    }

    public static Success<T>(content: T) {
        return new Response(true, content, '');
    }

    public static Error(error: string) {
        return new Response(false, null, error);
    }

    public static Empty() {
        return new Response(true, null, '');
    }
}
