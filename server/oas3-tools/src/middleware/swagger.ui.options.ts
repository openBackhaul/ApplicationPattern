export class SwaggerUiOptions {
    public apiDocsPath: string;
    public swaggerUIPath: string;
    public swaggerUiDir: string;

    constructor(apiDocsPath: string, swaggerUIPath: string, swaggerUiDir: string) {
        this.apiDocsPath = apiDocsPath;
        this.swaggerUIPath = swaggerUIPath;
        this.swaggerUiDir = swaggerUiDir;

        this.sanitize();
    }

    private sanitize() {
        if (this.apiDocsPath.charAt(this.apiDocsPath.length -1) === '/') {
            this.apiDocsPath = this.apiDocsPath.substring(0, this.apiDocsPath.length - 1);
        }

        if (this.swaggerUIPath.charAt(this.swaggerUIPath.length -1) === '/') {
            this.swaggerUIPath = this.swaggerUIPath.substring(0, this.swaggerUIPath.length - 1);
        }
    }
}